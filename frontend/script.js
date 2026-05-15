// Сүлжээ Хяналтын Систем - JavaScript

const API_BASE = 'http://localhost:3000/api';

// Utility Functions
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    if (tabName === 'maintenance') loadMaintenance();
    if (tabName === 'motors') loadMotors();
    if (tabName === 'dashboard') loadDashboard();
}

function showAlert(message, type = 'warning') {
    const alertContainer = document.getElementById('alertContainer');
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    alertContainer.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('mn-MN');
}

function daysUntil(dateString) {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Maintenance Functions
async function loadMaintenance() {
    try {
        const response = await fetch(`${API_BASE}/maintenance`);
        const data = await response.json();
        displayMaintenance(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayMaintenance(items) {
    const container = document.getElementById('maintenanceList');
    if (items.length === 0) {
        container.innerHTML = '<p class="loading">Цэвэрлэгээ үйлчилгээ байхгүй</p>';
        return;
    }

    container.innerHTML = items.map(item => {
        const daysLeft = daysUntil(item.next_scheduled);
        const isOverdue = daysLeft < 0;
        const statusClass = isOverdue ? 'overdue' : 'active';
        const statusText = isOverdue ? '⚠️ Хэтэрлээ' : `${daysLeft} хоног`;

        return `
            <div class="item-card">
                <h3>${item.service_name}</h3>
                <p><strong>Сүүлийн цэвэрлэгээ:</strong> ${formatDate(item.last_cleaned)}</p>
                <p><strong>Дараах цэвэрлэгээ:</strong> ${formatDate(item.next_scheduled)}</p>
                <p><span class="status ${statusClass}">${statusText}</span></p>
                <p><strong>Төлөв:</strong> ${item.status === 'completed' ? '✅ Дуусгасан' : '🔄 Хүлээгдэж байна'}</p>
            </div>
        `;
    }).join('');
}

function openMaintenanceModal() {
    document.getElementById('maintenanceModal').classList.add('show');
}

function closeMaintenanceModal() {
    document.getElementById('maintenanceModal').classList.remove('show');
}

async function addMaintenance(event) {
    event.preventDefault();
    const serviceName = document.getElementById('serviceName').value;

    try {
        const response = await fetch(`${API_BASE}/maintenance/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ service_name: serviceName })
        });
        const data = await response.json();
        showAlert('Цэвэрлэгээ нэмэгдлээ', 'warning');
        closeMaintenanceModal();
        document.getElementById('serviceName').value = '';
        loadMaintenance();
        loadDashboard();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Motor Functions
async function loadMotors() {
    try {
        const response = await fetch(`${API_BASE}/motors`);
        const data = await response.json();
        displayMotors(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayMotors(items) {
    const container = document.getElementById('motorList');
    if (items.length === 0) {
        container.innerHTML = '<p class="loading">Мотор байхгүй</p>';
        return;
    }

    container.innerHTML = items.map(item => {
        return `
            <div class="item-card">
                <h3>${item.motor_name}</h3>
                <p><strong>Төлөв:</strong> ${item.status === 'running' ? '✅ Ажиллаж байна' : '⛔ Зогсож байна'}</p>
                <p><strong>Ажиллах цаг:</strong> ${item.operation_hours} цаг</p>
                <p><strong>Alert:</strong> ${item.alert_status === 'normal' ? '✅ Хэвийнэ' : '⚠️ Анхааруулах'}</p>
                <p><strong>Сүүлийн шалгалт:</strong> ${formatDate(item.last_checked)}</p>
            </div>
        `;
    }).join('');
}

function openMotorModal() {
    document.getElementById('motorModal').classList.add('show');
}

function closeMotorModal() {
    document.getElementById('motorModal').classList.remove('show');
}

async function addMotor(event) {
    event.preventDefault();
    const motorName = document.getElementById('motorName').value;

    try {
        const response = await fetch(`${API_BASE}/motors/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ motor_name: motorName })
        });
        const data = await response.json();
        showAlert('Мотор нэмэгдлээ', 'warning');
        closeMotorModal();
        document.getElementById('motorName').value = '';
        loadMotors();
        loadDashboard();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Dashboard Functions
async function loadDashboard() {
    try {
        const mainResponse = await fetch(`${API_BASE}/maintenance`);
        const mainData = await mainResponse.json();

        const motorResponse = await fetch(`${API_BASE}/motors`);
        const motorData = await motorResponse.json();

        const alertResponse = await fetch(`${API_BASE}/alerts`);
        const alertData = await alertResponse.json();

        document.getElementById('maintenanceCount').textContent = mainData.length;
        document.getElementById('motorCount').textContent = motorData.length;
        document.getElementById('alertCount').textContent = alertData.length;
        
        const runningMotors = motorData.filter(m => m.status === 'running').length;
        document.getElementById('runningMotorCount').textContent = runningMotors;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadMaintenance();
    loadMotors();
    loadDashboard();

    window.onclick = function (event) {
        const mainModal = document.getElementById('maintenanceModal');
        const motorModal = document.getElementById('motorModal');
        if (event.target === mainModal) mainModal.classList.remove('show');
        if (event.target === motorModal) motorModal.classList.remove('show');
    };
});
