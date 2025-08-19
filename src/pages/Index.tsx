import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Calculator, 
  CheckSquare, 
  StickyNote, 
  GraduationCap,
  ArrowRight,
  Users,
  Target,
  BookMarked
} from "lucide-react";

const Index = () => {
  const features = [
    {
      title: "Assignment Tracker",
      description: "Stay on top of all your assignments and deadlines",
      icon: CheckSquare,
      path: "/assignments",
      color: "bg-gradient-primary",
    },
    {
      title: "CGPA Calculator",
      description: "Calculate your CGPA and track academic progress",
      icon: Calculator,
      path: "/cgpa", 
      color: "bg-gradient-secondary",
    },
    {
      title: "Quick Notes",
      description: "Record lectures, upload photos, and organize study notes",
      icon: StickyNote,
      path: "/notes",
      color: "bg-gradient-accent",
    },
    {
      title: "Study Resources",
      description: "Access curated study materials and resources",
      icon: BookMarked,
      path: "/resources",
      color: "bg-gradient-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Campus Craft Zone</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-foreground mb-6">
              Your Ultimate <span className="bg-gradient-primary bg-clip-text text-transparent">Student Hub</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Streamline your academic journey with powerful tools for assignments, grades, notes, and study resources. 
              Everything you need to succeed in one beautiful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-3">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="flex items-center text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                <span>Trusted by 10,000+ students</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need to Excel
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed specifically for students to manage academics efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.path} className="group">
                <Card className="h-full hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-border/50">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-4 text-primary group-hover:text-primary-hover flex items-center justify-center">
                      <span className="text-sm font-medium">Explore</span>
                      <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">10,000+</div>
              <div className="text-muted-foreground">Active Students</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">50,000+</div>
              <div className="text-muted-foreground">Assignments Tracked</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-accent">98%</div>
              <div className="text-muted-foreground">Student Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">Campus Craft Zone</span>
          </div>
          <p className="text-muted-foreground">
            Empowering students to achieve academic excellence
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;