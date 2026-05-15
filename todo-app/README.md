# 📝 To-Do List Application

A modern, fully-functional to-do list app with **local storage persistence**. No server or database required!

## ✨ Features

✅ **Create, Read, Update, Delete** - Full CRUD operations  
💾 **Local Storage** - Tasks automatically save to browser storage  
🔍 **Filter Tasks** - View All, Active, or Completed tasks  
📊 **Statistics Dashboard** - Real-time task counts  
✏️ **Edit Tasks** - Update task text inline  
🗑️ **Delete Tasks** - Remove individual or all tasks  
📱 **Responsive Design** - Works perfectly on mobile and desktop  
🎨 **Modern UI** - Beautiful gradient design with smooth animations  
🔒 **Secure** - XSS protection built-in  

## 🎯 Quick Start

1. Open `index.html` in your web browser
2. Start adding tasks immediately
3. All data saves automatically to local storage

**No installation needed!** Pure vanilla JavaScript.

## 📂 File Structure

```
todo-app/
├── index.html      # HTML structure
├── styles.css      # Modern styling & animations
├── script.js       # Core logic with LocalStorageManager
└── README.md       # Documentation
```

## 🚀 How It Works

### Core Classes

#### `LocalStorageManager`
Handles all data persistence:
- `getTasks()` - Retrieve all tasks
- `saveTasks(tasks)` - Save tasks to localStorage
- `addTask(task)` - Add new task
- `updateTask(id, data)` - Update existing task
- `deleteTask(id)` - Delete a task
- `clearCompleted()` - Remove completed tasks
- `deleteAllTasks()` - Clear all data

#### `ToDoApp`
Main application controller:
- Task rendering and management
- Filter functionality (all/active/completed)
- Event listener setup
- Statistics calculation
- XSS protection

### Data Structure

Each task is stored as:
```javascript
{
  id: 1234567890,           // Unique timestamp ID
  text: "Task description",  // Task content
  completed: false,          // Completion status
  createdAt: "5/15/2026",   // Creation date
  updatedAt: "5/15/2026"    // Last modified date
}
```

## 💡 Usage Examples

### Add a Task
- Type in the input field
- Press Enter or click "Add Task"
- Task appears in the list

### Filter Tasks
- Click "All" to see everything
- Click "Active" for incomplete tasks
- Click "Completed" for finished tasks

### Edit a Task
- Click the ✏️ button on any task
- Enter the new text
- Click OK

### Delete a Task
- Click the 🗑️ button on the task
- Confirm deletion

### Clear Actions
- **Clear Completed** - Removes all finished tasks
- **Delete All** - Removes everything (warning shown)

## 🎨 UI Components

### Statistics Dashboard
Displays:
- Total Tasks
- Completed Tasks
- Remaining Tasks

### Filter Buttons
- All (default)
- Active
- Completed

### Task Cards
Each task shows:
- Checkbox (for completion)
- Task text
- Creation date
- Edit button
- Delete button

### Empty State
Shows when no tasks match current filter

## 🔧 Customization

### Change Storage Key
```javascript
// In script.js, modify:
this.storage = new LocalStorageManager('customKey');
```

### Modify Styling
Edit `styles.css` to change:
- Colors and gradients
- Font sizes
- Spacing and padding
- Animations

### Add Features
Extend the classes to add:
- Due dates
- Priority levels
- Categories/tags
- Dark mode
- Export/import

## 🌐 Browser Support

✅ Chrome/Edge (88+)  
✅ Firefox (78+)  
✅ Safari (14+)  
✅ Mobile browsers  

## 💾 Local Storage

Tasks are stored in `localStorage` with key `'todoList'` by default.

**Viewing stored data in console:**
```javascript
JSON.parse(localStorage.getItem('todoList'))
```

**Clearing all data:**
```javascript
localStorage.removeItem('todoList')
```

## 🔒 Security

- ✅ XSS Prevention - HTML escaping on task text
- ✅ Input Validation - Empty task prevention
- ✅ Confirmation Dialogs - Delete actions require confirmation

## 📝 Future Enhancements

- [ ] Due dates & reminders
- [ ] Priority levels
- [ ] Categories/tags
- [ ] Dark mode toggle
- [ ] Export to JSON/CSV
- [ ] Drag & drop reordering
- [ ] Search functionality
- [ ] Recurring tasks

## 📄 License

Free to use and modify. No attribution required.

---

**Start organizing your tasks today!** 🚀
