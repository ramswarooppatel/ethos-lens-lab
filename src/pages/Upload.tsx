import { useState } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, FileCode, Database, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const { toast } = useToast();

  const handleUpload = (type: "model" | "dataset") => {
    setUploading(true);
    setUploadComplete(false);

    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      setUploadComplete(true);
      toast({
        title: "Upload Successful",
        description: `Your ${type} has been uploaded and is being analyzed.`,
      });

      setTimeout(() => setUploadComplete(false), 3000);
    }, 2000);
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

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="model-name">Model Name</Label>
                    <Input
                      id="model-name"
                      placeholder="e.g., ResNet-50 Classifier"
                      className="glass-panel border-foreground/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="model-tags">Tags</Label>
                    <Input
                      id="model-tags"
                      placeholder="e.g., computer-vision, classification"
                      className="glass-panel border-foreground/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="model-description">Description</Label>
                    <Textarea
                      id="model-description"
                      placeholder="Describe your model's purpose and training data..."
                      className="glass-panel border-foreground/20 min-h-[120px]"
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
                      <UploadIcon className="w-4 h-4" />
                      Submit Model
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

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dataset-name">Dataset Name</Label>
                    <Input
                      id="dataset-name"
                      placeholder="e.g., Healthcare Patient Records"
                      className="glass-panel border-foreground/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dataset-tags">Tags</Label>
                    <Input
                      id="dataset-tags"
                      placeholder="e.g., healthcare, demographics"
                      className="glass-panel border-foreground/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dataset-description">Description</Label>
                    <Textarea
                      id="dataset-description"
                      placeholder="Describe your dataset's features and collection methodology..."
                      className="glass-panel border-foreground/20 min-h-[120px]"
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
