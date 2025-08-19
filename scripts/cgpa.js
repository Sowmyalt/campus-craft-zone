// CGPA Calculator functionality

class CGPACalculator {
    constructor() {
        this.subjects = Utils.getFromLocalStorage('subjects', [
            {
                id: '1',
                name: 'Mathematics',
                credits: 4,
                grade: 'A',
                gradePoints: 4.0
            },
            {
                id: '2',
                name: 'Physics',
                credits: 3,
                grade: 'B+',
                gradePoints: 3.3
            }
        ]);
        
        this.gradeSystem = {
            'A+': 4.0, 'A': 4.0, 'A-': 3.7,
            'B+': 3.3, 'B': 3.0, 'B-': 2.7,
            'C+': 2.3, 'C': 2.0, 'C-': 1.7,
            'D+': 1.3, 'D': 1.0, 'F': 0.0
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
        this.calculateCGPA();
    }

    bindEvents() {
        // Subject form submission
        document.getElementById('subjectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSubject();
        });
    }

    addSubject() {
        const name = document.getElementById('subjectName').value.trim();
        const credits = parseInt(document.getElementById('subjectCredits').value);
        const grade = document.getElementById('subjectGrade').value;

        if (!name || !credits) {
            Utils.showToast('Please fill in all required fields', 'error');
            return;
        }

        const subject = {
            id: Utils.generateId(),
            name,
            credits,
            grade,
            gradePoints: this.gradeSystem[grade]
        };

        this.subjects.push(subject);
        this.saveSubjects();
        this.render();
        this.updateStats();
        this.calculateCGPA();
        this.clearForm();
        Utils.showToast('Subject added successfully!');
    }

    deleteSubject(id) {
        if (confirm('Are you sure you want to delete this subject?')) {
            this.subjects = this.subjects.filter(s => s.id !== id);
            this.saveSubjects();
            this.render();
            this.updateStats();
            this.calculateCGPA();
            Utils.showToast('Subject deleted successfully');
        }
    }

    calculateCGPA() {
        if (this.subjects.length === 0) {
            this.updateCGPADisplay(0, 'Not Calculated', 'fas fa-calculator');
            return;
        }

        const totalGradePoints = this.subjects.reduce((sum, subject) => 
            sum + (subject.gradePoints * subject.credits), 0
        );
        const totalCredits = this.subjects.reduce((sum, subject) => sum + subject.credits, 0);
        
        const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
        
        let status, icon;
        if (cgpa >= 3.5) {
            status = 'Excellent';
            icon = 'fas fa-trophy';
        } else if (cgpa >= 3.0) {
            status = 'Good';
            icon = 'fas fa-thumbs-up';
        } else if (cgpa >= 2.0) {
            status = 'Average';
            icon = 'fas fa-book';
        } else {
            status = 'Below Average';
            icon = 'fas fa-chart-line';
        }

        this.updateCGPADisplay(cgpa, status, icon);
    }

    updateCGPADisplay(cgpa, status, icon) {
        document.getElementById('cgpaDisplay').textContent = cgpa.toFixed(2);
        const statusElement = document.getElementById('cgpaStatus');
        statusElement.innerHTML = `
            <i class="${icon}"></i>
            <span>${status}</span>
        `;
    }

    getGradeClass(grade) {
        const gradeValue = this.gradeSystem[grade];
        if (gradeValue >= 3.5) return 'badge secondary';
        if (gradeValue >= 3.0) return 'badge primary';
        if (gradeValue >= 2.0) return 'badge accent';
        return 'badge outline';
    }

    render() {
        const container = document.getElementById('subjectsList');
        
        if (this.subjects.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <i class="fas fa-book-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <h3>No Subjects Added</h3>
                    <p>Add your first subject to calculate your CGPA!</p>
                </div>
            `;
            return;
        }

        const subjectsHTML = this.subjects.map(subject => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: var(--border-light); border-radius: var(--radius-md); margin-bottom: 0.75rem;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 0.25rem 0; font-weight: 600;">${subject.name}</h4>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <span style="font-size: 0.9rem; color: var(--text-secondary);">
                            ${subject.credits} credit${subject.credits !== 1 ? 's' : ''}
                        </span>
                        <span class="${this.getGradeClass(subject.grade)}">
                            ${subject.grade} (${subject.gradePoints})
                        </span>
                    </div>
                </div>
                <button class="btn btn-outline" onclick="cgpaCalculator.deleteSubject('${subject.id}')" style="padding: 0.5rem; color: var(--accent);">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        container.innerHTML = subjectsHTML;
    }

    updateStats() {
        const subjectCount = this.subjects.length;
        const totalCredits = this.subjects.reduce((sum, subject) => sum + subject.credits, 0);

        document.getElementById('subjectCount').textContent = subjectCount;
        document.getElementById('totalCredits').textContent = totalCredits;
    }

    clearForm() {
        document.getElementById('subjectForm').reset();
    }

    saveSubjects() {
        Utils.saveToLocalStorage('subjects', this.subjects);
    }
}

// Initialize CGPA calculator when page loads
function initCGPAPage() {
    window.cgpaCalculator = new CGPACalculator();
}