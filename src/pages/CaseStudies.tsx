import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, TrendingUp, TrendingDown, Users, Calendar, Filter, Search, ExternalLink, BarChart3, Target, AlertTriangle } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface CaseStudy {
  id: string;
  title: string;
  summary: string;
  industry: string;
  beforeMetrics: {
    fairnessScore: number;
    biasLevel: number;
    affectedUsers: number;
  };
  afterMetrics: {
    fairnessScore: number;
    biasLevel: number;
    affectedUsers: number;
  };
  improvements: string[];
  challenges: string[];
  lessons: string[];
  date: string;
  author: string;
  discussions: number;
  tags: string[];
  image?: string;
}

const CaseStudies = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedSort, setSelectedSort] = useState("date");
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);

  useEffect(() => {
    // Mock case studies
    const mockCaseStudies: CaseStudy[] = [
      {
        id: '1',
        title: 'Healthcare AI Bias Reduction in Diagnostic Models',
        summary: 'A comprehensive case study on reducing racial bias in medical diagnostic AI systems through targeted data augmentation and fairness-aware training.',
        industry: 'Healthcare',
        beforeMetrics: {
          fairnessScore: 65,
          biasLevel: 28,
          affectedUsers: 15000
        },
        afterMetrics: {
          fairnessScore: 89,
          biasLevel: 8,
          affectedUsers: 2000
        },
        improvements: [
          '24% increase in fairness score',
          '65% reduction in bias level',
          '87% decrease in affected users'
        ],
        challenges: [
          'Limited diverse training data',
          'Regulatory compliance requirements',
          'Model interpretability concerns'
        ],
        lessons: [
          'Data augmentation is crucial for bias reduction',
          'Regular fairness audits prevent regression',
          'Stakeholder collaboration improves outcomes'
        ],
        date: '2024-01-15',
        author: 'Dr. Maria Rodriguez',
        discussions: 45,
        tags: ['healthcare', 'bias-reduction', 'data-augmentation'],
        image: '/api/placeholder/400/250'
      },
      {
        id: '2',
        title: 'Hiring Algorithm Fairness Overhaul',
        summary: 'Transforming a biased recruitment AI to achieve gender and ethnic parity through algorithmic adjustments and human oversight.',
        industry: 'HR & Recruitment',
        beforeMetrics: {
          fairnessScore: 58,
          biasLevel: 35,
          affectedUsers: 25000
        },
        afterMetrics: {
          fairnessScore: 92,
          biasLevel: 5,
          affectedUsers: 1200
        },
        improvements: [
          '34% increase in fairness score',
          '86% reduction in bias level',
          '95% decrease in affected users'
        ],
        challenges: [
          'Complex intersectional bias patterns',
          'Legal compliance with anti-discrimination laws',
          'Maintaining predictive accuracy'
        ],
        lessons: [
          'Intersectional analysis is essential',
          'Human-AI collaboration enhances fairness',
          'Continuous monitoring prevents bias creep'
        ],
        date: '2024-02-08',
        author: 'James Wilson',
        discussions: 67,
        tags: ['recruitment', 'fairness', 'intersectionality'],
        image: '/api/placeholder/400/250'
      },
      {
        id: '3',
        title: 'Financial Credit Scoring Model Ethics Audit',
        summary: 'Comprehensive audit and remediation of socioeconomic bias in automated credit scoring systems.',
        industry: 'Finance',
        beforeMetrics: {
          fairnessScore: 72,
          biasLevel: 18,
          affectedUsers: 8500
        },
        afterMetrics: {
          fairnessScore: 94,
          biasLevel: 3,
          affectedUsers: 450
        },
        improvements: [
          '22% increase in fairness score',
          '83% reduction in bias level',
          '95% decrease in affected users'
        ],
        challenges: [
          'Socioeconomic data sensitivity',
          'Regulatory scrutiny',
          'Maintaining risk assessment accuracy'
        ],
        lessons: [
          'Transparent auditing builds trust',
          'Multi-stakeholder governance is key',
          'Ethical AI requires ongoing commitment'
        ],
        date: '2024-01-28',
        author: 'Dr. Sarah Chen',
        discussions: 52,
        tags: ['finance', 'credit-scoring', 'transparency'],
        image: '/api/placeholder/400/250'
      }
    ];
    setCaseStudies(mockCaseStudies);
  }, []);

  const filteredCaseStudies = caseStudies.filter(study => {
    const matchesSearch = study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         study.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || study.industry === selectedIndustry;

    return matchesSearch && matchesIndustry;
  }).sort((a, b) => {
    switch (selectedSort) {
      case 'date': return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'impact': return (b.afterMetrics.fairnessScore - b.beforeMetrics.fairnessScore) - (a.afterMetrics.fairnessScore - a.beforeMetrics.fairnessScore);
      case 'discussions': return b.discussions - a.discussions;
      default: return 0;
    }
  });

  const handleViewDetails = (study: CaseStudy) => {
    setSelectedCase(study);
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
              Case <span className="text-gradient">Studies</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Real-world examples of AI ethics audits, successes, and lessons learned
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
              <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{caseStudies.length}</div>
              <div className="text-sm text-muted-foreground">Case Studies</div>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center">
              <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {Math.round(caseStudies.reduce((sum, study) => sum + (study.afterMetrics.fairnessScore - study.beforeMetrics.fairnessScore), 0) / caseStudies.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Improvement</div>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center">
              <Users className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {caseStudies.reduce((sum, study) => sum + study.discussions, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Discussions</div>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center">
              <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {caseStudies.reduce((sum, study) => sum + study.beforeMetrics.affectedUsers - study.afterMetrics.affectedUsers, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Users Helped</div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search case studies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-panel border-foreground/20"
                />
              </div>

              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="glass-panel border-foreground/20">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="HR & Recruitment">HR & Recruitment</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSort} onValueChange={setSelectedSort}>
                <SelectTrigger className="glass-panel border-foreground/20">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="impact">Impact</SelectItem>
                  <SelectItem value="discussions">Discussions</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedIndustry("all");
                  setSelectedSort("date");
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </motion.div>

          {/* Case Studies Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            {filteredCaseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                className="break-inside-avoid"
              >
                <div className="glass-panel-hover p-6 rounded-2xl mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline" className="capitalize">
                      {study.industry}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(study.date).toLocaleDateString()}
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{study.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {study.summary}
                  </p>

                  {/* Metrics Comparison */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Before</div>
                      <div className="text-sm font-semibold text-red-400">
                        {study.beforeMetrics.fairnessScore}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">After</div>
                      <div className="text-sm font-semibold text-green-400">
                        {study.afterMetrics.fairnessScore}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Improvement</div>
                      <div className="text-sm font-semibold text-primary">
                        +{study.afterMetrics.fairnessScore - study.beforeMetrics.fairnessScore}%
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {study.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {study.discussions} discussions
                    </div>
                    <div>By {study.author}</div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => handleViewDetails(study)}
                        className="w-full"
                        variant="hero"
                      >
                        View Details
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">{study.title}</DialogTitle>
                        <DialogDescription className="text-base">
                          {study.summary}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        {/* Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="glass-panel p-4 rounded-xl">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <BarChart3 className="w-5 h-5" />
                              Before Intervention
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Fairness Score:</span>
                                <span className="text-red-400">{study.beforeMetrics.fairnessScore}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Bias Level:</span>
                                <span className="text-red-400">{study.beforeMetrics.biasLevel}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Affected Users:</span>
                                <span className="text-red-400">{study.beforeMetrics.affectedUsers.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="glass-panel p-4 rounded-xl">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <TrendingUp className="w-5 h-5" />
                              After Intervention
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Fairness Score:</span>
                                <span className="text-green-400">{study.afterMetrics.fairnessScore}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Bias Level:</span>
                                <span className="text-green-400">{study.afterMetrics.biasLevel}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Affected Users:</span>
                                <span className="text-green-400">{study.afterMetrics.affectedUsers.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Improvements */}
                        <div className="glass-panel p-4 rounded-xl">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            Key Improvements
                          </h4>
                          <ul className="space-y-1">
                            {study.improvements.map((improvement, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Challenges */}
                        <div className="glass-panel p-4 rounded-xl">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                            Challenges Faced
                          </h4>
                          <ul className="space-y-1">
                            {study.challenges.map((challenge, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                                {challenge}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Lessons Learned */}
                        <div className="glass-panel p-4 rounded-xl">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-400" />
                            Lessons Learned
                          </h4>
                          <ul className="space-y-1">
                            {study.lessons.map((lesson, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                {lesson}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="text-sm text-muted-foreground">
                            By {study.author} • {study.discussions} community discussions
                          </div>
                          <Button variant="outline">
                            Join Discussion
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredCaseStudies.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No case studies found</h3>
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

export default CaseStudies;