// Assignment Tracker functionality

class AssignmentManager {
    constructor() {
        this.assignments = Utils.getFromLocalStorage('assignments', [
            {
                id: '1',
                title: 'Mathematics Assignment',
                subject: 'Calculus',
                dueDate: '2024-02-15',
                priority: 'high',
                status: 'pending',
                description: 'Solve problems 1-10 from Chapter 5',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'History Essay',
                subject: 'World History',
                dueDate: '2024-02-20',
                priority: 'medium',
                status: 'completed',
                description: 'Write about Industrial Revolution impact',
                createdAt: new Date().toISOString()
            }
        ]);
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
    }

    bindEvents() {
        // Add assignment button
        document.getElementById('addAssignmentBtn').addEventListener('click', () => {
            this.toggleAddForm();
        });

        // Cancel add button
        document.getElementById('cancelAddBtn').addEventListener('click', () => {
            this.toggleAddForm();
        });

        // Assignment form submission
        document.getElementById('assignmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAssignment();
        });
    }

    toggleAddForm() {
        const form = document.getElementById('addAssignmentForm');
        const isVisible = form.style.display !== 'none';
        form.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            form.scrollIntoView({ behavior: 'smooth' });
        } else {
            this.clearForm();
        }
    }

    addAssignment() {
        const title = document.getElementById('assignmentTitle').value.trim();
        const subject = document.getElementById('assignmentSubject').value.trim();
        const dueDate = document.getElementById('assignmentDueDate').value;
        const priority = document.getElementById('assignmentPriority').value;
        const description = document.getElementById('assignmentDescription').value.trim();

        if (!title || !subject || !dueDate) {
            Utils.showToast('Please fill in all required fields', 'error');
            return;
        }

        const assignment = {
            id: Utils.generateId(),
            title,
            subject,
            dueDate,
            priority,
            status: 'pending',
            description,
            createdAt: new Date().toISOString()
        };

        this.assignments.unshift(assignment);
        this.saveAssignments();
        this.render();
        this.updateStats();
        this.clearForm();
        this.toggleAddForm();
        Utils.showToast('Assignment added successfully!');
    }

    toggleAssignmentStatus(id) {
        const assignment = this.assignments.find(a => a.id === id);
        if (assignment) {
            assignment.status = assignment.status === 'pending' ? 'completed' : 'pending';
            this.saveAssignments();
            this.render();
            this.updateStats();
            Utils.showToast(`Assignment marked as ${assignment.status}`);
        }
    }

    deleteAssignment(id) {
        if (confirm('Are you sure you want to delete this assignment?')) {
            this.assignments = this.assignments.filter(a => a.id !== id);
            this.saveAssignments();
            this.render();
            this.updateStats();
            Utils.showToast('Assignment deleted successfully');
        }
    }

    getDaysUntilDue(dueDate) {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    getPriorityClass(priority) {
        const classes = {
            'high': 'badge accent',
            'medium': 'badge primary',
            'low': 'badge secondary'
        };
        return classes[priority] || 'badge outline';
    }

    getStatusIcon(status) {
        return status === 'completed' ? 'fas fa-check-circle' : 'far fa-circle';
    }

    render() {
        const container = document.getElementById('assignmentsList');
        
        if (this.assignments.length === 0) {
            container.innerHTML = `
                <div class="card" style="text-align: center; padding: 3rem;">
                    <i class="fas fa-clipboard-check" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <h3>No Assignments</h3>
                    <p>Add your first assignment to get started!</p>
                </div>
            `;
            return;
        }

        const assignmentsHTML = this.assignments.map(assignment => {
            const daysUntilDue = this.getDaysUntilDue(assignment.dueDate);
            const isOverdue = daysUntilDue < 0 && assignment.status === 'pending';
            const isDueToday = daysUntilDue === 0 && assignment.status === 'pending';
            
            let timeStatus = '';
            let timeClass = '';
            
            if (assignment.status === 'completed') {
                timeStatus = 'Completed';
                timeClass = 'color: var(--secondary)';
            } else if (isOverdue) {
                timeStatus = `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''}`;
                timeClass = 'color: var(--accent)';
            } else if (isDueToday) {
                timeStatus = 'Due today';
                timeClass = 'color: var(--accent)';
            } else {
                timeStatus = `${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''} remaining`;
                timeClass = 'color: var(--text-secondary)';
            }

            return `
                <div class="card fade-in" style="margin-bottom: 1rem; ${assignment.status === 'completed' ? 'opacity: 0.7;' : ''}">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
                                <h3 style="margin: 0; ${assignment.status === 'completed' ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${assignment.title}</h3>
                                <span class="${this.getPriorityClass(assignment.priority)}">${assignment.priority}</span>
                                ${assignment.status === 'completed' ? '<span class="badge secondary"><i class="fas fa-check"></i> Completed</span>' : ''}
                            </div>
                            <p style="margin: 0 0 0.5rem 0; color: var(--text-secondary);">${assignment.subject}</p>
                            ${assignment.description ? `<p style="margin: 0 0 1rem 0; font-size: 0.9rem; color: var(--text-muted);">${assignment.description}</p>` : ''}
                            <div style="display: flex; gap: 2rem; font-size: 0.9rem; color: var(--text-secondary); flex-wrap: wrap;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas fa-calendar"></i>
                                    <span>Due: ${Utils.formatDate(assignment.dueDate)}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem; ${timeClass}">
                                    <i class="${isOverdue ? 'fas fa-exclamation-triangle' : 'fas fa-clock'}"></i>
                                    <span>${timeStatus}</span>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem; margin-left: 1rem;">
                            <button class="btn btn-outline" onclick="assignmentManager.toggleAssignmentStatus('${assignment.id}')" style="padding: 0.5rem;">
                                <i class="${this.getStatusIcon(assignment.status)}"></i>
                            </button>
                            <button class="btn btn-outline" onclick="assignmentManager.deleteAssignment('${assignment.id}')" style="padding: 0.5rem; color: var(--accent);">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = assignmentsHTML;
    }

    updateStats() {
        const pending = this.assignments.filter(a => a.status === 'pending').length;
        const completed = this.assignments.filter(a => a.status === 'completed').length;
        const overdue = this.assignments.filter(a => 
            this.getDaysUntilDue(a.dueDate) < 0 && a.status === 'pending'
        ).length;

        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('overdueCount').textContent = overdue;
    }

    clearForm() {
        document.getElementById('assignmentForm').reset();
    }

    saveAssignments() {
        Utils.saveToLocalStorage('assignments', this.assignments);
    }
}

// Initialize assignment manager when page loads
function initAssignmentsPage() {
    window.assignmentManager = new AssignmentManager();
}