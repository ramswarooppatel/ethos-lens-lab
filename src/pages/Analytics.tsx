import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Filter, Globe, AlertTriangle, Download, RefreshCw, Sparkles, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import InteractiveGlobe from "@/components/Globe";

interface RegionData {
  region: string;
  fairness: number;
  models: number;
  lat: number;
  lng: number;
  description: string;
}

interface NodeData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'Fair' | 'InProgress' | 'Biased';
  score: number;
  description: string;
  region: string;
}

const Analytics = () => {
  const { toast } = useToast();
  const [globalScore, setGlobalScore] = useState(75);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedModel, setSelectedModel] = useState("all");
  const [selectedDataset, setSelectedDataset] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedGlobeRegion, setSelectedGlobeRegion] = useState<NodeData | null>(null);

  const regionalData = [
    { region: "North America", fairness: 78, models: 234 },
    { region: "Europe", fairness: 82, models: 189 },
    { region: "Asia Pacific", fairness: 71, models: 312 },
    { region: "Latin America", fairness: 69, models: 87 },
    { region: "Middle East & Africa", fairness: 74, models: 56 },
  ];

  const trendData = [
    { month: "Jan", score: 68 },
    { month: "Feb", score: 71 },
    { month: "Mar", score: 69 },
    { month: "Apr", score: 73 },
    { month: "May", score: 76 },
    { month: "Jun", score: 74 },
  ];

  const refreshData = () => {
    setRefreshing(true);
    setTimeout(() => {
      const newScore = Math.floor(Math.random() * 20) + 70;
      setGlobalScore(newScore);
      setRefreshing(false);
      toast({
        title: "Analytics Refreshed",
        description: "Latest fairness data has been loaded.",
      });
    }, 1500);
  };

  const exportReport = () => {
    toast({
      title: "Exporting Analytics",
      description: "Global analytics report is being prepared for download.",
    });
  };

  const getStatusBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getFairnessLevel = (score: number) => {
    if (score >= 75) return 'High';
    if (score >= 70) return 'Medium';
    return 'Low';
  };

  const getTrend = (currentScore: number, prevScore: number) => {
    if (currentScore > prevScore) return "up";
    if (currentScore < prevScore) return "down";
    return "same";
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Global <span className="text-gradient">Analytics</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Real-time insights across 878 models and datasets
                </p>
              </div>
              <Button onClick={refreshData} variant="secondary" disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="glass-panel p-6 rounded-2xl mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="glass-panel border-foreground/20">
                  <SelectValue placeholder="Model Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  <SelectItem value="classification">Classification</SelectItem>
                  <SelectItem value="regression">Regression</SelectItem>
                  <SelectItem value="nlp">NLP</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                <SelectTrigger className="glass-panel border-foreground/20">
                  <SelectValue placeholder="Dataset Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Datasets</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="hiring">Hiring</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="glass-panel border-foreground/20">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="na">North America</SelectItem>
                  <SelectItem value="eu">Europe</SelectItem>
                  <SelectItem value="ap">Asia Pacific</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Fairness Index Gauge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="glass-panel p-8 rounded-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Global Fairness Index
              </h2>
              <div className="flex items-center justify-center mb-8">
                <div className="relative w-48 h-48">
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-foreground/10"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${globalScore * 5.026} ${100 * 5.026}`}
                      className="text-primary glow-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-5xl font-bold">{globalScore}</span>
                    <span className="text-sm text-muted-foreground">Fairness Score</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-muted-foreground">
                Based on 878 models analyzed across all regions
              </p>
            </motion.div>

            {/* Bias Trend Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="glass-panel p-8 rounded-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Bias Trend Over Time</h2>
              <div className="space-y-4">
                {trendData.map((data, index) => {
                  const prevScore = index > 0 ? trendData[index - 1].score : data.score;
                  const trend = getTrend(data.score, prevScore);
                  return (
                    <div key={data.month} className="flex items-center gap-4">
                      <div className="w-12 text-sm text-muted-foreground">{data.month}</div>
                      <div className="flex-1 bg-foreground/5 rounded-full h-8 relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${data.score}%` }}
                          transition={{ delay: index * 0.1, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full glow-primary"
                        />
                      </div>
                      <div className="w-12 text-sm font-semibold">{data.score}%</div>
                      {trend === "up" && <ArrowUp className="w-4 h-4 text-primary" />}
                      {trend === "down" && <ArrowDown className="w-4 h-4 text-red-400" />}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Regional Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="glass-panel p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              Regional Fairness Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {regionalData.map((region, index) => (
                <motion.div
                  key={region.region}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  className="glass-panel-hover p-6 rounded-xl text-center"
                >
                  <div className="text-3xl font-bold mb-2">{region.fairness}%</div>
                  <div className="text-sm font-medium mb-1">{region.region}</div>
                  <div className="text-xs text-muted-foreground">{region.models} models</div>
                  {region.fairness < 75 && (
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mx-auto mt-2" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 3D Globe Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="glass-panel p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              3D Fairness Globe
            </h2>
            <div className="mb-6">
              <InteractiveGlobe onNodeClick={setSelectedGlobeRegion} onNodeHover={() => {}} />
            </div>

            {/* Region Details Panel */}
            {selectedGlobeRegion && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6 rounded-xl border border-primary/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{selectedGlobeRegion.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedGlobeRegion.score)}`}>
                      {selectedGlobeRegion.score}% Fairness
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{selectedGlobeRegion.id}</div>
                    <div className="text-sm text-muted-foreground">Node ID</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">
                      {getFairnessLevel(selectedGlobeRegion.score)}
                    </div>
                    <div className="text-sm text-muted-foreground">Fairness Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {selectedGlobeRegion.status}
                    </div>
                    <div className="text-sm text-muted-foreground">Status</div>
                  </div>
                </div>

                <p className="text-muted-foreground">{selectedGlobeRegion.description}</p>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">
                    View Detailed Report
                  </Button>
                  <Button variant="outline" size="sm">
                    Compare Regions
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Export */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex justify-center mt-8"
          >
            <Button variant="default" size="lg" onClick={exportReport}>
              Export Analytics Report
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
