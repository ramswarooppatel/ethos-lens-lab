import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, FileCode, Database, Sparkles } from 'lucide-react';

interface ModelEvaluationProps {
  formData: {
    mode: 'api' | 'pkl';
    apiInfo?: string | null;
    pklFile?: File | null;
    trainingDataset: File;
    testingDataset: File;
    prompt: string;
  };
  onBack?: () => void;  // Optional callback to go back to form
}

const ModelEvaluation: React.FC<ModelEvaluationProps> = ({ formData, onBack }) => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState<any>(null);

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    // Simulate evaluation process (replace with actual API call or logic)
    await new Promise(resolve => setTimeout(resolve, 3000));
    // Mock results based on form data
    const mockResults = {
      accuracy: 0.85,
      precision: 0.82,
      recall: 0.88,
      f1Score: 0.85,
      insights: [
        "Model performs well on balanced datasets.",
        "Consider addressing class imbalance in training data.",
        "Prompt indicates a classification task; ensure labels are properly encoded."
      ],
      status: "Completed"
    };
    setEvaluationResults(mockResults);
    setIsEvaluating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Form
          </Button>
        )}
        <h2 className="text-2xl font-bold">Model Evaluation</h2>
      </div>

      {/* Input Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {formData.mode === 'api' ? <Sparkles className="w-5 h-5" /> : <FileCode className="w-5 h-5" />}
            Evaluation Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Badge variant="secondary">{formData.mode === 'api' ? 'API-Based' : 'PKL-Based'}</Badge>
          </div>
          {formData.mode === 'api' && formData.apiInfo && (
            <div>
              <strong>API Info:</strong> {formData.apiInfo}
            </div>
          )}
          {formData.mode === 'pkl' && formData.pklFile && (
            <div>
              <strong>PKL File:</strong> {formData.pklFile.name}
            </div>
          )}
          <div>
            <strong>Training Dataset:</strong> {formData.trainingDataset.name}
          </div>
          <div>
            <strong>Testing Dataset:</strong> {formData.testingDataset.name}
          </div>
          <div>
            <strong>Prompt:</strong> {formData.prompt}
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Button */}
      {!evaluationResults && (
        <Button
          onClick={handleEvaluate}
          disabled={isEvaluating}
          className="w-full"
          size="lg"
        >
          <Play className="w-4 h-4 mr-2" />
          {isEvaluating ? 'Evaluating...' : 'Run Evaluation'}
        </Button>
      )}

      {/* Evaluation Results */}
      {evaluationResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Evaluation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Accuracy:</strong> {(evaluationResults.accuracy * 100).toFixed(2)}%
              </div>
              <div>
                <strong>Precision:</strong> {(evaluationResults.precision * 100).toFixed(2)}%
              </div>
              <div>
                <strong>Recall:</strong> {(evaluationResults.recall * 100).toFixed(2)}%
              </div>
              <div>
                <strong>F1 Score:</strong> {(evaluationResults.f1Score * 100).toFixed(2)}%
              </div>
            </div>
            <div>
              <strong>Insights:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {evaluationResults.insights.map((insight: string, index: number) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
            <Badge variant="default">{evaluationResults.status}</Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModelEvaluation;