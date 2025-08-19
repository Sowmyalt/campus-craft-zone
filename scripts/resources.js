// Study Resources functionality

class ResourcesManager {
    constructor() {
        this.resources = Utils.getFromLocalStorage('resources', [
            {
                id: '1',
                title: 'Khan Academy - Calculus',
                description: 'Complete calculus course with interactive exercises and video tutorials',
                url: 'https://khanacademy.org/calculus',
                type: 'video',
                subject: 'Mathematics',
                rating: 5,
                addedAt: new Date().toISOString(),
                tags: ['calculus', 'free', 'interactive']
            },
            {
                id: '2',
                title: 'MIT OpenCourseWare - Physics',
                description: 'Free physics courses from MIT with lecture notes and problem sets',
                url: 'https://ocw.mit.edu/physics',
                type: 'document',
                subject: 'Physics',
                rating: 5,
                addedAt: new Date(Date.now() - 86400000).toISOString(),
                tags: ['physics', 'mit', 'free']
            },
            {
                id: '3',
                title: 'Introduction to Algorithms (CLRS)',
                description: 'Comprehensive textbook covering algorithms and data structures',
                url: 'https://mitpress.mit.edu/books/introduction-algorithms',
                type: 'book',
                subject: 'Computer Science',
                rating: 4,
                addedAt: new Date(Date.now() - 172800000).toISOString(),
                tags: ['algorithms', 'textbook', 'computer-science']
            }
        ]);
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupFilters();
        this.render();
        this.updateStats();
    }

    bindEvents() {
        // Add resource button
        document.getElementById('addResourceBtn').addEventListener('click', () => {
            this.toggleAddForm();
        });

        // Cancel resource button
        document.getElementById('cancelResourceBtn').addEventListener('click', () => {
            this.toggleAddForm();
        });

        // Resource form submission
        document.getElementById('resourceForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addResource();
        });

        // Search and filters
        const searchInput = document.getElementById('searchInput');
        const subjectFilter = document.getElementById('subjectFilter');
        const typeFilter = document.getElementById('typeFilter');

        const debouncedRender = Utils.debounce(() => this.render(), 300);
        
        searchInput.addEventListener('input', debouncedRender);
        subjectFilter.addEventListener('change', () => this.render());
        typeFilter.addEventListener('change', () => this.render());
    }

    setupFilters() {
        // Populate subject filter
        const subjects = [...new Set(this.resources.map(r => r.subject))];
        const subjectFilter = document.getElementById('subjectFilter');
        
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            subjectFilter.appendChild(option);
        });
    }

    toggleAddForm() {
        const form = document.getElementById('addResourceForm');
        const isVisible = form.style.display !== 'none';
        form.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            form.scrollIntoView({ behavior: 'smooth' });
        } else {
            this.clearForm();
        }
    }

    addResource() {
        const title = document.getElementById('resourceTitle').value.trim();
        const subject = document.getElementById('resourceSubject').value.trim();
        const url = document.getElementById('resourceUrl').value.trim();
        const type = document.getElementById('resourceType').value;
        const description = document.getElementById('resourceDescription').value.trim();
        const tags = document.getElementById('resourceTags').value.trim();

        if (!title || !subject || !url) {
            Utils.showToast('Please fill in title, subject, and URL', 'error');
            return;
        }

        const resource = {
            id: Utils.generateId(),
            title,
            subject,
            url,
            type,
            description,
            rating: 0,
            addedAt: new Date().toISOString(),
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
        };

        this.resources.unshift(resource);
        this.saveResources();
        this.setupFilters(); // Refresh filters with new subject if needed
        this.render();
        this.updateStats();
        this.clearForm();
        this.toggleAddForm();
        Utils.showToast('Resource added successfully!');
    }

    deleteResource(id) {
        if (confirm('Are you sure you want to delete this resource?')) {
            this.resources = this.resources.filter(r => r.id !== id);
            this.saveResources();
            this.render();
            this.updateStats();
            Utils.showToast('Resource deleted successfully');
        }
    }

    editResource(id) {
        const resource = this.resources.find(r => r.id === id);
        if (resource) {
            const newTitle = prompt('Edit title:', resource.title);
            const newDescription = prompt('Edit description:', resource.description);
            const newUrl = prompt('Edit URL:', resource.url);
            
            if (newTitle !== null && newDescription !== null && newUrl !== null && 
                newTitle.trim() && newUrl.trim()) {
                resource.title = newTitle.trim();
                resource.description = newDescription.trim();
                resource.url = newUrl.trim();
                this.saveResources();
                this.render();
                Utils.showToast('Resource updated successfully!');
            }
        }
    }

    rateResource(id, rating) {
        const resource = this.resources.find(r => r.id === id);
        if (resource) {
            resource.rating = rating;
            this.saveResources();
            this.render();
            this.updateStats();
            Utils.showToast(`Resource rated ${rating} star${rating !== 1 ? 's' : ''}!`);
        }
    }

    getTypeIcon(type) {
        const icons = {
            'book': 'fas fa-book',
            'video': 'fas fa-video',
            'document': 'fas fa-file-text',
            'website': 'fas fa-link'
        };
        return icons[type] || 'fas fa-link';
    }

    getTypeClass(type) {
        const classes = {
            'book': 'badge primary',
            'video': 'badge accent',
            'document': 'badge secondary',
            'website': 'badge outline'
        };
        return classes[type] || 'badge outline';
    }

    renderStars(rating, resourceId = null) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const filled = i <= rating ? 'filled' : '';
            const clickHandler = resourceId ? `onclick="resourcesManager.rateResource('${resourceId}', ${i})"` : '';
            stars.push(`<i class="fas fa-star star ${filled}" ${clickHandler}></i>`);
        }
        return `<div class="star-rating">${stars.join('')}</div>`;
    }

    filterResources() {
        const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
        const selectedSubject = document.getElementById('subjectFilter').value;
        const selectedType = document.getElementById('typeFilter').value;

        return this.resources.filter(resource => {
            const matchesSearch = !searchTerm || 
                resource.title.toLowerCase().includes(searchTerm) ||
                resource.description.toLowerCase().includes(searchTerm) ||
                resource.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            const matchesSubject = selectedSubject === 'All' || resource.subject === selectedSubject;
            const matchesType = selectedType === 'All' || resource.type === selectedType;
            
            return matchesSearch && matchesSubject && matchesType;
        });
    }

    render() {
        const container = document.getElementById('resourcesList');
        const filteredResources = this.filterResources();
        
        if (filteredResources.length === 0) {
            const searchTerm = document.getElementById('searchInput').value.trim();
            const hasFilters = document.getElementById('subjectFilter').value !== 'All' || 
                             document.getElementById('typeFilter').value !== 'All';
            
            const message = searchTerm || hasFilters ? 'No resources found' : 'No resources yet';
            const subMessage = searchTerm || hasFilters ? 
                'Try adjusting your search or filters' : 
                'Add your first study resource to get started!';
            
            container.innerHTML = `
                <div class="card" style="text-align: center; padding: 3rem;">
                    <i class="fas fa-book-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <h3>${message}</h3>
                    <p>${subMessage}</p>
                </div>
            `;
            return;
        }

        const resourcesHTML = filteredResources.map(resource => {
            const typeIcon = this.getTypeIcon(resource.type);
            const typeClass = this.getTypeClass(resource.type);
            const tagsHTML = resource.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

            return `
                <div class="card fade-in" style="margin-bottom: 1rem;">
                    <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                            <span class="${typeClass}">
                                <i class="${typeIcon}"></i>
                                ${resource.type}
                            </span>
                            <h3 style="margin: 0; font-size: 1.125rem;">${resource.title}</h3>
                            <span class="badge outline">${resource.subject}</span>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-outline" onclick="resourcesManager.editResource('${resource.id}')" style="padding: 0.5rem;">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-outline" onclick="resourcesManager.deleteResource('${resource.id}')" style="padding: 0.5rem; color: var(--accent);">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <p style="margin-bottom: 1rem; color: var(--text-secondary);">${resource.description}</p>
                    
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            ${this.renderStars(resource.rating, resource.id)}
                            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">
                                <i class="fas fa-clock"></i>
                                <span>Added ${Utils.formatDate(resource.addedAt)}</span>
                            </div>
                        </div>
                        <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="resource-link">
                            <i class="fas fa-external-link-alt"></i>
                            Visit Resource
                        </a>
                    </div>
                    
                    <div>${tagsHTML}</div>
                </div>
            `;
        }).join('');

        container.innerHTML = resourcesHTML;
    }

    updateStats() {
        const totalResources = this.resources.length;
        const subjects = new Set(this.resources.map(r => r.subject)).size;
        const highRated = this.resources.filter(r => r.rating >= 4).length;
        const videoResources = this.resources.filter(r => r.type === 'video').length;

        document.getElementById('totalResourcesCount').textContent = totalResources;
        document.getElementById('subjectsCount').textContent = subjects;
        document.getElementById('highRatedCount').textContent = highRated;
        document.getElementById('videoResourcesCount').textContent = videoResources;
    }

    clearForm() {
        document.getElementById('resourceForm').reset();
    }

    saveResources() {
        Utils.saveToLocalStorage('resources', this.resources);
    }
}

// Initialize resources manager when page loads
function initResourcesPage() {
    window.resourcesManager = new ResourcesManager();
}