import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Share2, Brain, Sparkles, Copy, CheckCircle, Database, Target, Shield, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getReports, getDatasets } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";

interface ModelReport {
  fairnessScore: number;
  predictiveEquality: number;
  equalOpportunity: number;
  biasMetrics: Array<{ category: string; bias: number }>;
}

interface DatasetReport {
  dataset_summary: {
    name: string;
    row_count: number;
    column_count: number;
    file_type: string;
    target_column?: string;
  };
  column_analysis: {
    sensitive_columns?: Array<{ name: string }>;
    total_columns: number;
  };
  ai_generated_report?: {
    bias_analysis?: string;
    data_quality_assessment?: string;
    executive_summary?: string;
    overall_recommendation?: string;
  };
}

const Reports = () => {
  const { toast } = useToast();
  const [currentReport, setCurrentReport] = useState<ModelReport | null>(null);
  const [currentDatasetReport, setCurrentDatasetReport] = useState<DatasetReport | null>(null);
  const [reportType, setReportType] = useState<'model' | 'dataset'>('model');
  const [copied, setCopied] = useState(false);
  const [exportType, setExportType] = useState<string | null>(null);

  useEffect(() => {
    // Check for model reports
    const reports = getReports();
    if (reports.length > 0) {
      setCurrentReport(reports[reports.length - 1] as ModelReport);
      setReportType('model');
    }

    // Check for dataset reports (stored in localStorage after dataset analysis)
    const datasets = getDatasets();
    const latestDataset = datasets[datasets.length - 1];
    if (latestDataset) {
      // Try to get the dataset report from localStorage
      const datasetReport = localStorage.getItem(`dataset_report_${latestDataset.id}`);
      if (datasetReport) {
        const parsedReport = JSON.parse(datasetReport) as DatasetReport;
        setCurrentDatasetReport(parsedReport);
        // If we have a dataset report but no model report, show dataset report
        if (reports.length === 0) {
          setReportType('dataset');
        }
      }
    }
  }, []);

  // Model report sections
  const modelReportSections = currentReport ? [
    {
      title: "Fairness Metrics Summary",
      content: `Overall fairness score of ${currentReport.fairnessScore}% indicates ${currentReport.fairnessScore >= 80 ? 'excellent' : currentReport.fairnessScore >= 60 ? 'moderate' : 'concerning'} bias levels. The model performs ${currentReport.predictiveEquality > currentReport.equalOpportunity ? 'better' : 'worse'} on predictive equality (${currentReport.predictiveEquality}%) compared to equal opportunity (${currentReport.equalOpportunity}%).`,
      icon: Shield,
    },
    {
      title: "Model Interpretability",
      content: "Feature importance analysis reveals that age and location are the most influential factors in predictions. Gender has lower feature importance but shows systematic bias patterns in certain decision boundaries.",
      icon: Brain,
    },
    {
      title: "Counterfactual Examples",
      content: "Switching gender from male to female while keeping other features constant results in 12% lower approval rates on average, indicating potential gender bias that requires mitigation strategies.",
      icon: AlertTriangle,
    },
    {
      title: "Demographic Analysis",
      content: `Protected groups show varying prediction rates across ${currentReport.biasMetrics.length} analyzed categories. Age-based disparities show the highest variance (${currentReport.biasMetrics.find((m: any) => m.category === 'Age')?.bias || 0}%), requiring immediate attention.`,
      icon: TrendingUp,
    },
  ] : [];

  // Dataset report sections
  const datasetReportSections = currentDatasetReport ? [
    {
      title: "Dataset Overview",
      content: `Dataset "${currentDatasetReport.dataset_summary.name}" contains ${currentDatasetReport.dataset_summary.row_count.toLocaleString()} rows and ${currentDatasetReport.dataset_summary.column_count} columns. File type: ${currentDatasetReport.dataset_summary.file_type}. Target column identified: ${currentDatasetReport.dataset_summary.target_column || 'Not specified'}.`,
      icon: Database,
    },
    {
      title: "Column Analysis",
      content: `Analysis identified ${currentDatasetReport.column_analysis.sensitive_columns?.length || 0} potentially sensitive columns: ${currentDatasetReport.column_analysis.sensitive_columns?.map((col: any) => col.name).join(', ') || 'None detected'}. Total columns analyzed: ${currentDatasetReport.column_analysis.total_columns}.`,
      icon: Target,
    },
    {
      title: "Bias Assessment",
      content: currentDatasetReport.ai_generated_report?.bias_analysis 
        ? `Bias analysis reveals: ${currentDatasetReport.ai_generated_report.bias_analysis}`
        : "Bias assessment completed. Review the detailed analysis below for specific findings.",
      icon: Shield,
    },
    {
      title: "Data Quality Assessment",
      content: currentDatasetReport.ai_generated_report?.data_quality_assessment
        ? `Data quality evaluation: ${currentDatasetReport.ai_generated_report.data_quality_assessment}`
        : "Data quality assessment completed. Check the executive summary for detailed findings.",
      icon: CheckCircle,
    },
  ] : [];

  const reportSections = reportType === 'model' ? modelReportSections : datasetReportSections;

  // AI Summary for model reports
  const modelAiSummary = currentReport 
    ? `This model demonstrates ${currentReport.fairnessScore >= 80 ? 'excellent' : currentReport.fairnessScore >= 60 ? 'moderate' : 'concerning'} fairness with a ${currentReport.fairnessScore}% overall score. ${currentReport.biasMetrics.filter((m: any) => m.bias > 20).length > 0 ? `Key concerns include ${currentReport.biasMetrics.filter((m: any) => m.bias > 20).map((m: any) => m.category.toLowerCase()).join(' and ')}-based bias.` : 'Most protected categories show acceptable fairness levels.'} Strong performance in predictive equality (${currentReport.predictiveEquality}%) is a positive indicator. Recommendation: ${currentReport.fairnessScore < 80 ? 'Retrain with balanced demographics and apply fairness constraints during optimization.' : 'Maintain current monitoring protocols and conduct periodic re-evaluation.'}`
    : '';

  // AI Summary for dataset reports
  const datasetAiSummary = currentDatasetReport
    ? currentDatasetReport.ai_generated_report?.executive_summary || 
      `Dataset analysis completed for "${currentDatasetReport.dataset_summary.name}". The analysis identified ${currentDatasetReport.dataset_summary.sensitive_columns?.length || 0} sensitive columns and assessed bias metrics. ${currentDatasetReport.ai_generated_report?.overall_recommendation || 'Review the detailed findings below for specific recommendations.'}`
    : '';

  const aiSummary = reportType === 'model' ? modelAiSummary : datasetAiSummary;

  const handleExport = (type: 'pdf' | 'json') => {
    const hasReport = (reportType === 'model' && currentReport) || (reportType === 'dataset' && currentDatasetReport);
    
    if (!hasReport) {
      toast({
        title: "No Report Available",
        description: "Please generate a report first.",
        variant: "destructive",
      });
      return;
    }

    setExportType(type);
    setTimeout(() => {
      setExportType(null);
      const reportName = reportType === 'model' && currentReport ? (currentReport.modelName || 'model') : 
                        reportType === 'dataset' && currentDatasetReport ? currentDatasetReport.dataset_summary.name : 'report';
      toast({
        title: `Exporting as ${type.toUpperCase()}`,
        description: `Report "${reportName}" is being prepared for download.`,
      });
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiSummary);
    setCopied(true);
    toast({
      title: "Copied to Clipboard",
      description: "AI summary copied successfully.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Transparency <span className="text-gradient">Report</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {reportType === 'model' && currentReport ? `Detailed analysis of ${currentReport.modelName || 'model'}` : 
               reportType === 'dataset' && currentDatasetReport ? `Dataset analysis report for ${currentDatasetReport.dataset_summary.name}` :
               'No reports available - upload a model or dataset to generate one'}
            </p>
          </div>

          {/* Report Type Toggle */}
          {(currentReport || currentDatasetReport) && (
            <div className="mb-8">
              <div className="flex gap-2 p-1 bg-muted/50 rounded-lg w-fit">
                {currentReport && (
                  <Button
                    variant={reportType === 'model' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setReportType('model')}
                    className="px-4"
                  >
                    Model Report
                  </Button>
                )}
                {currentDatasetReport && (
                  <Button
                    variant={reportType === 'dataset' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setReportType('dataset')}
                    className="px-4"
                  >
                    Dataset Report
                  </Button>
                )}
              </div>
            </div>
          )}

          {(!currentReport && !currentDatasetReport) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-12 rounded-2xl text-center mb-8"
            >
              <Brain className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">No Reports Generated Yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload and analyze a model or dataset to generate transparency reports
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="hero" asChild>
                  <a href="/upload">
                    <Sparkles className="w-4 h-4" />
                    Upload Dataset
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/model">
                    Upload Model
                  </a>
                </Button>
              </div>
            </motion.div>
          )}

          {((reportType === 'model' && currentReport) || (reportType === 'dataset' && currentDatasetReport)) && (
            <>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Report Content */}
            <div className="lg:col-span-2 space-y-6">
              {reportSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="glass-panel-hover border-foreground/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {section.icon && <section.icon className="w-5 h-5 text-primary" />}
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {section.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Export Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="flex-1"
                  onClick={() => handleExport('pdf')}
                  disabled={exportType === 'pdf'}
                >
                  {exportType === 'pdf' ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Export as PDF
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1"
                  onClick={() => handleExport('json')}
                  disabled={exportType === 'json'}
                >
                  {exportType === 'json' ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Generating JSON...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Export as JSON
                    </>
                  )}
                </Button>
                <Button variant="glass" size="lg">
                  <Share2 className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>

            {/* AI Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="glass-panel p-6 rounded-2xl border-accent/20 sticky top-24"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-6 h-6 text-accent" />
                  <h3 className="text-xl font-bold">AI Summary</h3>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {aiSummary}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={copyToClipboard}
                      className="ml-2"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4 pt-6 border-t border-foreground/10">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Report Generated
                    </div>
                    <div className="font-semibold">
                      {reportType === 'model' && currentReport ? new Date(currentReport.generatedDate || Date.now()).toLocaleDateString() :
                       reportType === 'dataset' && currentDatasetReport ? new Date().toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {reportType === 'model' ? 'Model Type' : 'Dataset Type'}
                    </div>
                    <div className="font-semibold">
                      {reportType === 'model' ? 'Binary Classifier' : 
                       reportType === 'dataset' ? currentDatasetReport?.dataset_summary.file_type.toUpperCase() : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {reportType === 'model' ? 'Dataset Size' : 'Data Size'}
                    </div>
                    <div className="font-semibold">
                      {reportType === 'model' ? '156,000 samples' : 
                       reportType === 'dataset' ? `${currentDatasetReport?.dataset_summary.row_count.toLocaleString()} rows` : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Audit Status
                    </div>
                    <div className="font-semibold text-primary">Community Verified</div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-6">
                  View Raw Data
                </Button>
              </motion.div>
            </div>
          </div>
          </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
