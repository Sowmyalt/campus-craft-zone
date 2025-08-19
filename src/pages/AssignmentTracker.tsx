import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Trash2,
  Edit
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  description?: string;
}

const AssignmentTracker = () => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Mathematics Assignment',
      subject: 'Calculus',
      dueDate: '2024-01-15',
      priority: 'high',
      status: 'pending',
      description: 'Solve problems 1-10 from Chapter 5'
    },
    {
      id: '2',
      title: 'History Essay',
      subject: 'World History',
      dueDate: '2024-01-20',
      priority: 'medium',
      status: 'completed',
      description: 'Write about Industrial Revolution impact'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    dueDate: '',
    priority: 'medium' as const,
    description: ''
  });

  const addAssignment = () => {
    if (!newAssignment.title || !newAssignment.subject || !newAssignment.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const assignment: Assignment = {
      id: Date.now().toString(),
      ...newAssignment,
      status: 'pending'
    };

    setAssignments([...assignments, assignment]);
    setNewAssignment({
      title: '',
      subject: '',
      dueDate: '',
      priority: 'medium',
      description: ''
    });
    setShowAddForm(false);
    
    toast({
      title: "Assignment Added",
      description: "New assignment has been added to your tracker"
    });
  };

  const toggleStatus = (id: string) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === id 
        ? { ...assignment, status: assignment.status === 'pending' ? 'completed' : 'pending' }
        : assignment
    ));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
    toast({
      title: "Assignment Deleted",
      description: "Assignment has been removed from your tracker"
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive';
      case 'medium': return 'bg-accent';
      case 'low': return 'bg-secondary';
      default: return 'bg-muted';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
              <h1 className="text-2xl font-bold text-foreground">Assignment Tracker</h1>
            </div>
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Assignment
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Add Assignment Form */}
        {showAddForm && (
          <Card className="mb-8 border-primary/20">
            <CardHeader>
              <CardTitle>Add New Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Assignment Title *</Label>
                  <Input
                    id="title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    placeholder="Enter assignment title"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})}
                    placeholder="Enter subject name"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={newAssignment.priority}
                    onChange={(e) => setNewAssignment({...newAssignment, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  placeholder="Enter assignment description"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[80px]"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addAssignment} className="bg-gradient-primary hover:opacity-90">
                  Add Assignment
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assignment List */}
        <div className="grid gap-4">
          {assignments.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Assignments</h3>
                <p className="text-muted-foreground">Add your first assignment to get started!</p>
              </CardContent>
            </Card>
          ) : (
            assignments.map((assignment) => {
              const daysUntilDue = getDaysUntilDue(assignment.dueDate);
              const isOverdue = daysUntilDue < 0;
              const isDueToday = daysUntilDue === 0;

              return (
                <Card key={assignment.id} className={`hover:shadow-medium transition-all duration-300 ${
                  assignment.status === 'completed' ? 'opacity-75' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`text-lg font-semibold ${
                            assignment.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}>
                            {assignment.title}
                          </h3>
                          <Badge className={getPriorityColor(assignment.priority)}>
                            {assignment.priority}
                          </Badge>
                          {assignment.status === 'completed' && (
                            <Badge variant="outline" className="bg-secondary/20 text-secondary">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-muted-foreground mb-3">{assignment.subject}</p>
                        
                        {assignment.description && (
                          <p className="text-sm text-muted-foreground mb-3">{assignment.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${
                            isOverdue ? 'text-destructive' : isDueToday ? 'text-accent' : 'text-muted-foreground'
                          }`}>
                            {isOverdue ? <AlertCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                            <span>
                              {isOverdue 
                                ? `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''}`
                                : isDueToday 
                                ? 'Due today'
                                : `${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''} remaining`
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(assignment.id)}
                          className={assignment.status === 'completed' ? 'bg-secondary/20' : ''}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteAssignment(assignment.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">
                {assignments.filter(a => a.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary">
                {assignments.filter(a => a.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">
                {assignments.filter(a => getDaysUntilDue(a.dueDate) < 0 && a.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Overdue</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssignmentTracker;