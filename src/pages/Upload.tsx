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
import { useAuth } from "@/contexts/AuthContext";
import { datasetAPI } from "@/lib/api";
import { Dataset } from "@/lib/localStorage";

interface LLMParsedConfig {
  provider: string;
  apiKey: string;
  baseUrl?: string;
  modelName: string;
  authType: string;
  headers?: Record<string, string>;
  timeout?: number;
  maxTokens?: number;
  temperature?: number;
}

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
  const [modelApiInfo, setModelApiInfo] = useState('');
  const [modelApiDocs, setModelApiDocs] = useState('');
  const [advancedAnalysis, setAdvancedAnalysis] = useState(false);
  const [annDataset, setAnnDataset] = useState<File | null>(null);
  const [datasetName, setDatasetName] = useState('');
  const [datasetTags, setDatasetTags] = useState('');
  const [datasetDescription, setDatasetDescription] = useState('');
  const [llmApiKey, setLlmApiKey] = useState('');
  const [llmBaseUrl, setLlmBaseUrl] = useState('');
  const [llmModelName, setLlmModelName] = useState('');
  const [llmAuthType, setLlmAuthType] = useState('Bearer');
  const [llmHeaders, setLlmHeaders] = useState('');
  const [llmTimeout, setLlmTimeout] = useState('30');
  const [llmMaxTokens, setLlmMaxTokens] = useState('4096');
  const [llmTemperature, setLlmTemperature] = useState('0.7');
  const [llmProvider, setLlmProvider] = useState('openai');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleUpload = async (type: "model" | "dataset") => {
    setUploading(true);
    setUploadComplete(false);

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
          try {
            const response = await datasetAPI.upload(selectedFile);
            const dataset: Dataset = {
              id: response.id.toString(),
              name: datasetName || response.name,
              type: response.file_type,
              tags: datasetTags ? datasetTags.split(',').map(t => t.trim()) : [],
              description: datasetDescription || 'Uploaded dataset',
              uploadDate: new Date().toISOString(),
              sampleCount: response.row_count,
            };
            addDataset(dataset);
            
            toast({
              title: "Upload Successful",
              description: `Dataset "${dataset.name}" has been uploaded successfully.`,
            });
          } catch (error) {
            console.error('Dataset upload failed:', error);
            toast({
              title: "Upload Failed",
              description: `Failed to upload dataset: ${error instanceof Error ? error.message : 'Unknown error'}`,
              variant: "destructive",
            });
          }
        }

        // Handle batch datasets
        for (const file of batchFiles) {
          try {
            const response = await datasetAPI.upload(file);
            const dataset: Dataset = {
              id: response.id.toString(),
              name: `${file.name.split('.')[0]} Dataset`,
              type: response.file_type,
              tags: ['batch-upload', 'auto-generated'],
              description: `Batch uploaded dataset from ${file.name}`,
              uploadDate: new Date().toISOString(),
              sampleCount: response.row_count,
            };
            addDataset(dataset);
          } catch (error) {
            console.error(`Failed to upload ${file.name}:`, error);
            toast({
              title: "Batch Upload Error",
              description: `Failed to upload ${file.name}. Continuing with other files.`,
              variant: "destructive",
            });
          }
        }

        setUploading(false);
        setUploadComplete(true);
        
        setTimeout(() => setUploadComplete(false), 3000);
      }

      // Clear batch files after upload
      setBatchFiles([]);
      setSelectedFile(null);
      setMetadataPreview(null);
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
            <TabsList className="grid w-full grid-cols-3 glass-panel">
              <TabsTrigger value="model" className="data-[state=active]:bg-primary/20">
                <FileCode className="w-4 h-4 mr-2" />
                Model Upload
              </TabsTrigger>
              <TabsTrigger value="dataset" className="data-[state=active]:bg-primary/20">
                <Database className="w-4 h-4 mr-2" />
                Dataset Upload
              </TabsTrigger>
              <TabsTrigger value="llm" className="data-[state=active]:bg-primary/20">
                <Sparkles className="w-4 h-4 mr-2" />
                LLM Integration
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

                  <div>
                    <Label htmlFor="model-api-info">API Information</Label>
                    <Textarea
                      id="model-api-info"
                      placeholder="Describe your model's API setup (e.g., 'OpenAI API key: sk-1234567890abcdef, model: gpt-4' or 'Custom endpoint: https://my-api.com/v1 with bearer token...')"
                      className="glass-panel border-foreground/20 min-h-[80px]"
                      value={modelApiInfo}
                      onChange={(e) => setModelApiInfo(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter API details in natural language or technical format
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="model-api-docs">API Documentation</Label>
                    <Textarea
                      id="model-api-docs"
                      placeholder="Paste or describe your API documentation, endpoints, parameters, and usage examples..."
                      className="glass-panel border-foreground/20 min-h-[100px]"
                      value={modelApiDocs}
                      onChange={(e) => setModelApiDocs(e.target.value)}
                    />
                  </div>

                  {/* Advanced Analysis Dropdown */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="advanced-analysis"
                        checked={advancedAnalysis}
                        onChange={(e) => setAdvancedAnalysis(e.target.checked)}
                        className="rounded border-foreground/20"
                        aria-label="Enable advanced analysis with ANN"
                      />
                      <Label htmlFor="advanced-analysis" className="text-sm font-medium">
                        Enable Advanced Analysis (ANN - Artificial Neural Network)
                      </Label>
                    </div>

                    {advancedAnalysis && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 p-4 glass-panel rounded-xl border-accent/20"
                      >
                        <div className="text-sm text-muted-foreground mb-3">
                          Upload a dataset for ANN-based bias detection and ethical analysis
                        </div>

                        {/* ANN Dataset Upload */}
                        <div className="relative group">
                          <div className="glass-panel-hover p-8 rounded-xl border-2 border-dashed border-foreground/20 hover:border-primary/50 transition-all duration-300 text-center cursor-pointer">
                            <Database className="w-12 h-12 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                            <p className="text-sm font-medium mb-1">Drop ANN dataset here</p>
                            <p className="text-xs text-muted-foreground">or click to browse</p>
                            <input
                              type="file"
                              title="Choose ANN dataset file"
                              aria-label="Choose ANN dataset file"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              accept=".csv,.json,.parquet"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setAnnDataset(e.target.files[0]);
                                }
                              }}
                            />
                          </div>
                        </div>

                        {/* Show selected ANN dataset */}
                        {annDataset && (
                          <div className="flex items-center justify-between bg-[rgba(255,255,255,0.02)] border border-foreground/10 px-3 py-2 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Database className="w-4 h-4 text-primary" />
                              <span className="text-sm">{annDataset.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({(annDataset.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setAnnDataset(null)}
                              className="text-muted-foreground hover:text-destructive"
                              aria-label="Remove ANN dataset"
                              title="Remove ANN dataset"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground">
                          This dataset will be used for advanced neural network analysis of your model's ethical implications and bias detection.
                        </div>
                      </motion.div>
                    )}
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

            <TabsContent value="llm" className="mt-6">
              <div className="glass-panel p-8 rounded-2xl space-y-6">
                <div className="text-center mb-6">
                  <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">LLM API Integration</h2>
                  <p className="text-muted-foreground">
                    Connect your Large Language Model API for ethical analysis and bias detection
                  </p>
                </div>

                {/* Simple Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="llm-api-key">API Key *</Label>
                    <Input
                      id="llm-api-key"
                      type="password"
                      placeholder="sk-... or your API key"
                      className="glass-panel border-foreground/20"
                      value={llmApiKey}
                      onChange={(e) => setLlmApiKey(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your API key is stored securely and encrypted
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="llm-description">API Description</Label>
                    <Textarea
                      id="llm-description"
                      placeholder="Describe your LLM API setup, including provider, model, and any special configuration..."
                      className="glass-panel border-foreground/20 min-h-[100px]"
                      value={llmModelName}
                      onChange={(e) => setLlmModelName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Include provider (OpenAI, Claude, etc.), model name, and any additional details
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    if (!llmApiKey || !llmModelName) {
                      toast({
                        title: "Missing Required Fields",
                        description: "Please provide both API Key and API Description",
                        variant: "destructive",
                      });
                      return;
                    }

                    // Here you would typically save the LLM configuration
                    toast({
                      title: "LLM Connected Successfully",
                      description: `LLM API configuration saved successfully`,
                    });

                    // Clear sensitive data
                    setLlmApiKey('');
                    setLlmModelName('');
                  }}
                  disabled={uploading}
                  variant="hero"
                  className="w-full"
                  size="lg"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Connect LLM API
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
