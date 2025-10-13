import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Sparkles, RefreshCw, ArrowRight, BarChart3, PieChart, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getReports, getModels, getStats, AuditReport } from "@/lib/localStorage";
import { generateMockReport } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

const Dashboard = () => {
  const { toast } = useToast();
  const [currentReport, setCurrentReport] = useState<AuditReport | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [stats, setStats] = useState(getStats());
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Mock chart data
  const fairnessTrendData = [
    { date: '2024-01-01', fairness: 75 },
    { date: '2024-01-08', fairness: 78 },
    { date: '2024-01-15', fairness: 82 },
    { date: '2024-01-22', fairness: 79 },
    { date: '2024-01-29', fairness: 85 },
    { date: '2024-02-05', fairness: 87 },
  ];

  const biasDistributionData = [
    { category: 'Gender', bias: 12, color: '#00E0C6' },
    { category: 'Age', bias: 8, color: '#9B9EF5' },
    { category: 'Ethnicity', bias: 15, color: '#FF6B6B' },
    { category: 'Location', bias: 5, color: '#4ECDC4' },
  ];

  const biasBreakdownData = [
    { name: 'Gender Bias', value: 25, color: '#00E0C6' },
    { name: 'Age Bias', value: 20, color: '#9B9EF5' },
    { name: 'Ethnicity Bias', value: 30, color: '#FF6B6B' },
    { name: 'Location Bias', value: 15, color: '#4ECDC4' },
    { name: 'Other', value: 10, color: '#FFD93D' },
  ];

  const recentActivity = [
    {
      icon: BarChart3,
      title: 'Model Analysis Completed',
      description: 'Healthcare prediction model analyzed for bias',
      time: '2 hours ago'
    },
    {
      icon: PieChart,
      title: 'Bias Report Generated',
      description: 'Comprehensive fairness assessment completed',
      time: '4 hours ago'
    },
    {
      icon: TrendingUp,
      title: 'Fairness Score Improved',
      description: 'Overall fairness increased by 5% this week',
      time: '1 day ago'
    },
    {
      icon: Filter,
      title: 'New Dataset Uploaded',
      description: 'Demographic data added for enhanced analysis',
      time: '2 days ago'
    },
  ];

  useEffect(() => {
    const reports = getReports();
    if (reports.length > 0) {
      setCurrentReport(reports[reports.length - 1]);
    }
    setStats(getStats());
  }, []);

  const loadDemoReport = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const models = getModels();
      const mockReport = generateMockReport(
        models.length > 0 ? models[0].id : 'demo_model',
        models.length > 0 ? models[0].name : 'Demo Healthcare Model'
      );
      setCurrentReport(mockReport);
      setAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: "Demo report loaded successfully.",
      });
    }, 1500);
  };

  const refreshAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const reports = getReports();
      if (reports.length > 0) {
        setCurrentReport(reports[reports.length - 1]);
      }
      setAnalyzing(false);
      toast({
        title: "Analysis Refreshed",
        description: "Latest report loaded successfully.",
      });
    }, 1000);
  };

  const metrics = currentReport ? [
    {
      name: "Fairness Score",
      value: currentReport.fairnessScore,
      status: currentReport.fairnessScore >= 80 ? "good" : currentReport.fairnessScore >= 60 ? "warning" : "poor",
      description: "Overall fairness across all demographics",
    },
    {
      name: "Demographic Parity",
      value: currentReport.demographicParity,
      status: currentReport.demographicParity >= 80 ? "good" : "warning",
      description: "Equal positive prediction rates",
    },
    {
      name: "Equal Opportunity",
      value: currentReport.equalOpportunity,
      status: currentReport.equalOpportunity >= 80 ? "good" : "warning",
      description: "Equal true positive rates",
    },
    {
      name: "Predictive Equality",
      value: currentReport.predictiveEquality,
      status: currentReport.predictiveEquality >= 85 ? "excellent" : "good",
      description: "Equal false positive rates",
    },
  ] : [];

  const biasMetrics = currentReport?.biasMetrics || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-primary";
      case "good":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      default:
        return "text-red-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
      case "good":
        return CheckCircle2;
      default:
        return AlertCircle;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Bias <span className="text-gradient">Evaluation</span> Dashboard
                </h1>
                <p className="text-xl text-muted-foreground">
                  {currentReport ? `Analysis of ${currentReport.modelName}` : 'Load a model to see analysis'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={loadDemoReport} variant="outline" disabled={analyzing}>
                  <Sparkles className="w-4 h-4" />
                  Load Demo
                </Button>
                <Button onClick={refreshAnalysis} variant="secondary" disabled={analyzing || !currentReport}>
                  <RefreshCw className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {!currentReport && !analyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-12 rounded-2xl text-center mb-8"
            >
              <h3 className="text-2xl font-bold mb-4">No Analysis Available</h3>
              <p className="text-muted-foreground mb-6">
                Upload a model or load demo data to see bias evaluation metrics
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/upload">
                  <Button variant="default">
                    <ArrowRight className="w-4 h-4" />
                    Upload Model
                  </Button>
                </Link>
                <Button onClick={loadDemoReport} variant="outline">
                  <Sparkles className="w-4 h-4" />
                  Load Demo Report
                </Button>
              </div>
            </motion.div>
          )}

          {analyzing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-12 rounded-2xl text-center mb-8"
            >
              <RefreshCw className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">Analyzing model fairness metrics...</p>
            </motion.div>
          )}

          {currentReport && !analyzing && (
            <>

          {/* Main Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {metrics.map((metric, index) => {
              const StatusIcon = getStatusIcon(metric.status);
              return (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="glass-panel-hover p-6 rounded-2xl"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      {metric.name}
                    </h3>
                    <StatusIcon
                      className={`w-5 h-5 ${getStatusColor(metric.status)}`}
                    />
                  </div>
                  <div className="mb-3">
                    <div className="text-4xl font-bold mb-1">{metric.value}%</div>
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </motion.div>
              );
            })}
          </div>

          {/* Interactive Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Fairness Trend</h2>
                <div className="flex gap-2">
                  <Button
                    variant={timeRange === '7d' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeRange('7d')}
                  >
                    7D
                  </Button>
                  <Button
                    variant={timeRange === '30d' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeRange('30d')}
                  >
                    30D
                  </Button>
                  <Button
                    variant={timeRange === '90d' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeRange('90d')}
                  >
                    90D
                  </Button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fairnessTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="fairness"
                    stroke="#00E0C6"
                    strokeWidth={3}
                    dot={{ fill: '#00E0C6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <h2 className="text-xl font-bold mb-6">Bias Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={biasDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="category" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="bias" fill="#00E0C6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Platform Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="glass-panel p-6 rounded-2xl mb-12"
          >
            <h2 className="text-xl font-bold mb-6">Platform Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.modelsAudited}</div>
                <div className="text-sm text-muted-foreground">Models Audited</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{stats.reportsGenerated}</div>
                <div className="text-sm text-muted-foreground">Reports Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.communityPosts}</div>
                <div className="text-sm text-muted-foreground">Community Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{Math.round(stats.averageFairnessScore)}%</div>
                <div className="text-sm text-muted-foreground">Avg Fairness Score</div>
              </div>
            </div>
          </motion.div>

          {/* Bias Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="glass-panel p-6 rounded-2xl mb-12"
          >
            <h2 className="text-xl font-bold mb-6">Bias Breakdown</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={biasBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {biasBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4">
                {biasBreakdownData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="glass-panel p-6 rounded-2xl"
          >
            <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <activity.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/reports">
              <Button variant="default" size="lg">
                View Detailed Report
              </Button>
            </Link>
            <Link to="/community">
              <Button variant="outline" size="lg">
                Discuss in Community
              </Button>
            </Link>
          </motion.div>
          </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
