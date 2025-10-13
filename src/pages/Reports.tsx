import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Share2, Brain, Sparkles, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReports } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const { toast } = useToast();
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [exportType, setExportType] = useState<string | null>(null);

  useEffect(() => {
    const reports = getReports();
    if (reports.length > 0) {
      setCurrentReport(reports[reports.length - 1]);
    }
  }, []);

  const reportSections = currentReport ? [
    {
      title: "Fairness Metrics Summary",
      content: `Overall fairness score of ${currentReport.fairnessScore}% indicates ${currentReport.fairnessScore >= 80 ? 'excellent' : currentReport.fairnessScore >= 60 ? 'moderate' : 'concerning'} bias levels. The model performs ${currentReport.predictiveEquality > currentReport.equalOpportunity ? 'better' : 'worse'} on predictive equality (${currentReport.predictiveEquality}%) compared to equal opportunity (${currentReport.equalOpportunity}%).`,
    },
    {
      title: "Model Interpretability",
      content: "Feature importance analysis reveals that age and location are the most influential factors in predictions. Gender has lower feature importance but shows systematic bias patterns in certain decision boundaries.",
    },
    {
      title: "Counterfactual Examples",
      content: "Switching gender from male to female while keeping other features constant results in 12% lower approval rates on average, indicating potential gender bias that requires mitigation strategies.",
    },
    {
      title: "Demographic Analysis",
      content: `Protected groups show varying prediction rates across ${currentReport.biasMetrics.length} analyzed categories. Age-based disparities show the highest variance (${currentReport.biasMetrics.find((m: any) => m.category === 'Age')?.bias || 0}%), requiring immediate attention.`,
    },
  ] : [];

  const aiSummary = currentReport 
    ? `This model demonstrates ${currentReport.fairnessScore >= 80 ? 'excellent' : currentReport.fairnessScore >= 60 ? 'moderate' : 'concerning'} fairness with a ${currentReport.fairnessScore}% overall score. ${currentReport.biasMetrics.filter((m: any) => m.bias > 20).length > 0 ? `Key concerns include ${currentReport.biasMetrics.filter((m: any) => m.bias > 20).map((m: any) => m.category.toLowerCase()).join(' and ')}-based bias.` : 'Most protected categories show acceptable fairness levels.'} Strong performance in predictive equality (${currentReport.predictiveEquality}%) is a positive indicator. Recommendation: ${currentReport.fairnessScore < 80 ? 'Retrain with balanced demographics and apply fairness constraints during optimization.' : 'Maintain current monitoring protocols and conduct periodic re-evaluation.'}`
    : '';

  const handleExport = (type: 'pdf' | 'json') => {
    if (!currentReport) {
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
      toast({
        title: `Exporting as ${type.toUpperCase()}`,
        description: `Report "${currentReport.modelName}" is being prepared for download.`,
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
              {currentReport ? `Detailed analysis of ${currentReport.modelName}` : 'No report available - upload a model to generate one'}
            </p>
          </div>

          {!currentReport && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-12 rounded-2xl text-center mb-8"
            >
              <Brain className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">No Reports Generated Yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload and analyze a model to generate transparency reports
              </p>
              <Button variant="default" asChild>
                <a href="/upload">
                  <Sparkles className="w-4 h-4" />
                  Upload Model
                </a>
              </Button>
            </motion.div>
          )}

          {currentReport && (
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
                        <FileText className="w-5 h-5 text-primary" />
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
                  variant="default" 
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
                <Button variant="secondary" size="lg">
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
                      {currentReport ? new Date(currentReport.generatedDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Model Type
                    </div>
                    <div className="font-semibold">Binary Classifier</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Dataset Size
                    </div>
                    <div className="font-semibold">156,000 samples</div>
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
