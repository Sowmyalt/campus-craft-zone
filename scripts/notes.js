// Quick Notes functionality

class NotesManager {
    constructor() {
        this.notes = Utils.getFromLocalStorage('notes', [
            {
                id: '1',
                title: 'Physics Lecture - Wave Motion',
                content: 'Key concepts: frequency, wavelength, amplitude. Remember to review interference patterns.',
                type: 'text',
                createdAt: new Date().toISOString(),
                tags: ['physics', 'lecture']
            },
            {
                id: '2',
                title: 'Math Formula Notes',
                content: 'Integration by parts and substitution methods',
                type: 'text',
                createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                tags: ['math', 'formulas']
            }
        ]);
        
        this.mediaRecorder = null;
        this.isRecording = false;
        this.audioChunks = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.setupSearch();
    }

    bindEvents() {
        // Add note button
        document.getElementById('addNoteBtn').addEventListener('click', () => {
            this.toggleAddForm();
        });

        // Cancel note button
        document.getElementById('cancelNoteBtn').addEventListener('click', () => {
            this.toggleAddForm();
        });

        // Note form submission
        document.getElementById('noteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTextNote();
        });

        // Record audio button
        document.getElementById('recordAudioBtn').addEventListener('click', () => {
            this.toggleRecording();
        });

        // Stop recording button
        document.getElementById('stopRecordingBtn').addEventListener('click', () => {
            this.stopRecording();
        });

        // Upload image button
        document.getElementById('uploadImageBtn').addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });

        // Image input change
        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const debouncedSearch = Utils.debounce(() => {
            this.render(searchInput.value.trim());
        }, 300);
        
        searchInput.addEventListener('input', debouncedSearch);
    }

    toggleAddForm() {
        const form = document.getElementById('addNoteForm');
        const isVisible = form.style.display !== 'none';
        form.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            form.scrollIntoView({ behavior: 'smooth' });
        } else {
            this.clearForm();
        }
    }

    addTextNote() {
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();
        const tags = document.getElementById('noteTags').value.trim();

        if (!title || !content) {
            Utils.showToast('Please fill in title and content', 'error');
            return;
        }

        const note = {
            id: Utils.generateId(),
            title,
            content,
            type: 'text',
            createdAt: new Date().toISOString(),
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
        };

        this.notes.unshift(note);
        this.saveNotes();
        this.render();
        this.clearForm();
        this.toggleAddForm();
        Utils.showToast('Note added successfully!');
    }

    async toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            await this.startRecording();
        }
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (e) => {
                this.audioChunks.push(e.data);
            };

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                this.addAudioNote(audioUrl);
                
                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            this.updateRecordingUI();
            Utils.showToast('Recording started - speak now!');
        } catch (error) {
            console.error('Error starting recording:', error);
            Utils.showToast('Could not access microphone. Please check permissions.', 'error');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.updateRecordingUI();
        }
    }

    updateRecordingUI() {
        const recordingStatus = document.getElementById('recordingStatus');
        const recordBtn = document.getElementById('recordAudioBtn');
        
        if (this.isRecording) {
            recordingStatus.style.display = 'block';
            recordBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Stop Recording';
            recordBtn.style.background = 'var(--accent)';
            recordBtn.style.color = 'white';
        } else {
            recordingStatus.style.display = 'none';
            recordBtn.innerHTML = '<i class="fas fa-microphone"></i> Record Audio';
            recordBtn.style.background = '';
            recordBtn.style.color = '';
        }
    }

    addAudioNote(audioUrl) {
        const note = {
            id: Utils.generateId(),
            title: `Audio Note - ${new Date().toLocaleTimeString()}`,
            content: 'Audio recording',
            type: 'audio',
            createdAt: new Date().toISOString(),
            tags: ['audio'],
            audioUrl
        };

        this.notes.unshift(note);
        this.saveNotes();
        this.render();
        Utils.showToast('Audio note saved successfully!');
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result;
                this.addImageNote(file.name, imageUrl);
            };
            reader.readAsDataURL(file);
        }
    }

    addImageNote(fileName, imageUrl) {
        const note = {
            id: Utils.generateId(),
            title: `Image Note - ${fileName}`,
            content: 'Image attachment',
            type: 'image',
            createdAt: new Date().toISOString(),
            tags: ['image'],
            imageUrl
        };

        this.notes.unshift(note);
        this.saveNotes();
        this.render();
        Utils.showToast('Image note saved successfully!');
    }

    deleteNote(id) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(note => note.id !== id);
            this.saveNotes();
            this.render();
            Utils.showToast('Note deleted successfully');
        }
    }

    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (note && note.type === 'text') {
            const newTitle = prompt('Edit title:', note.title);
            const newContent = prompt('Edit content:', note.content);
            
            if (newTitle !== null && newContent !== null && newTitle.trim() && newContent.trim()) {
                note.title = newTitle.trim();
                note.content = newContent.trim();
                this.saveNotes();
                this.render();
                Utils.showToast('Note updated successfully!');
            }
        }
    }

    getTypeIcon(type) {
        const icons = {
            'text': 'fas fa-file-text',
            'audio': 'fas fa-microphone',
            'image': 'fas fa-image'
        };
        return icons[type] || 'fas fa-file';
    }

    getTypeClass(type) {
        const classes = {
            'text': 'badge primary',
            'audio': 'badge accent',
            'image': 'badge secondary'
        };
        return classes[type] || 'badge outline';
    }

    filterNotes(searchTerm) {
        if (!searchTerm) return this.notes;
        
        const term = searchTerm.toLowerCase();
        return this.notes.filter(note =>
            note.title.toLowerCase().includes(term) ||
            note.content.toLowerCase().includes(term) ||
            note.tags.some(tag => tag.toLowerCase().includes(term))
        );
    }

    render(searchTerm = '') {
        const container = document.getElementById('notesList');
        const filteredNotes = this.filterNotes(searchTerm);
        
        if (filteredNotes.length === 0) {
            const message = searchTerm ? 'No notes found matching your search' : 'No notes yet';
            const subMessage = searchTerm ? 'Try adjusting your search terms' : 'Create your first note to get started!';
            
            container.innerHTML = `
                <div class="card" style="text-align: center; padding: 3rem;">
                    <i class="fas fa-sticky-note" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <h3>${message}</h3>
                    <p>${subMessage}</p>
                </div>
            `;
            return;
        }

        const notesHTML = filteredNotes.map(note => {
            const typeIcon = this.getTypeIcon(note.type);
            const typeClass = this.getTypeClass(note.type);
            
            let mediaContent = '';
            if (note.type === 'image' && note.imageUrl) {
                mediaContent = `<img src="${note.imageUrl}" alt="${note.title}" class="note-image">`;
            } else if (note.type === 'audio' && note.audioUrl) {
                mediaContent = `<audio controls class="audio-player"><source src="${note.audioUrl}" type="audio/wav">Your browser does not support audio playback.</audio>`;
            }

            const tagsHTML = note.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

            return `
                <div class="card fade-in" style="margin-bottom: 1rem;">
                    <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <span class="${typeClass}">
                                <i class="${typeIcon}"></i>
                                ${note.type}
                            </span>
                            <h3 style="margin: 0; font-size: 1.125rem;">${note.title}</h3>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            ${note.type === 'text' ? `<button class="btn btn-outline" onclick="notesManager.editNote('${note.id}')" style="padding: 0.5rem;"><i class="fas fa-edit"></i></button>` : ''}
                            <button class="btn btn-outline" onclick="notesManager.deleteNote('${note.id}')" style="padding: 0.5rem; color: var(--accent);"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                    
                    ${mediaContent}
                    
                    <p style="margin-bottom: 1rem; color: var(--text-secondary);">${note.content}</p>
                    
                    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                        <div>${tagsHTML}</div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">
                            <i class="fas fa-clock"></i>
                            <span>${Utils.formatDateTime(note.createdAt)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = notesHTML;
    }

    clearForm() {
        document.getElementById('noteForm').reset();
    }

    saveNotes() {
        Utils.saveToLocalStorage('notes', this.notes);
    }
}

// Initialize notes manager when page loads
function initNotesPage() {
    window.notesManager = new NotesManager();
}