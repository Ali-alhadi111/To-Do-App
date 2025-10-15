// To-Do App with Voice Input and Notifications
class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.recognition = null;
        this.isRecording = false;
        
        this.init();
    }

    init() {
        this.loadTasks();
        this.setupEventListeners();
        this.setupVoiceRecognition();
        this.setupNotifications();
        this.renderTasks();
        this.checkNotificationPermission();
    }

    // Local Storage Functions
    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('todoTasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
            // Convert deadline strings back to Date objects
            this.tasks.forEach(task => {
                if (task.deadline) {
                    task.deadline = new Date(task.deadline);
                }
            });
        }
    }

    // Task Management
    addTask(text, category = 'personal', deadline = null) {
        const task = {
            id: Date.now().toString(),
            text: text.trim(),
            category: category,
            completed: false,
            createdAt: new Date(),
            deadline: deadline ? new Date(deadline) : null
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.scheduleNotification(task);
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([50, 50, 50]);
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
        }
    }

    editTask(id, newText) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.text = newText.trim();
            this.saveTasks();
            this.renderTasks();
        }
    }

    // Filtering
    filterTasks(category) {
        this.currentFilter = category;
        this.updateCategoryButtons();
        this.renderTasks();
    }

    updateCategoryButtons() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === this.currentFilter) {
                btn.classList.add('active');
            }
        });
    }

    getFilteredTasks() {
        if (this.currentFilter === 'all') {
            return this.tasks;
        }
        return this.tasks.filter(task => task.category === this.currentFilter);
    }

    // Rendering
    renderTasks() {
        const taskList = document.getElementById('taskList');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            taskList.innerHTML = this.getEmptyStateHTML();
            return;
        }

        taskList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
    }

    createTaskHTML(task) {
        const isOverdue = task.deadline && new Date() > task.deadline && !task.completed;
        const deadlineText = task.deadline ? this.formatDeadline(task.deadline) : '';
        
        return `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="todoApp.toggleTask('${task.id}')">
                    ${task.completed ? '✓' : ''}
                </div>
                <div class="task-content">
                    <div class="task-text ${task.completed ? 'completed' : ''}" onclick="todoApp.editTaskInline('${task.id}')">
                        ${this.escapeHtml(task.text)}
                    </div>
                    <div class="task-meta">
                        <span class="task-category ${task.category}">${task.category}</span>
                        ${deadlineText ? `<span class="task-deadline ${isOverdue ? 'overdue' : ''}">${deadlineText}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn edit" onclick="todoApp.editTaskInline('${task.id}')" aria-label="Edit task">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                        </svg>
                    </button>
                    <button class="task-btn delete" onclick="todoApp.deleteTask('${task.id}')" aria-label="Delete task">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
            </li>
        `;
    }

    getEmptyStateHTML() {
        const categoryText = this.currentFilter === 'all' ? 'tasks' : this.currentFilter;
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-text">No ${categoryText} tasks yet</div>
                <div class="empty-state-subtext">Add a new task to get started</div>
            </div>
        `;
    }

    // Inline editing
    editTaskInline(id) {
        const task = this.tasks.find(task => task.id === id);
        if (!task) return;

        const taskElement = document.querySelector(`[data-id="${id}"]`);
        const textElement = taskElement.querySelector('.task-text');
        
        const currentText = textElement.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'task-edit-input';
        input.style.cssText = `
            width: 100%;
            padding: 4px 8px;
            border: 1px solid var(--primary-blue);
            border-radius: 4px;
            font-size: 16px;
            background: var(--bg-primary);
            color: var(--text-primary);
        `;

        const saveEdit = () => {
            const newText = input.value.trim();
            if (newText && newText !== currentText) {
                this.editTask(id, newText);
            }
            textElement.textContent = task.text;
        };

        const cancelEdit = () => {
            textElement.textContent = task.text;
        };

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            } else if (e.key === 'Escape') {
                cancelEdit();
            }
        });

        textElement.textContent = '';
        textElement.appendChild(input);
        input.focus();
        input.select();
    }

    // Date formatting
    formatDeadline(deadline) {
        const now = new Date();
        const diff = deadline - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        
        if (days < 0) {
            return 'Overdue';
        } else if (days === 0) {
            return 'Today';
        } else if (days === 1) {
            return 'Tomorrow';
        } else if (days <= 7) {
            return `In ${days} days`;
        } else {
            return deadline.toLocaleDateString();
        }
    }

    // Voice Recognition
    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isRecording = true;
                this.updateVoiceUI();
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.processVoiceInput(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isRecording = false;
                this.updateVoiceUI();
            };

            this.recognition.onend = () => {
                this.isRecording = false;
                this.updateVoiceUI();
            };
        }
    }

    processVoiceInput(transcript) {
        // Simple voice command processing
        const text = transcript.toLowerCase();
        
        if (text.includes('add') || text.includes('create') || text.includes('new')) {
            // Extract task text after keywords
            const taskText = transcript.replace(/\b(add|create|new)\b/gi, '').trim();
            if (taskText) {
                this.addTask(taskText);
                this.showNotification('Task added via voice!');
            }
        } else {
            // Treat as regular task text
            this.addTask(transcript);
            this.showNotification('Task added via voice!');
        }
    }

    updateVoiceUI() {
        const statusElement = document.getElementById('voiceStatus');
        const startBtn = document.getElementById('voiceStartBtn');
        const stopBtn = document.getElementById('voiceStopBtn');
        
        if (this.isRecording) {
            statusElement.innerHTML = `
                <div class="voice-animation">
                    <div class="voice-wave"></div>
                    <div class="voice-wave"></div>
                    <div class="voice-wave"></div>
                </div>
                <p>Listening...</p>
            `;
            startBtn.style.display = 'none';
            stopBtn.style.display = 'block';
        } else {
            statusElement.innerHTML = `
                <div class="voice-animation">
                    <div class="voice-wave"></div>
                    <div class="voice-wave"></div>
                    <div class="voice-wave"></div>
                </div>
                <p>Click to start speaking...</p>
            `;
            startBtn.style.display = 'block';
            stopBtn.style.display = 'none';
        }
    }

    startVoiceRecording() {
        if (this.recognition && !this.isRecording) {
            this.recognition.start();
        }
    }

    stopVoiceRecording() {
        if (this.recognition && this.isRecording) {
            this.recognition.stop();
        }
    }

    // Notifications
    setupNotifications() {
        // Check if notifications are supported
        if ('Notification' in window) {
            // Request permission on first load
            if (Notification.permission === 'default') {
                this.showNotificationPermission();
            }
        }
    }

    checkNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'granted') {
            // Hide notification permission banner
            const permissionBanner = document.getElementById('notificationPermission');
            if (permissionBanner) {
                permissionBanner.style.display = 'none';
            }
        }
    }

    showNotificationPermission() {
        const permissionBanner = document.getElementById('notificationPermission');
        if (permissionBanner) {
            permissionBanner.style.display = 'block';
        }
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.showNotification('Notifications enabled!');
                this.checkNotificationPermission();
            }
        }
    }

    scheduleNotification(task) {
        if ('Notification' in window && Notification.permission === 'granted' && task.deadline) {
            const now = new Date();
            const deadline = new Date(task.deadline);
            const timeUntilDeadline = deadline - now;
            
            // Schedule notification 1 hour before deadline
            const notificationTime = timeUntilDeadline - (60 * 60 * 1000);
            
            if (notificationTime > 0) {
                setTimeout(() => {
                    this.showNotification(`Reminder: "${task.text}" is due soon!`);
                }, notificationTime);
            }
        }
    }

    showNotification(message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('To-Do App', {
                body: message,
                icon: '/icon-192.png',
                badge: '/icon-192.png'
            });
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Add task form
        const addTaskForm = document.getElementById('addTaskForm');
        addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const taskInput = document.getElementById('taskInput');
            const categorySelect = document.getElementById('categorySelect');
            const deadlineInput = document.getElementById('deadlineInput');
            
            const text = taskInput.value.trim();
            const category = categorySelect.value;
            const deadline = deadlineInput.value || null;
            
            if (text) {
                this.addTask(text, category, deadline);
                taskInput.value = '';
                deadlineInput.value = '';
            }
        });

        // Category filter buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterTasks(btn.dataset.category);
            });
        });

        // Voice button
        const voiceBtn = document.getElementById('voiceBtn');
        voiceBtn.addEventListener('click', () => {
            this.showVoiceModal();
        });

        // Voice modal
        const voiceModal = document.getElementById('voiceModal');
        const closeVoiceModal = document.getElementById('closeVoiceModal');
        const voiceStartBtn = document.getElementById('voiceStartBtn');
        const voiceStopBtn = document.getElementById('voiceStopBtn');

        closeVoiceModal.addEventListener('click', () => {
            this.hideVoiceModal();
        });

        voiceStartBtn.addEventListener('click', () => {
            this.startVoiceRecording();
        });

        voiceStopBtn.addEventListener('click', () => {
            this.stopVoiceRecording();
        });

        // Close modal when clicking outside
        voiceModal.addEventListener('click', (e) => {
            if (e.target === voiceModal) {
                this.hideVoiceModal();
            }
        });

        // Notification permission
        const enableNotificationsBtn = document.getElementById('enableNotificationsBtn');
        enableNotificationsBtn.addEventListener('click', () => {
            this.requestNotificationPermission();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'n':
                        e.preventDefault();
                        document.getElementById('taskInput').focus();
                        break;
                    case 'v':
                        e.preventDefault();
                        this.showVoiceModal();
                        break;
                }
            }
        });
    }

    showVoiceModal() {
        const modal = document.getElementById('voiceModal');
        modal.classList.add('show');
        modal.style.display = 'flex';
    }

    hideVoiceModal() {
        const modal = document.getElementById('voiceModal');
        modal.classList.remove('show');
        modal.style.display = 'none';
        if (this.isRecording) {
            this.stopVoiceRecording();
        }
    }

    // Utility functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Service Worker registration for PWA
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }
    }
}

// Initialize the app
const todoApp = new TodoApp();

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

