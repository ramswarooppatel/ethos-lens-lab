import { useState } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, FileCode, Database, Loader2, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { addModel, addDataset, addReport, incrementStat } from "@/lib/localStorage";
import { generateMockModel, generateMockDataset, generateMockReport } from "@/lib/mockData";

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [modelName, setModelName] = useState('');
  const [modelTags, setModelTags] = useState('');
  const [modelDescription, setModelDescription] = useState('');
  const [datasetName, setDatasetName] = useState('');
  const [datasetTags, setDatasetTags] = useState('');
  const [datasetDescription, setDatasetDescription] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUpload = (type: "model" | "dataset") => {
    setUploading(true);
    setUploadComplete(false);

    // Simulate upload process
    setTimeout(() => {
      if (type === 'model') {
        const model = generateMockModel();
        model.name = modelName || model.name;
        model.tags = modelTags ? modelTags.split(',').map(t => t.trim()) : model.tags;
        model.description = modelDescription || model.description;
        
        addModel(model);
        const report = generateMockReport(model.id, model.name);
        addReport(report);
        incrementStat('modelsAudited');
        incrementStat('reportsGenerated');

        setUploading(false);
        setUploadComplete(true);
        
        toast({
          title: "Upload Successful",
          description: "Your model has been uploaded and analyzed. Redirecting to dashboard...",
        });

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        const dataset = generateMockDataset();
        dataset.name = datasetName || dataset.name;
        dataset.tags = datasetTags ? datasetTags.split(',').map(t => t.trim()) : dataset.tags;
        dataset.description = datasetDescription || dataset.description;
        
        addDataset(dataset);
        
        setUploading(false);
        setUploadComplete(true);
        
        toast({
          title: "Upload Successful",
          description: "Your dataset has been uploaded and is ready for analysis.",
        });

        setTimeout(() => setUploadComplete(false), 3000);
      }
    }, 2000);
  };

  const loadDemoModel = () => {
    setModelName('ResNet-50 Healthcare Classifier');
    setModelTags('computer-vision, healthcare, diagnostic');
    setModelDescription('Deep learning model for medical image classification trained on diverse patient demographics.');
  };

  const loadDemoDataset = () => {
    setDatasetName('Healthcare Patient Records 2024');
    setDatasetTags('demographics, medical, structured');
    setDatasetDescription('Anonymized patient records with demographic information including age, gender, location, and medical history.');
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Upload for <span className="text-gradient">Ethical Analysis</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Submit your AI models or datasets for comprehensive bias detection
            </p>
          </div>

          <Tabs defaultValue="model" className="w-full">
            <TabsList className="grid w-full grid-cols-2 glass-panel">
              <TabsTrigger value="model" className="data-[state=active]:bg-primary/20">
                <FileCode className="w-4 h-4 mr-2" />
                Model Upload
              </TabsTrigger>
              <TabsTrigger value="dataset" className="data-[state=active]:bg-primary/20">
                <Database className="w-4 h-4 mr-2" />
                Dataset Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="model" className="mt-6">
              <div className="glass-panel p-8 rounded-2xl space-y-6">
                {/* Drag and Drop Area */}
                <div className="relative group">
                  <div className="glass-panel-hover p-12 rounded-2xl border-2 border-dashed border-foreground/20 hover:border-primary/50 transition-all duration-300 text-center cursor-pointer">
                    {uploadComplete ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col items-center"
                      >
                        <CheckCircle2 className="w-16 h-16 text-primary mb-4" />
                        <p className="text-lg font-medium">Upload Complete!</p>
                      </motion.div>
                    ) : uploading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                        <p className="text-lg font-medium">Analyzing metadata...</p>
                      </div>
                    ) : (
                      <>
                        <UploadIcon className="w-16 h-16 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                        <p className="text-lg font-medium mb-2">Drop your model file here</p>
                        <p className="text-sm text-muted-foreground">or click to browse</p>
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".h5,.pkl,.pt,.onnx"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Demo Button */}
                <Button 
                  onClick={loadDemoModel}
                  variant="outline" 
                  className="w-full mb-4"
                  type="button"
                >
                  <Sparkles className="w-4 h-4" />
                  Load Demo Data
                </Button>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="model-name">Model Name</Label>
                    <Input
                      id="model-name"
                      placeholder="e.g., ResNet-50 Classifier"
                      className="glass-panel border-foreground/20"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="model-tags">Tags</Label>
                    <Input
                      id="model-tags"
                      placeholder="e.g., computer-vision, classification"
                      className="glass-panel border-foreground/20"
                      value={modelTags}
                      onChange={(e) => setModelTags(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="model-description">Description</Label>
                    <Textarea
                      id="model-description"
                      placeholder="Describe your model's purpose and training data..."
                      className="glass-panel border-foreground/20 min-h-[120px]"
                      value={modelDescription}
                      onChange={(e) => setModelDescription(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => handleUpload("model")}
                  disabled={uploading}
                  variant="hero"
                  className="w-full"
                  size="lg"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      Submit Model & Analyze
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="dataset" className="mt-6">
              <div className="glass-panel p-8 rounded-2xl space-y-6">
                {/* Drag and Drop Area */}
                <div className="relative group">
                  <div className="glass-panel-hover p-12 rounded-2xl border-2 border-dashed border-foreground/20 hover:border-primary/50 transition-all duration-300 text-center cursor-pointer">
                    {uploadComplete ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col items-center"
                      >
                        <CheckCircle2 className="w-16 h-16 text-primary mb-4" />
                        <p className="text-lg font-medium">Upload Complete!</p>
                      </motion.div>
                    ) : uploading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                        <p className="text-lg font-medium">Checking demographic balance...</p>
                      </div>
                    ) : (
                      <>
                        <Database className="w-16 h-16 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                        <p className="text-lg font-medium mb-2">Drop your dataset file here</p>
                        <p className="text-sm text-muted-foreground">or click to browse</p>
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".csv,.json,.parquet"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Demo Button */}
                <Button 
                  onClick={loadDemoDataset}
                  variant="outline" 
                  className="w-full mb-4"
                  type="button"
                >
                  <Sparkles className="w-4 h-4" />
                  Load Demo Data
                </Button>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dataset-name">Dataset Name</Label>
                    <Input
                      id="dataset-name"
                      placeholder="e.g., Healthcare Patient Records"
                      className="glass-panel border-foreground/20"
                      value={datasetName}
                      onChange={(e) => setDatasetName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dataset-tags">Tags</Label>
                    <Input
                      id="dataset-tags"
                      placeholder="e.g., healthcare, demographics"
                      className="glass-panel border-foreground/20"
                      value={datasetTags}
                      onChange={(e) => setDatasetTags(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dataset-description">Description</Label>
                    <Textarea
                      id="dataset-description"
                      placeholder="Describe your dataset's features and collection methodology..."
                      className="glass-panel border-foreground/20 min-h-[120px]"
                      value={datasetDescription}
                      onChange={(e) => setDatasetDescription(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => handleUpload("dataset")}
                  disabled={uploading}
                  variant="hero"
                  className="w-full"
                  size="lg"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="w-4 h-4" />
                      Submit Dataset
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Tips Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 glass-panel p-6 rounded-2xl border-accent/20"
          >
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-accent">💡</span>
              Tips for Ethical Data Submission
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Ensure your data is anonymized and complies with privacy regulations</li>
              <li>• Include demographic metadata to enable comprehensive bias detection</li>
              <li>• Document data collection methods and potential limitations</li>
              <li>• Review our ethical guidelines before submission</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;
