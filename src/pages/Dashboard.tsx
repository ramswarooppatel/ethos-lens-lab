import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Sparkles, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getReports, getModels } from "@/lib/localStorage";
import { generateMockReport } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const reports = getReports();
    if (reports.length > 0) {
      setCurrentReport(reports[reports.length - 1]);
    }
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
                <Button onClick={refreshAnalysis} variant="glass" disabled={analyzing || !currentReport}>
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
                  <Button variant="hero">
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

          {/* Bias Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="glass-panel p-8 rounded-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Bias Breakdown by Category</h2>
              <div className="space-y-6">
                {biasMetrics.map((item) => (
                  <div key={item.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {item.bias}% bias
                        </span>
                        {item.trend === "down" ? (
                          <TrendingDown className="w-4 h-4 text-primary" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                    </div>
                    <Progress value={100 - item.bias} className="h-2" />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="glass-panel p-8 rounded-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Recommendations</h2>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Age Bias Detected</h3>
                      <p className="text-sm text-muted-foreground">
                        Consider rebalancing training data for age groups 18-25 and 65+
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Good Performance</h3>
                      <p className="text-sm text-muted-foreground">
                        Location and race metrics show strong fairness indicators
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Further Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Run intersectional bias tests for gender × age combinations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/reports">
              <Button variant="hero" size="lg">
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
