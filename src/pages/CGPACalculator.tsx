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
  Calculator, 
  Trophy, 
  Target,
  Trash2,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Subject {
  id: string;
  name: string;
  credits: number;
  grade: string;
  gradePoints: number;
}

const CGPACalculator = () => {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([
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
      gradePoints: 3.5
    }
  ]);

  const [newSubject, setNewSubject] = useState({
    name: '',
    credits: '',
    grade: 'A'
  });

  const gradeSystem = {
    'A+': 4.0,
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1.0,
    'F': 0.0
  };

  const addSubject = () => {
    if (!newSubject.name || !newSubject.credits) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const subject: Subject = {
      id: Date.now().toString(),
      name: newSubject.name,
      credits: parseInt(newSubject.credits),
      grade: newSubject.grade,
      gradePoints: gradeSystem[newSubject.grade as keyof typeof gradeSystem]
    };

    setSubjects([...subjects, subject]);
    setNewSubject({
      name: '',
      credits: '',
      grade: 'A'
    });
    
    toast({
      title: "Subject Added",
      description: "New subject has been added to your CGPA calculation"
    });
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
    toast({
      title: "Subject Removed",
      description: "Subject has been removed from calculation"
    });
  };

  const calculateCGPA = () => {
    if (subjects.length === 0) return 0;
    
    const totalGradePoints = subjects.reduce((sum, subject) => 
      sum + (subject.gradePoints * subject.credits), 0
    );
    const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
    
    return totalCredits > 0 ? parseFloat((totalGradePoints / totalCredits).toFixed(2)) : 0;
  };

  const getGradeColor = (grade: string) => {
    const gradeValue = gradeSystem[grade as keyof typeof gradeSystem];
    if (gradeValue >= 3.5) return 'bg-secondary text-secondary-foreground';
    if (gradeValue >= 3.0) return 'bg-accent text-accent-foreground';
    if (gradeValue >= 2.0) return 'bg-muted text-muted-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  const getCGPAStatus = (cgpa: number) => {
    if (cgpa >= 3.5) return { text: 'Excellent', color: 'text-secondary', icon: Trophy };
    if (cgpa >= 3.0) return { text: 'Good', color: 'text-accent', icon: Target };
    if (cgpa >= 2.0) return { text: 'Average', color: 'text-muted-foreground', icon: BookOpen };
    return { text: 'Below Average', color: 'text-destructive', icon: Target };
  };

  const cgpa = calculateCGPA();
  const status = getCGPAStatus(cgpa);
  const StatusIcon = status.icon;

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
              <h1 className="text-2xl font-bold text-foreground">CGPA Calculator</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CGPA Result */}
          <div className="lg:col-span-1">
            <Card className="mb-6 bg-gradient-primary/5 border-primary/20">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Your CGPA
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {cgpa || '0.00'}
                </div>
                <div className={`flex items-center justify-center gap-2 ${status.color}`}>
                  <StatusIcon className="h-4 w-4" />
                  <span className="font-medium">{status.text}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Out of 4.00 scale
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {subjects.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Subjects</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent">
                    {subjects.reduce((sum, subject) => sum + subject.credits, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Credits</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Subject Management */}
          <div className="lg:col-span-2">
            {/* Add Subject Form */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="subjectName">Subject Name</Label>
                    <Input
                      id="subjectName"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                      placeholder="Enter subject name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="credits">Credits</Label>
                    <Input
                      id="credits"
                      type="number"
                      min="1"
                      max="6"
                      value={newSubject.credits}
                      onChange={(e) => setNewSubject({...newSubject, credits: e.target.value})}
                      placeholder="Credits"
                    />
                  </div>
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <select
                      id="grade"
                      value={newSubject.grade}
                      onChange={(e) => setNewSubject({...newSubject, grade: e.target.value})}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      {Object.keys(gradeSystem).map(grade => (
                        <option key={grade} value={grade}>
                          {grade} ({gradeSystem[grade as keyof typeof gradeSystem]})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button 
                  onClick={addSubject} 
                  className="mt-4 bg-gradient-primary hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </CardContent>
            </Card>

            {/* Subject List */}
            <Card>
              <CardHeader>
                <CardTitle>Your Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                {subjects.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Subjects Added</h3>
                    <p className="text-muted-foreground">Add your first subject to calculate your CGPA!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{subject.name}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-muted-foreground">
                              {subject.credits} credit{subject.credits !== 1 ? 's' : ''}
                            </span>
                            <Badge className={getGradeColor(subject.grade)}>
                              {subject.grade} ({subject.gradePoints})
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteSubject(subject.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Grade Scale Reference */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Grade Scale Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Object.entries(gradeSystem).map(([grade, points]) => (
                <div key={grade} className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="font-semibold text-foreground">{grade}</div>
                  <div className="text-sm text-muted-foreground">{points}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CGPACalculator;