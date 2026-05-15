// Local Storage Manager
class LocalStorageManager {
    constructor(storageKey = 'todoList') {
        this.storageKey = storageKey;
    }

    // Get all tasks from localStorage
    getTasks() {
        const tasks = localStorage.getItem(this.storageKey);
        return tasks ? JSON.parse(tasks) : [];
    }

    // Save tasks to localStorage
    saveTasks(tasks) {
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    }

    // Add a new task
    addTask(task) {
        const tasks = this.getTasks();
        tasks.push(task);
        this.saveTasks(tasks);
        return task;
    }

    // Update a task
    updateTask(id, updatedData) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updatedData };
            this.saveTasks(tasks);
        }
    }

    // Delete a task
    deleteTask(id) {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(t => t.id !== id);
        this.saveTasks(filteredTasks);
    }

    // Delete all tasks
    deleteAllTasks() {
        localStorage.removeItem(this.storageKey);
    }

    // Clear completed tasks
    clearCompleted() {
        const tasks = this.getTasks();
        const activeTasks = tasks.filter(t => !t.completed);
        this.saveTasks(activeTasks);
    }
}

// To-Do List Application
class ToDoApp {
    constructor() {
        this.storage = new LocalStorageManager();
        this.currentFilter = 'all';
        this.editingId = null;

        this.initializeElements();
        this.attachEventListeners();
        this.loadTasks();
        this.updateStats();
    }

    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.deleteAllBtn = document.getElementById('deleteAllBtn');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.totalTasksEl = document.getElementById('totalTasks');
        this.completedTasksEl = document.getElementById('completedTasks');
        this.remainingTasksEl = document.getElementById('remainingTasks');
    }

    attachEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.deleteAllBtn.addEventListener('click', () => this.deleteAll());

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });
    }

    // Add a new task
    addTask() {
        const text = this.taskInput.value.trim();
        
        if (text === '') {
            alert('Please enter a task!');
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleDateString(),
            updatedAt: new Date().toLocaleDateString()
        };

        this.storage.addTask(task);
        this.taskInput.value = '';
        this.loadTasks();
        this.updateStats();
    }

    // Load and display tasks
    loadTasks() {
        const tasks = this.storage.getTasks();
        const filteredTasks = this.filterTasks(tasks);

        this.taskList.innerHTML = '';

        if (filteredTasks.length === 0) {
            this.emptyState.style.display = 'block';
        } else {
            this.emptyState.style.display = 'none';
            filteredTasks.forEach(task => {
                this.renderTask(task);
            });
        }
    }

    // Render a single task
    renderTask(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.id = `task-${task.id}`;

        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                data-id="${task.id}"
            >
            <span class="task-text">${this.escapeHtml(task.text)}</span>
            <span class="task-date">${task.createdAt}</span>
            <div class="task-actions">
                <button class="task-btn edit-btn" data-id="${task.id}">✏️</button>
                <button class="task-btn delete-btn" data-id="${task.id}">🗑️</button>
            </div>
        `;

        // Checkbox event
        li.querySelector('.task-checkbox').addEventListener('change', (e) => {
            this.toggleTask(task.id);
        });

        // Edit button event
        li.querySelector('.edit-btn').addEventListener('click', (e) => {
            this.openEditModal(task);
        });

        // Delete button event
        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            this.deleteTask(task.id);
        });

        this.taskList.appendChild(li);
    }

    // Toggle task completion
    toggleTask(id) {
        const tasks = this.storage.getTasks();
        const task = tasks.find(t => t.id === id);
        
        if (task) {
            task.completed = !task.completed;
            this.storage.updateTask(id, { completed: task.completed });
            this.loadTasks();
            this.updateStats();
        }
    }

    // Delete a task
    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.storage.deleteTask(id);
            this.loadTasks();
            this.updateStats();
        }
    }

    // Edit task modal
    openEditModal(task) {
        const newText = prompt('Edit your task:', task.text);
        
        if (newText !== null && newText.trim() !== '') {
            this.storage.updateTask(task.id, { text: newText.trim() });
            this.loadTasks();
        }
    }

    // Clear completed tasks
    clearCompleted() {
        if (confirm('Clear all completed tasks? This action cannot be undone.')) {
            this.storage.clearCompleted();
            this.loadTasks();
            this.updateStats();
        }
    }

    // Delete all tasks
    deleteAll() {
        if (confirm('Delete ALL tasks? This action cannot be undone.')) {
            this.storage.deleteAllTasks();
            this.loadTasks();
            this.updateStats();
        }
    }

    // Filter tasks
    filterTasks(tasks) {
        switch (this.currentFilter) {
            case 'active':
                return tasks.filter(t => !t.completed);
            case 'completed':
                return tasks.filter(t => t.completed);
            default:
                return tasks;
        }
    }

    // Set filter
    setFilter(filter) {
        this.currentFilter = filter;
        
        this.filterBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        this.loadTasks();
    }

    // Update statistics
    updateStats() {
        const tasks = this.storage.getTasks();
        const completed = tasks.filter(t => t.completed).length;
        const remaining = tasks.length - completed;

        this.totalTasksEl.textContent = tasks.length;
        this.completedTasksEl.textContent = completed;
        this.remainingTasksEl.textContent = remaining;
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ToDoApp();
});
