import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  ExternalLink, 
  Search, 
  Book, 
  Video, 
  FileText, 
  Link as LinkIcon,
  Star,
  Clock,
  Edit,
  Trash2,
  Save,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'book' | 'video' | 'document' | 'website';
  subject: string;
  rating: number;
  addedAt: string;
  tags: string[];
}

const StudyResources = () => {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Khan Academy - Calculus',
      description: 'Complete calculus course with interactive exercises and video tutorials',
      url: 'https://khanacademy.org/calculus',
      type: 'video',
      subject: 'Mathematics',
      rating: 5,
      addedAt: '2024-01-10T10:30:00Z',
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
      addedAt: '2024-01-09T14:15:00Z',
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
      addedAt: '2024-01-08T09:20:00Z',
      tags: ['algorithms', 'textbook', 'computer-science']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResource, setEditingResource] = useState<string | null>(null);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    url: '',
    type: 'website' as const,
    subject: '',
    tags: ''
  });
  const [editResource, setEditResource] = useState({
    title: '',
    description: '',
    url: '',
    subject: '',
    tags: ''
  });

  const subjects = ['All', ...Array.from(new Set(resources.map(r => r.subject)))];
  const types = ['All', 'book', 'video', 'document', 'website'];

  const addResource = () => {
    if (!newResource.title || !newResource.url || !newResource.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in title, URL, and subject",
        variant: "destructive"
      });
      return;
    }

    const resource: Resource = {
      id: Date.now().toString(),
      ...newResource,
      rating: 0,
      addedAt: new Date().toISOString(),
      tags: newResource.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setResources([resource, ...resources]);
    setNewResource({
      title: '',
      description: '',
      url: '',
      type: 'website',
      subject: '',
      tags: ''
    });
    setShowAddForm(false);
    
    toast({
      title: "Resource Added",
      description: "New study resource has been added successfully"
    });
  };

  const startEdit = (resource: Resource) => {
    setEditingResource(resource.id);
    setEditResource({
      title: resource.title,
      description: resource.description,
      url: resource.url,
      subject: resource.subject,
      tags: resource.tags.join(', ')
    });
  };

  const saveEdit = (id: string) => {
    setResources(resources.map(resource => 
      resource.id === id 
        ? { 
            ...resource, 
            ...editResource,
            tags: editResource.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          }
        : resource
    ));
    setEditingResource(null);
    toast({
      title: "Resource Updated",
      description: "Study resource has been updated successfully"
    });
  };

  const deleteResource = (id: string) => {
    setResources(resources.filter(resource => resource.id !== id));
    toast({
      title: "Resource Deleted",
      description: "Study resource has been removed"
    });
  };

  const rateResource = (id: string, rating: number) => {
    setResources(resources.map(resource => 
      resource.id === id ? { ...resource, rating } : resource
    ));
    toast({
      title: "Rating Updated",
      description: `Resource rated ${rating} star${rating !== 1 ? 's' : ''}`
    });
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'All' || resource.subject === selectedSubject;
    const matchesType = selectedType === 'All' || resource.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book': return Book;
      case 'video': return Video;
      case 'document': return FileText;
      default: return LinkIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'book': return 'bg-primary text-primary-foreground';
      case 'video': return 'bg-accent text-accent-foreground';
      case 'document': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const renderStars = (rating: number, resourceId?: string) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => resourceId && rateResource(resourceId, star)}
            className={`${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-400 transition-colors ${resourceId ? 'cursor-pointer' : 'cursor-default'}`}
            disabled={!resourceId}
          >
            <Star className="h-4 w-4 fill-current" />
          </button>
        ))}
      </div>
    );
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
              <h1 className="text-2xl font-bold text-foreground">Study Resources</h1>
            </div>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'All' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add Resource Form */}
        {showAddForm && (
          <Card className="mb-6 border-primary/20">
            <CardHeader>
              <CardTitle>Add Study Resource</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="Resource title"
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Subject"
                    value={newResource.subject}
                    onChange={(e) => setNewResource({...newResource, subject: e.target.value})}
                  />
                </div>
                <div>
                  <Input
                    placeholder="URL"
                    value={newResource.url}
                    onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                  />
                </div>
                <div>
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource({...newResource, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="website">Website</option>
                    <option value="book">Book</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                  </select>
                </div>
              </div>
              <div>
                <textarea
                  placeholder="Description"
                  value={newResource.description}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[80px]"
                />
              </div>
              <div>
                <Input
                  placeholder="Tags (comma separated)"
                  value={newResource.tags}
                  onChange={(e) => setNewResource({...newResource, tags: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addResource} className="bg-gradient-primary hover:opacity-90">
                  Add Resource
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resources List */}
        <div className="grid gap-4">
          {filteredResources.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm || selectedSubject !== 'All' || selectedType !== 'All' 
                    ? 'No resources found' 
                    : 'No resources yet'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedSubject !== 'All' || selectedType !== 'All'
                    ? 'Try adjusting your search or filters'
                    : 'Add your first study resource to get started!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredResources.map((resource) => {
              const TypeIcon = getTypeIcon(resource.type);
              const isEditing = editingResource === resource.id;

              return (
                <Card key={resource.id} className="hover:shadow-medium transition-all duration-300">
                  <CardContent className="p-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            value={editResource.title}
                            onChange={(e) => setEditResource({...editResource, title: e.target.value})}
                            placeholder="Title"
                          />
                          <Input
                            value={editResource.subject}
                            onChange={(e) => setEditResource({...editResource, subject: e.target.value})}
                            placeholder="Subject"
                          />
                        </div>
                        <Input
                          value={editResource.url}
                          onChange={(e) => setEditResource({...editResource, url: e.target.value})}
                          placeholder="URL"
                        />
                        <textarea
                          value={editResource.description}
                          onChange={(e) => setEditResource({...editResource, description: e.target.value})}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[80px]"
                          placeholder="Description"
                        />
                        <Input
                          value={editResource.tags}
                          onChange={(e) => setEditResource({...editResource, tags: e.target.value})}
                          placeholder="Tags (comma separated)"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveEdit(resource.id)}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingResource(null)}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge className={getTypeColor(resource.type)}>
                              <TypeIcon className="h-3 w-3 mr-1" />
                              {resource.type}
                            </Badge>
                            <h3 className="text-lg font-semibold text-foreground">
                              {resource.title}
                            </h3>
                            <Badge variant="outline">{resource.subject}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => startEdit(resource)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => deleteResource(resource.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4">{resource.description}</p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            {renderStars(resource.rating, resource.id)}
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              Added {new Date(resource.addedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Button size="sm" asChild>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Visit Resource
                            </a>
                          </Button>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          {resource.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">
                {resources.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Resources</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {subjects.length - 1}
              </div>
              <div className="text-sm text-muted-foreground">Subjects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">
                {resources.filter(r => r.rating >= 4).length}
              </div>
              <div className="text-sm text-muted-foreground">High Rated</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">
                {resources.filter(r => r.type === 'video').length}
              </div>
              <div className="text-sm text-muted-foreground">Video Resources</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyResources;