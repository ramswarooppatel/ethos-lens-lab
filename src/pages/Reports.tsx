import { motion } from "framer-motion";
import { FileText, Download, Share2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Reports = () => {
  const reportSections = [
    {
      title: "Fairness Metrics Summary",
      content: "Overall fairness score of 73% indicates moderate bias levels. The model performs better on predictive equality (91%) compared to equal opportunity (68%).",
    },
    {
      title: "Model Interpretability",
      content: "Feature importance analysis reveals that age and location are the most influential factors in predictions. Gender has lower feature importance but shows systematic bias patterns.",
    },
    {
      title: "Counterfactual Examples",
      content: "Switching gender from male to female while keeping other features constant results in 12% lower approval rates on average, indicating potential gender bias.",
    },
    {
      title: "Demographic Analysis",
      content: "Protected groups show varying prediction rates: Age 18-25 (62% approval), Age 65+ (58% approval), suggesting age-based disparities in model outcomes.",
    },
  ];

  const aiSummary = `This model demonstrates moderate fairness with a 73% overall score. Key concerns include age-based bias (23% variance) and gender disparities in approval rates. Strong performance in predictive equality (91%) and location fairness (8% bias) are positive indicators. Recommendation: Retrain with balanced age demographics and apply fairness constraints during optimization.`;

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
              Comprehensive ethical analysis and bias documentation
            </p>
          </div>

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
                <Button variant="hero" size="lg" className="flex-1">
                  <Download className="w-4 h-4" />
                  Export as PDF
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Download className="w-4 h-4" />
                  Export as JSON
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
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {aiSummary}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4 pt-6 border-t border-foreground/10">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Report Generated
                    </div>
                    <div className="font-semibold">May 15, 2025</div>
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
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
