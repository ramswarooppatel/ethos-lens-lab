import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { datasetAPI } from '@/lib/api';
import { Upload, FileText, Target, Search, BarChart3, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface DatasetResponse {
  id: number;
  name: string;
  file_type: string;
  file_path: string;
  row_count: number | null;
  target_column: string | null;
  sensitive_columns: string[] | null;
  columns: Array<{
    column_name: string;
    column_type: string;
    null_count: number | null;
    unique_count: number | null;
    example_value: string | number | null;
  }>;
  status: string;
}

interface DatasetEvaluationResponse {
  dataset_id: number;
  dataset_name: string;
  total_rows: number;
  columns: Array<{
    name: string;
    column_type: string;
    missing_count: number;
    missing_percentage: number;
    unique_count: number;
    stats: Record<string, unknown>;
    example_value: unknown;
    top_values: Record<string, number> | null;
    created_at: string | null;
    updated_at: string | null;
    is_target: boolean;
    is_sensitive: boolean;
  }>;
  tests: Array<{
    test_name: string;
    status: string;
    details: Record<string, unknown> | null;
    suggestion: string | null;
  }>;
}

interface ReportData {
  report_metadata: {
    dataset_id: number;
    dataset_name: string;
    generated_at: string;
    report_version: string;
  };
  dataset_summary: {
    id: number;
    name: string;
    file_type: string;
    row_count: number;
    column_count: number;
    target_column: string | null;
    sensitive_columns: string[];
    status: string;
    created_at: string;
  };
  column_analysis: {
    total_columns: number;
    target_column: {
      name: string;
      type: string;
      missing_count: number;
      missing_percentage: number;
      unique_count: number;
      is_target: boolean;
      is_sensitive: boolean;
      reason: string | null;
      stats: Record<string, unknown>;
    } | null;
    sensitive_columns: Array<{
      name: string;
      type: string;
      missing_count: number;
      missing_percentage: number;
      unique_count: number;
      is_target: boolean;
      is_sensitive: boolean;
      reason: string | null;
      stats: Record<string, unknown>;
    }>;
    all_columns: Array<{
      name: string;
      type: string;
      missing_count: number;
      missing_percentage: number;
      unique_count: number;
      is_target: boolean;
      is_sensitive: boolean;
      reason: string | null;
      stats: Record<string, unknown>;
    }>;
  };
  quick_bias_metrics: Record<string, unknown>;
  ai_generated_report: {
    executive_summary: string;
    data_quality_assessment: {
      overall_quality: string;
      key_issues: string[];
      recommendations: string[];
    };
    bias_analysis: {
      overall_bias_risk: string;
      sensitive_features_analysis: string;
      disparate_impact_assessment: string;
      key_concerns: string[];
      fairness_recommendations: string[];
    };
    target_column_analysis: {
      distribution: string;
      predictability_assessment: string;
      potential_issues: string[];
    };
    ethical_considerations: {
      privacy_concerns: string[];
      discrimination_risks: string[];
      transparency_recommendations: string[];
    };
    actionable_insights: string[];
    overall_recommendation: string;
  };
  evaluation_history: unknown;
}

const DatasetAnalysis: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Step 1: File Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResponse, setUploadResponse] = useState<DatasetResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2: Evaluation
  const [evaluationData, setEvaluationData] = useState<DatasetEvaluationResponse | null>(null);

  // Step 3: Target Prediction
  const [userInput, setUserInput] = useState('');
  const [predictedTarget, setPredictedTarget] = useState<string | null>(null);

  // Step 4: Find Potential Columns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [potentialColumns, setPotentialColumns] = useState<any>(null);

  // Step 5: Generate Report
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const steps = [
    { title: 'Upload Dataset', icon: Upload, description: 'Upload your CSV/XLSX file' },
    { title: 'Evaluate Dataset', icon: FileText, description: 'Analyze data quality and statistics' },
    { title: 'Predict Target', icon: Target, description: 'AI predicts target column' },
    { title: 'Find Features', icon: Search, description: 'Identify relevant features' },
    { title: 'Generate Report', icon: BarChart3, description: 'Create comprehensive analysis' },
  ];

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await datasetAPI.upload(selectedFile);
      setUploadResponse(response);
      setSuccess(`File uploaded successfully! Dataset ID: ${response.id}`);
      console.log('Upload Response:', response);
      setCurrentStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluation = async () => {
    if (!uploadResponse) return;

    setIsLoading(true);
    setError(null);

    try {
      const evaluation = await datasetAPI.getEvaluation(uploadResponse.id);
      setEvaluationData(evaluation);

      // Store in localStorage as requested
      localStorage.setItem(`evaluation_${uploadResponse.id}`, JSON.stringify(evaluation));

      setSuccess('Dataset evaluation completed and stored in localStorage');
      console.log('Evaluation Response:', evaluation);
      setCurrentStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Evaluation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTargetPrediction = async () => {
    if (!uploadResponse || !userInput.trim()) {
      setError('Please provide input for target column prediction');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const prediction = await datasetAPI.predictTargetColumn(uploadResponse.id, userInput);
      setPredictedTarget(prediction);
      setSuccess(`Target column predicted: ${prediction}`);
      console.log('Predicted Target:', prediction);
      setCurrentStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Target prediction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindPotentialColumns = async () => {
    if (!uploadResponse || !evaluationData || !predictedTarget) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await datasetAPI.findPotentialColumns(
        uploadResponse.id,
        predictedTarget,
        evaluationData
      );
      setPotentialColumns(result);
      setSuccess('Potential columns analysis completed');
      console.log('Potential Columns:', result);
      setCurrentStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Finding potential columns failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!uploadResponse) return;

    setIsLoading(true);
    setError(null);

    try {
      const report = await datasetAPI.generateReport(uploadResponse.id);
      setReportData(report);
      setSuccess('Comprehensive report generated successfully');
      console.log('Generated Report:', report);
      setCurrentStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Report generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <Progress value={(currentStep / (steps.length - 1)) * 100} className="w-full" />
    </div>
  );

  const renderUploadStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Step 1: Upload Dataset
        </CardTitle>
        <CardDescription>
          Upload a CSV, XLSX, JSON, or Parquet file for analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="file-upload">Select File</Label>
          <Input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            accept=".csv,.xlsx,.xls,.json,.parquet,.zip"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>

        {selectedFile && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Selected:</strong> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </p>
          </div>
        )}

        <Button
          onClick={handleFileUpload}
          disabled={!selectedFile || isLoading}
          className="w-full"
        >
          {isLoading ? 'Uploading...' : 'Upload Dataset'}
        </Button>

        {uploadResponse && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Upload Response:</h3>
            <pre className="text-xs text-green-700 whitespace-pre-wrap">
              {JSON.stringify(uploadResponse, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderEvaluationStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Step 2: Evaluate Dataset
        </CardTitle>
        <CardDescription>
          Analyze data quality, statistics, and potential issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleEvaluation}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Evaluating...' : 'Run Evaluation'}
        </Button>

        {evaluationData && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Evaluation Results:</h3>
            <div className="text-sm text-blue-700">
              <p><strong>Dataset:</strong> {evaluationData.dataset_name}</p>
              <p><strong>Total Rows:</strong> {evaluationData.total_rows}</p>
              <p><strong>Columns:</strong> {evaluationData.columns.length}</p>
              <p><strong>Tests Run:</strong> {evaluationData.tests.length}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderTargetPredictionStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Step 3: Predict Target Column
        </CardTitle>
        <CardDescription>
          Describe what you want to predict from your dataset
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="target-input">Target Column Description</Label>
          <Textarea
            id="target-input"
            placeholder="e.g., 'Predict whether a tsunami will occur based on earthquake data'"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>

        <Button
          onClick={handleTargetPrediction}
          disabled={!userInput.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? 'Predicting...' : 'Predict Target Column'}
        </Button>

        {predictedTarget && (
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">Predicted Target Column:</h3>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {predictedTarget}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderPotentialColumnsStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Step 4: Find Potential Columns
        </CardTitle>
        <CardDescription>
          Identify relevant features and sensitive columns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleFindPotentialColumns}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Analyzing...' : 'Find Potential Columns'}
        </Button>

        {potentialColumns && (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">Selected Features:</h3>
              <div className="flex flex-wrap gap-2">
                {potentialColumns.selected_features?.map((feature: string) => (
                  <Badge key={feature} variant="default">{feature}</Badge>
                ))}
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Excluded Features:</h3>
              <div className="flex flex-wrap gap-2">
                {potentialColumns.excluded_features?.map((feature: string) => (
                  <Badge key={feature} variant="destructive">{feature}</Badge>
                ))}
              </div>
              <p className="text-sm text-red-600 mt-2">
                <strong>Reason:</strong> {potentialColumns.exclusion_reasons}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderReportStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Step 5: Generate Comprehensive Report
        </CardTitle>
        <CardDescription>
          Create detailed bias and fairness analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGenerateReport}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Generating Report...' : 'Generate Report'}
        </Button>

        {reportData && (
          <div className="mt-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="bias">Bias & Ethics</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{reportData.ai_generated_report.executive_summary}</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Dataset Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{reportData.dataset_summary.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rows:</span>
                        <span className="font-medium">{reportData.dataset_summary.row_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Columns:</span>
                        <span className="font-medium">{reportData.dataset_summary.column_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Target:</span>
                        <Badge variant="secondary">{reportData.dataset_summary.target_column || 'Not set'}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quality Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-600">Overall Quality:</span>
                        <Badge
                          variant={
                            reportData.ai_generated_report.data_quality_assessment.overall_quality === 'excellent' ? 'default' :
                            reportData.ai_generated_report.data_quality_assessment.overall_quality === 'good' ? 'secondary' : 'destructive'
                          }
                        >
                          {reportData.ai_generated_report.data_quality_assessment.overall_quality}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><strong>Issues:</strong> {reportData.ai_generated_report.data_quality_assessment.key_issues.join(', ') || 'None identified'}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Column Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportData.column_analysis.target_column && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">Target Column</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Name:</span>
                              <Badge className="ml-2">{reportData.column_analysis.target_column.name}</Badge>
                            </div>
                            <div>
                              <span className="text-gray-600">Type:</span>
                              <span className="ml-2 font-medium">{reportData.column_analysis.target_column.type}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Missing:</span>
                              <span className="ml-2 font-medium">{reportData.column_analysis.target_column.missing_percentage.toFixed(1)}%</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Unique:</span>
                              <span className="ml-2 font-medium">{reportData.column_analysis.target_column.unique_count}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <h4 className="font-semibold text-orange-800 mb-2">Sensitive Columns ({reportData.column_analysis.sensitive_columns.length})</h4>
                        <div className="flex flex-wrap gap-2">
                          {reportData.column_analysis.sensitive_columns.map((col) => (
                            <Badge key={col.name} variant="destructive" className="text-xs">
                              {col.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bias" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      Bias Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Overall Bias Risk:</span>
                      <Badge
                        variant={
                          reportData.ai_generated_report.bias_analysis.overall_bias_risk === 'low' ? 'default' :
                          reportData.ai_generated_report.bias_analysis.overall_bias_risk === 'medium' ? 'secondary' : 'destructive'
                        }
                      >
                        {reportData.ai_generated_report.bias_analysis.overall_bias_risk}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Key Concerns</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {reportData.ai_generated_report.bias_analysis.key_concerns.map((concern, index) => (
                          <li key={index}>{concern}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Fairness Recommendations</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {reportData.ai_generated_report.bias_analysis.fairness_recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ethical Considerations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-red-700">Privacy Concerns</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {reportData.ai_generated_report.ethical_considerations.privacy_concerns.map((concern, index) => (
                          <li key={index}>{concern}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-red-700">Discrimination Risks</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {reportData.ai_generated_report.ethical_considerations.discrimination_risks.map((risk, index) => (
                          <li key={index}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Actionable Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                      {reportData.ai_generated_report.actionable_insights.map((insight, index) => (
                        <li key={index}>{insight}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Overall Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          reportData.ai_generated_report.overall_recommendation.includes('approve') ? 'default' :
                          reportData.ai_generated_report.overall_recommendation.includes('caution') ? 'secondary' : 'destructive'
                        }
                        className="text-lg px-4 py-2"
                      >
                        {reportData.ai_generated_report.overall_recommendation}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dataset Analysis Workflow</h1>
        <p className="text-gray-600">
          Complete end-to-end analysis of your dataset for bias detection and fairness assessment
        </p>
      </div>

      {renderStepIndicator()}

      {error && (
        <Alert className="mb-6">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {currentStep === 0 && renderUploadStep()}
        {currentStep === 1 && renderEvaluationStep()}
        {currentStep === 2 && renderTargetPredictionStep()}
        {currentStep === 3 && renderPotentialColumnsStep()}
        {currentStep === 4 && renderReportStep()}
        {currentStep === 5 && renderReportStep()}
      </div>

      {currentStep > 0 && currentStep < 5 && (
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            disabled={currentStep === 4 && !reportData}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default DatasetAnalysis;