import { useState } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, FileCode, Database, Loader2, CheckCircle2, Sparkles, ArrowRight, X, FileText, Layers, Eye, Plus } from "lucide-react";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [metadataPreview, setMetadataPreview] = useState<{ size: number; type: string; lastModified: string; features?: string[] } | null>(null);
  const [analyzingMetadata, setAnalyzingMetadata] = useState(false);
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
        // Handle single file
        if (selectedFile) {
          const model = generateMockModel();
          model.name = modelName || model.name;
          model.tags = modelTags ? modelTags.split(',').map(t => t.trim()) : model.tags;
          model.description = modelDescription || model.description;
          
          addModel(model);
          const report = generateMockReport(model.id, model.name);
          addReport(report);
          incrementStat('modelsAudited');
          incrementStat('reportsGenerated');
        }

        // Handle batch files
        batchFiles.forEach((file, index) => {
          setTimeout(() => {
            const model = generateMockModel();
            model.name = `${file.name.split('.')[0]} Model`;
            model.tags = ['batch-upload', 'auto-generated'];
            model.description = `Batch uploaded model from ${file.name}`;
            
            addModel(model);
            const report = generateMockReport(model.id, model.name);
            addReport(report);
            incrementStat('modelsAudited');
            incrementStat('reportsGenerated');
          }, index * 500); // Stagger uploads
        });

        setUploading(false);
        setUploadComplete(true);
        
        toast({
          title: "Upload Successful",
          description: `Your model${batchFiles.length > 0 ? 's' : ''} have been uploaded and analyzed. Redirecting to dashboard...`,
        });

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        // Handle single dataset
        if (selectedFile) {
          const dataset = generateMockDataset();
          dataset.name = datasetName || dataset.name;
          dataset.tags = datasetTags ? datasetTags.split(',').map(t => t.trim()) : dataset.tags;
          dataset.description = datasetDescription || dataset.description;
          
          addDataset(dataset);
        }

        // Handle batch datasets
        batchFiles.forEach((file, index) => {
          setTimeout(() => {
            const dataset = generateMockDataset();
            dataset.name = `${file.name.split('.')[0]} Dataset`;
            dataset.tags = ['batch-upload', 'auto-generated'];
            dataset.description = `Batch uploaded dataset from ${file.name}`;
            
            addDataset(dataset);
          }, index * 500);
        });

        setUploading(false);
        setUploadComplete(true);
        
        toast({
          title: "Upload Successful",
          description: `Your dataset${batchFiles.length > 0 ? 's' : ''} have been uploaded and are ready for analysis.`,
        });

        setTimeout(() => setUploadComplete(false), 3000);
      }

      // Clear batch files after upload
      setBatchFiles([]);
      setSelectedFile(null);
      setMetadataPreview(null);
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

  // File handlers for displaying uploaded file name and clearing it
  const handleFileChange = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    setSelectedFile(file);
    extractMetadata(file);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setMetadataPreview(null);
  };

  // Simulate metadata extraction
  const extractMetadata = async (file: File) => {
    setAnalyzingMetadata(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockFeatures = file.name.includes('model') 
      ? ['Neural Network', 'Classification', 'Computer Vision', 'Healthcare']
      : ['Structured Data', 'Demographics', 'Medical Records', 'Anonymized'];
    
    setMetadataPreview({
      size: file.size,
      type: file.type || 'application/octet-stream',
      lastModified: new Date(file.lastModified).toLocaleDateString(),
      features: mockFeatures,
    });
    setAnalyzingMetadata(false);
  };

  // Batch file handling
  const handleBatchFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    setBatchFiles(prev => [...prev, ...fileArray]);
  };

  const removeBatchFile = (index: number) => {
    setBatchFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Direct data insertion
  const insertSampleModel = () => {
    const model = generateMockModel();
    model.name = 'Sample Healthcare Classifier';
    model.tags = ['healthcare', 'classification', 'demo'];
    model.description = 'Sample model for demonstration purposes.';
    addModel(model);
    const report = generateMockReport(model.id, model.name);
    addReport(report);
    incrementStat('modelsAudited');
    incrementStat('reportsGenerated');
    toast({
      title: "Sample Model Added",
      description: "A sample model has been added to your dashboard.",
    });
  };

  const insertSampleDataset = () => {
    const dataset = generateMockDataset();
    dataset.name = 'Sample Healthcare Dataset';
    dataset.tags = ['healthcare', 'demographics', 'demo'];
    dataset.description = 'Sample dataset for demonstration purposes.';
    addDataset(dataset);
    toast({
      title: "Sample Dataset Added",
      description: "A sample dataset has been added to your uploads.",
    });
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
                          title="Choose model file"
                          aria-label="Choose model file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".h5,.pkl,.pt,.onnx"
                          onChange={(e) => handleFileChange(e.target.files)}
                        />
                      </>
                    )}
                  </div>
                  {/* Show selected file name below the dropzone */}
                  {selectedFile && (
                    <div className="mt-4 flex items-center justify-between bg-[rgba(255,255,255,0.02)] border border-foreground/10 px-4 py-2 rounded-full max-w-md mx-auto">
                      <div className="flex items-center gap-3">
                        <FileCode className="w-4 h-4 text-primary" />
                        <div className="text-sm text-foreground max-w-[220px] truncate">{selectedFile.name}</div>
                      </div>
                      <button type="button" onClick={clearSelectedFile} className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                        <X className="w-4 h-4" />
                        <span className="sr-only">Clear selected file</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Metadata Preview */}
                {analyzingMetadata && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-4 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm">Analyzing file metadata...</span>
                    </div>
                  </motion.div>
                )}

                {metadataPreview && !analyzingMetadata && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-4 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">File Analysis</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Size:</span>
                        <span className="ml-2">{(metadataPreview.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="ml-2">{metadataPreview.type}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Modified:</span>
                        <span className="ml-2">{metadataPreview.lastModified}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Features:</span>
                        <span className="ml-2">{metadataPreview.features?.join(', ')}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Batch Upload Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Batch Upload (Optional)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('batch-model-input')?.click()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Files
                    </Button>
                    <input
                      id="batch-model-input"
                      type="file"
                      multiple
                      title="Select multiple model files"
                      aria-label="Batch model file selection"
                      className="hidden"
                      accept=".h5,.pkl,.pt,.onnx"
                      onChange={(e) => handleBatchFiles(e.target.files!)}
                    />
                  </div>

                  {batchFiles.length > 0 && (
                    <div className="space-y-2">
                      {batchFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-[rgba(255,255,255,0.02)] border border-foreground/10 px-3 py-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileCode className="w-4 h-4 text-primary" />
                            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeBatchFile(index)}
                            aria-label={`Remove ${file.name} from batch`}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Demo Buttons */}
                <div className="flex gap-3">
                  <Button 
                    onClick={loadDemoModel}
                    variant="outline" 
                    className="flex-1"
                    type="button"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Load Demo Data
                  </Button>
                  <Button 
                    onClick={insertSampleModel}
                    variant="secondary" 
                    className="flex-1"
                    type="button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Insert Sample Model
                  </Button>
                </div>

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
                  variant="default"
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
                          title="Choose dataset file"
                          aria-label="Choose dataset file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".csv,.json,.parquet"
                          onChange={(e) => handleFileChange(e.target.files)}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Show selected file name for dataset as well */}
                {selectedFile && (
                  <div className="mt-4 flex items-center justify-between bg-[rgba(255,255,255,0.02)] border border-foreground/10 px-4 py-2 rounded-full max-w-md mx-auto">
                    <div className="flex items-center gap-3">
                      <FileCode className="w-4 h-4 text-primary" />
                      <div className="text-sm text-foreground max-w-[220px] truncate">{selectedFile.name}</div>
                    </div>
                    <button type="button" onClick={clearSelectedFile} className="text-muted-foreground hover:text-foreground flex items-center gap-2">
                      <X className="w-4 h-4" />
                      <span className="sr-only">Clear selected file</span>
                    </button>
                  </div>
                )}

                {/* Metadata Preview for Dataset */}
                {analyzingMetadata && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-4 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm">Analyzing dataset metadata...</span>
                    </div>
                  </motion.div>
                )}

                {metadataPreview && !analyzingMetadata && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-4 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Dataset Analysis</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Size:</span>
                        <span className="ml-2">{(metadataPreview.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="ml-2">{metadataPreview.type}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Modified:</span>
                        <span className="ml-2">{metadataPreview.lastModified}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Features:</span>
                        <span className="ml-2">{metadataPreview.features?.join(', ')}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Batch Upload Section for Dataset */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Batch Upload (Optional)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('batch-dataset-input')?.click()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Files
                    </Button>
                    <input
                      id="batch-dataset-input"
                      type="file"
                      multiple
                      title="Select multiple dataset files"
                      aria-label="Batch dataset file selection"
                      className="hidden"
                      accept=".csv,.json,.parquet"
                      onChange={(e) => handleBatchFiles(e.target.files!)}
                    />
                  </div>

                  {batchFiles.length > 0 && (
                    <div className="space-y-2">
                      {batchFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-[rgba(255,255,255,0.02)] border border-foreground/10 px-3 py-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-primary" />
                            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeBatchFile(index)}
                            aria-label={`Remove ${file.name} from batch`}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Demo Buttons for Dataset */}
                <div className="flex gap-3">
                  <Button 
                    onClick={loadDemoDataset}
                    variant="outline" 
                    className="flex-1"
                    type="button"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Load Demo Data
                  </Button>
                  <Button 
                    onClick={insertSampleDataset}
                    variant="secondary" 
                    className="flex-1"
                    type="button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Insert Sample Dataset
                  </Button>
                </div>

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
                  variant="default"
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
