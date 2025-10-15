import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import gsap from 'gsap';
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Star,
  MessageSquare,
  BarChart3,
  PieChart as PieChartIcon,
  Users,
  Tag,
  Globe,
} from 'lucide-react';

interface RaterScore {
  score: number;
  rating_label?: string;
  is_flipped?: boolean;
  rationale: string;
}

interface CustomFields {
  [key: string]: string[];
}

interface Example {
  input_text: string;
  tags: string[];
  output_text_a: string;
  output_text_b: string;
  score: number;
  individual_rater_scores: RaterScore[];
  custom_fields: CustomFields;
}

interface Metadata {
  source_path: string;
  custom_fields_schema: Array<{
    name: string;
    type: string;
  }>;
}

interface Model {
  name: string;
}

interface LLMComparatorData {
  metadata: Metadata;
  models: Model[];
  examples: Example[];
}

interface LLMComparatorProps {
  data: LLMComparatorData;
}

const LLMComparator: React.FC<LLMComparatorProps> = ({ data }) => {
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);
  const [filteredExamples, setFilteredExamples] = useState<Example[]>(data.examples);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP Animations
  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  }, []);

  // Filter examples
  useEffect(() => {
    let filtered = data.examples;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(ex =>
        ex.input_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.output_text_a.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.output_text_b.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tag filter
    if (selectedTag !== 'all') {
      filtered = filtered.filter(ex =>
        ex.tags.includes(selectedTag)
      );
    }

    // Score filter
    if (scoreFilter !== 'all') {
      filtered = filtered.filter(ex => {
        if (scoreFilter === 'a_better') return ex.score > 0;
        if (scoreFilter === 'b_better') return ex.score < 0;
        if (scoreFilter === 'same') return ex.score === 0;
        return true;
      });
    }

    setFilteredExamples(filtered);
  }, [searchQuery, selectedTag, scoreFilter, data.examples]);

  // Get all unique tags
  const allTags = Array.from(new Set(data.examples.flatMap(ex => ex.tags)));

  // Calculate statistics
  const stats = {
    total: data.examples.length,
    modelABetter: data.examples.filter(ex => ex.score > 0).length,
    modelBBetter: data.examples.filter(ex => ex.score < 0).length,
    tie: data.examples.filter(ex => ex.score === 0).length,
    avgScore: (data.examples.reduce((sum, ex) => sum + ex.score, 0) / data.examples.length).toFixed(2),
  };

  // Score distribution data
  const scoreDistribution = [
    { range: 'B Much Better (-1.5 to -1)', count: data.examples.filter(ex => ex.score <= -1 && ex.score >= -1.5).length, color: '#ef4444' },
    { range: 'B Better (-1 to -0.5)', count: data.examples.filter(ex => ex.score < -0.5 && ex.score > -1).length, color: '#f87171' },
    { range: 'B Slightly Better (-0.5 to 0)', count: data.examples.filter(ex => ex.score < 0 && ex.score >= -0.5).length, color: '#fca5a5' },
    { range: 'Same (0)', count: data.examples.filter(ex => ex.score === 0).length, color: '#94a3b8' },
    { range: 'A Slightly Better (0 to 0.5)', count: data.examples.filter(ex => ex.score > 0 && ex.score <= 0.5).length, color: '#93c5fd' },
    { range: 'A Better (0.5 to 1)', count: data.examples.filter(ex => ex.score > 0.5 && ex.score < 1).length, color: '#60a5fa' },
    { range: 'A Much Better (1 to 1.5)', count: data.examples.filter(ex => ex.score >= 1 && ex.score <= 1.5).length, color: '#3b82f6' },
  ];

  // Rater agreement data
  const getRaterAgreement = () => {
    const allScores = data.examples.flatMap(ex => ex.individual_rater_scores);
    const agreementData = [
      { label: 'A Much Better', count: allScores.filter(r => r.score === 1.5 || r.score === -1.5 && r.is_flipped).length },
      { label: 'A Better', count: allScores.filter(r => r.score === 1.0 || r.score === -1.0 && r.is_flipped).length },
      { label: 'A Slightly Better', count: allScores.filter(r => r.score === 0.5 || r.score === -0.5 && r.is_flipped).length },
      { label: 'Same', count: allScores.filter(r => r.score === 0).length },
      { label: 'B Slightly Better', count: allScores.filter(r => r.score === -0.5 || r.score === 0.5 && r.is_flipped).length },
      { label: 'B Better', count: allScores.filter(r => r.score === -1.0 || r.score === 1.0 && r.is_flipped).length },
      { label: 'B Much Better', count: allScores.filter(r => r.score === -1.5 || r.score === 1.5 && r.is_flipped).length },
    ];
    return agreementData;
  };

  const getScoreColor = (score: number): string => {
    if (score > 0.5) return 'text-blue-600';
    if (score > 0) return 'text-blue-400';
    if (score === 0) return 'text-gray-600';
    if (score > -0.5) return 'text-red-400';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number): 'default' | 'secondary' | 'destructive' => {
    if (score > 0) return 'default';
    if (score === 0) return 'secondary';
    return 'destructive';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 1) return `${data.models[0].name} Much Better`;
    if (score > 0.5) return `${data.models[0].name} Better`;
    if (score > 0) return `${data.models[0].name} Slightly Better`;
    if (score === 0) return 'Same';
    if (score > -0.5) return `${data.models[1].name} Slightly Better`;
    if (score > -1) return `${data.models[1].name} Better`;
    return `${data.models[1].name} Much Better`;
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div ref={containerRef} className="w-full space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ArrowLeftRight className="h-8 w-8" />
            LLM Comparator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {data.models[0].name} vs {data.models[1].name}
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {data.examples.length} Examples
        </Badge>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{data.models[0].name} Better</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.modelABetter}
            </div>
            <Progress value={(stats.modelABetter / stats.total) * 100} className="mt-2" />
            <p className="text-xs text-gray-600 mt-2">
              {((stats.modelABetter / stats.total) * 100).toFixed(1)}% of examples
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{data.models[1].name} Better</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.modelBBetter}
            </div>
            <Progress value={(stats.modelBBetter / stats.total) * 100} className="mt-2" />
            <p className="text-xs text-gray-600 mt-2">
              {((stats.modelBBetter / stats.total) * 100).toFixed(1)}% of examples
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tie</CardTitle>
            <Minus className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.tie}
            </div>
            <Progress value={(stats.tie / stats.total) * 100} className="mt-2" />
            <p className="text-xs text-gray-600 mt-2">
              {((stats.tie / stats.total) * 100).toFixed(1)}% of examples
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(parseFloat(stats.avgScore))}`}>
              {stats.avgScore}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Range: -1.5 to 1.5
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search examples..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="a_better">{data.models[0].name} Better</SelectItem>
                <SelectItem value="b_better">{data.models[1].name} Better</SelectItem>
                <SelectItem value="same">Same</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredExamples.length} of {data.examples.length} examples
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="examples" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="raters">Rater Analysis</TabsTrigger>
        </TabsList>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-4">
          {filteredExamples.map((example, index) => (
            <Card 
              key={index}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedExample(selectedExample?.input_text === example.input_text ? null : example)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      {example.input_text}
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-2">
                      {example.tags.map(tag => (
                        <Badge key={tag} variant="outline">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {example.custom_fields.language && (
                        <Badge variant="secondary">
                          <Globe className="h-3 w-3 mr-1" />
                          {example.custom_fields.language[0]}
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getScoreBadge(example.score)}>
                      Score: {example.score.toFixed(1)}
                    </Badge>
                    {selectedExample?.input_text === example.input_text ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {selectedExample?.input_text === example.input_text && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Model A Response */}
                    <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/10">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                        {data.models[0].name}
                        {example.score > 0 && <Badge variant="default">Better</Badge>}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {example.output_text_a}
                      </p>
                      {example.custom_fields.language && (
                        <Badge variant="outline" className="mt-2">
                          {example.custom_fields.language[0]}
                        </Badge>
                      )}
                    </div>

                    {/* Model B Response */}
                    <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-900/10">
                      <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
                        {data.models[1].name}
                        {example.score < 0 && <Badge variant="destructive">Better</Badge>}
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {example.output_text_b}
                      </p>
                      {example.custom_fields.language && (
                        <Badge variant="outline" className="mt-2">
                          {example.custom_fields.language[1]}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Individual Rater Scores */}
                  {example.individual_rater_scores.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Individual Rater Scores ({example.individual_rater_scores.length} raters)
                      </h4>
                      <div className="space-y-2">
                        {example.individual_rater_scores.map((rater, rIdx) => (
                          <div key={rIdx} className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant={getScoreBadge(rater.score)}>
                                {rater.rating_label || getScoreLabel(rater.score)}
                              </Badge>
                              <span className={`font-semibold ${getScoreColor(rater.score)}`}>
                                {rater.score.toFixed(1)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {rater.rationale}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                    <span>Overall Judgment: <strong>{getScoreLabel(example.score)}</strong></span>
                    <span className={`font-bold ${getScoreColor(example.score)}`}>
                      Score: {example.score.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          {filteredExamples.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-gray-500">
                No examples match your filters. Try adjusting your search criteria.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Score Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Score Distribution
                </CardTitle>
                <CardDescription>Distribution of comparison scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#3b82f6">
                      {scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Win Rate Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Win Rate Distribution
                </CardTitle>
                <CardDescription>Overall model performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: `${data.models[0].name} Better`, value: stats.modelABetter },
                        { name: `${data.models[1].name} Better`, value: stats.modelBBetter },
                        { name: 'Tie', value: stats.tie },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: `${data.models[0].name} Better`, value: stats.modelABetter },
                        { name: `${data.models[1].name} Better`, value: stats.modelBBetter },
                        { name: 'Tie', value: stats.tie },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance by Tag */}
          {allTags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
                <CardDescription>Model comparison across different categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={allTags.map(tag => {
                      const tagExamples = data.examples.filter(ex => ex.tags.includes(tag));
                      return {
                        category: tag,
                        [data.models[0].name]: tagExamples.filter(ex => ex.score > 0).length,
                        [data.models[1].name]: tagExamples.filter(ex => ex.score < 0).length,
                        'Tie': tagExamples.filter(ex => ex.score === 0).length,
                      };
                    })}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey={data.models[0].name} fill="#3b82f6" />
                    <Bar dataKey={data.models[1].name} fill="#ef4444" />
                    <Bar dataKey="Tie" fill="#94a3b8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Rater Analysis Tab */}
        <TabsContent value="raters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Rater Agreement Distribution
              </CardTitle>
              <CardDescription>How individual raters scored the comparisons</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={getRaterAgreement()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Rater Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {data.examples.reduce((sum, ex) => sum + ex.individual_rater_scores.length, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Avg Raters per Example</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {(data.examples.reduce((sum, ex) => sum + ex.individual_rater_scores.length, 0) / data.examples.length).toFixed(1)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Agreement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {(() => {
                    const examplesWithRatings = data.examples.filter(ex => ex.individual_rater_scores.length > 1);
                    const agreementCount = examplesWithRatings.filter(ex => {
                      const scores = ex.individual_rater_scores.map(r => Math.sign(r.score));
                      return scores.every(s => s === scores[0]);
                    }).length;
                    return ((agreementCount / examplesWithRatings.length) * 100).toFixed(0);
                  })()}%
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Raters agree on the better model
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary Card */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle>Comparison Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">
            Based on {data.examples.length} examples, <strong>{data.models[0].name}</strong> performed better in{' '}
            <strong>{stats.modelABetter}</strong> cases ({((stats.modelABetter / stats.total) * 100).toFixed(1)}%), while{' '}
            <strong>{data.models[1].name}</strong> performed better in <strong>{stats.modelBBetter}</strong> cases{' '}
            ({((stats.modelBBetter / stats.total) * 100).toFixed(1)}%). There were <strong>{stats.tie}</strong> ties{' '}
            ({((stats.tie / stats.total) * 100).toFixed(1)}%). The average comparison score is{' '}
            <strong className={getScoreColor(parseFloat(stats.avgScore))}>{stats.avgScore}</strong>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LLMComparator;