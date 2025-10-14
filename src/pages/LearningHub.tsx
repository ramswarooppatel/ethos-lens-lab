import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Play, Search, Filter, Award, Clock, Users, Star, ChevronRight, Video, FileText, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'tutorial' | 'video' | 'glossary' | 'quiz';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  rating: number;
  completions: number;
  tags: string[];
  content?: string;
}

const LearningHub = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [resources, setResources] = useState<LearningResource[]>([]);

  useEffect(() => {
    // Mock learning resources
    const mockResources: LearningResource[] = [
      {
        id: '1',
        title: 'Understanding AI Bias: Types and Detection',
        description: 'Learn about different types of bias in AI systems and how to detect them using fairness metrics.',
        type: 'tutorial',
        category: 'Bias Types',
        difficulty: 'beginner',
        duration: '15 min',
        rating: 4.8,
        completions: 1247,
        tags: ['bias', 'fairness', 'detection'],
        content: 'This tutorial covers...'
      },
      {
        id: '2',
        title: 'Fairness Metrics Deep Dive',
        description: 'Explore comprehensive fairness metrics including demographic parity, equal opportunity, and predictive equality.',
        type: 'video',
        category: 'Fairness Metrics',
        difficulty: 'intermediate',
        duration: '25 min',
        rating: 4.9,
        completions: 892,
        tags: ['metrics', 'fairness', 'evaluation'],
        content: 'Video content...'
      },
      {
        id: '3',
        title: 'AI Ethics Glossary',
        description: 'Complete glossary of AI ethics terms, concepts, and definitions.',
        type: 'glossary',
        category: 'Ethics',
        difficulty: 'beginner',
        duration: '10 min',
        rating: 4.6,
        completions: 2156,
        tags: ['glossary', 'ethics', 'terms'],
        content: 'Glossary content...'
      },
      {
        id: '4',
        title: 'Bias Mitigation Quiz',
        description: 'Test your knowledge of bias mitigation techniques and best practices.',
        type: 'quiz',
        category: 'Bias Types',
        difficulty: 'intermediate',
        duration: '20 min',
        rating: 4.7,
        completions: 634,
        tags: ['quiz', 'mitigation', 'assessment'],
        content: 'Quiz questions...'
      },
      {
        id: '5',
        title: 'Model Interpretability Techniques',
        description: 'Advanced techniques for understanding and explaining AI model decisions.',
        type: 'tutorial',
        category: 'Interpretability',
        difficulty: 'advanced',
        duration: '35 min',
        rating: 4.5,
        completions: 423,
        tags: ['interpretability', 'explainability', 'advanced'],
        content: 'Advanced tutorial...'
      }
    ];
    setResources(mockResources);
  }, []);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesType && matchesDifficulty;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tutorial': return <BookOpen className="w-5 h-5" />;
      case 'video': return <Play className="w-5 h-5" />;
      case 'glossary': return <FileText className="w-5 h-5" />;
      case 'quiz': return <Award className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleStartResource = (resource: LearningResource) => {
    toast({
      title: "Starting Learning Resource",
      description: `Opening "${resource.title}"...`,
    });
    // Simulate opening resource
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Learning <span className="text-gradient">Hub</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Master AI ethics and bias detection through interactive tutorials and resources
            </p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="glass-panel p-4 rounded-xl text-center">
              <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{resources.length}</div>
              <div className="text-sm text-muted-foreground">Resources</div>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center">
              <Users className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {resources.reduce((sum, r) => sum + r.completions, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Completions</div>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center">
              <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {Math.round(resources.reduce((sum, r) => sum + parseInt(r.duration), 0) / resources.length)}m
              </div>
              <div className="text-sm text-muted-foreground">Avg Duration</div>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center">
              <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {(resources.reduce((sum, r) => sum + r.rating, 0) / resources.length).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="glass-panel p-6 rounded-2xl mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Filters & Search</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-panel border-foreground/20"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="glass-panel border-foreground/20">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Bias Types">Bias Types</SelectItem>
                  <SelectItem value="Fairness Metrics">Fairness Metrics</SelectItem>
                  <SelectItem value="Ethics">Ethics</SelectItem>
                  <SelectItem value="Interpretability">Interpretability</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="glass-panel border-foreground/20">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="glossary">Glossary</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="glass-panel border-foreground/20">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedType("all");
                  setSelectedDifficulty("all");
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </motion.div>

          {/* Resources Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
              >
                <Card className="glass-panel-hover h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(resource.type)}
                        <Badge variant="outline" className="capitalize">
                          {resource.type}
                        </Badge>
                      </div>
                      <Badge className={getDifficultyColor(resource.difficulty)}>
                        {resource.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {resource.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        {resource.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {resource.completions}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleStartResource(resource)}
                      className="w-full"
                      variant="hero"
                    >
                      Start Learning
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredResources.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No resources found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LearningHub;