import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Mic, 
  MicOff, 
  Camera, 
  Image as ImageIcon, 
  Search,
  Edit,
  Trash2,
  Save,
  X,
  Clock,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'audio' | 'image';
  createdAt: string;
  tags: string[];
  audioUrl?: string;
  imageUrl?: string;
}

const QuickNotes = () => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Physics Lecture - Wave Motion',
      content: 'Key concepts: frequency, wavelength, amplitude. Remember to review interference patterns.',
      type: 'text',
      createdAt: '2024-01-10T10:30:00Z',
      tags: ['physics', 'lecture']
    },
    {
      id: '2',
      title: 'Math Formula Sheet',
      content: 'Integration by parts formula and examples',
      type: 'image',
      createdAt: '2024-01-09T14:15:00Z',
      tags: ['math', 'formulas'],
      imageUrl: '/placeholder-image.jpg'
    }
  ]);

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(blob);
        
        const note: Note = {
          id: Date.now().toString(),
          title: `Audio Note - ${new Date().toLocaleTimeString()}`,
          content: 'Audio recording',
          type: 'audio',
          createdAt: new Date().toISOString(),
          tags: ['audio'],
          audioUrl
        };

        setNotes([note, ...notes]);
        toast({
          title: "Recording Saved",
          description: "Your audio note has been saved successfully"
        });
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak now to record your audio note"
      });
    } catch (error) {
      toast({
        title: "Recording Failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        
        const note: Note = {
          id: Date.now().toString(),
          title: `Image Note - ${file.name}`,
          content: 'Image attachment',
          type: 'image',
          createdAt: new Date().toISOString(),
          tags: ['image'],
          imageUrl
        };

        setNotes([note, ...notes]);
        toast({
          title: "Image Uploaded",
          description: "Your image note has been saved successfully"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addTextNote = () => {
    if (!newNote.title || !newNote.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and content",
        variant: "destructive"
      });
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      type: 'text',
      createdAt: new Date().toISOString(),
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '', tags: '' });
    setShowAddForm(false);
    
    toast({
      title: "Note Added",
      description: "Your text note has been saved successfully"
    });
  };

  const editNote = (note: Note) => {
    setEditingNote(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const saveEdit = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, title: editTitle, content: editContent }
        : note
    ));
    setEditingNote(null);
    toast({
      title: "Note Updated",
      description: "Your note has been updated successfully"
    });
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({
      title: "Note Deleted",
      description: "Note has been removed"
    });
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audio': return Mic;
      case 'image': return ImageIcon;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'audio': return 'bg-accent text-accent-foreground';
      case 'image': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Quick Notes</h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              <Button
                variant="outline"
                onClick={isRecording ? stopRecording : startRecording}
                className={isRecording ? 'bg-destructive text-destructive-foreground' : ''}
              >
                {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                {isRecording ? 'Stop Recording' : 'Record Audio'}
              </Button>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Add Note Form */}
        {showAddForm && (
          <Card className="mb-6 border-primary/20">
            <CardHeader>
              <CardTitle>Add Text Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder="Note title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                />
              </div>
              <div>
                <textarea
                  placeholder="Note content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[120px]"
                />
              </div>
              <div>
                <Input
                  placeholder="Tags (comma separated)"
                  value={newNote.tags}
                  onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addTextNote} className="bg-gradient-primary hover:opacity-90">
                  Save Note
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes List */}
        <div className="grid gap-4">
          {filteredNotes.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm ? 'No notes found' : 'No notes yet'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first note to get started!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotes.map((note) => {
              const TypeIcon = getTypeIcon(note.type);
              const isEditing = editingNote === note.id;

              return (
                <Card key={note.id} className="hover:shadow-medium transition-all duration-300">
                  <CardContent className="p-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="font-semibold"
                        />
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[100px]"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveEdit(note.id)}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingNote(null)}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge className={getTypeColor(note.type)}>
                              <TypeIcon className="h-3 w-3 mr-1" />
                              {note.type}
                            </Badge>
                            <h3 className="text-lg font-semibold text-foreground">
                              {note.title}
                            </h3>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => editNote(note)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => deleteNote(note.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {note.type === 'image' && note.imageUrl && (
                          <div className="mb-4">
                            <img 
                              src={note.imageUrl} 
                              alt={note.title}
                              className="max-w-full h-auto rounded-lg shadow-soft"
                            />
                          </div>
                        )}

                        {note.type === 'audio' && note.audioUrl && (
                          <div className="mb-4">
                            <audio controls className="w-full">
                              <source src={note.audioUrl} type="audio/wav" />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        )}

                        <p className="text-muted-foreground mb-4">{note.content}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {note.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(note.createdAt).toLocaleDateString()} {new Date(note.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default QuickNotes;