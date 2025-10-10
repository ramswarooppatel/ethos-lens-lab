import { Model, Dataset, AuditReport, CommunityPost } from './localStorage';

export const generateMockModel = (): Model => ({
  id: `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: 'ResNet-50 Healthcare Classifier',
  type: 'classification',
  tags: ['computer-vision', 'healthcare', 'diagnostic'],
  description: 'Deep learning model for medical image classification trained on diverse patient demographics. Designed to assist radiologists in detecting early signs of diseases.',
  uploadDate: new Date().toISOString(),
  fairnessScore: 73,
  status: 'complete',
});

export const generateMockDataset = (): Dataset => ({
  id: `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: 'Healthcare Patient Records 2024',
  type: 'healthcare',
  tags: ['demographics', 'medical', 'structured'],
  description: 'Anonymized patient records with demographic information including age, gender, location, and medical history. Collected from 250+ hospitals across diverse regions.',
  uploadDate: new Date().toISOString(),
  sampleCount: 156000,
});

export const generateMockReport = (modelId: string, modelName: string): AuditReport => ({
  id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  modelId,
  modelName,
  generatedDate: new Date().toISOString(),
  fairnessScore: 73,
  demographicParity: 82,
  equalOpportunity: 68,
  predictiveEquality: 91,
  biasMetrics: [
    { category: 'Gender', bias: 15, trend: 'down' },
    { category: 'Age', bias: 23, trend: 'up' },
    { category: 'Race', bias: 12, trend: 'down' },
    { category: 'Location', bias: 8, trend: 'down' },
  ],
  recommendations: [
    'Consider rebalancing training data for age groups 18-25 and 65+',
    'Apply fairness constraints during model optimization',
    'Run intersectional bias tests for gender × age combinations',
    'Monitor model performance across different geographic regions',
  ],
});

export const generateMockPost = (): CommunityPost => {
  const authors = [
    { name: 'Dr. Emily Watson', role: 'Verified Expert', badge: 'expert' as const, trust: 96 },
    { name: 'Marcus Thompson', role: 'Research Contributor', badge: 'contributor' as const, trust: 88 },
    { name: 'Priya Sharma', role: 'Citizen Reviewer', badge: 'citizen' as const, trust: 79 },
    { name: 'Carlos Rodriguez', role: 'Research Contributor', badge: 'contributor' as const, trust: 84 },
  ];

  const titles = [
    'Critical Bias Detected in Facial Recognition Model',
    'Healthcare AI Shows Age-Based Discrimination',
    'Hiring Algorithm Exhibits Gender Bias Patterns',
    'Credit Scoring Model: Regional Fairness Analysis',
    'NLP Model Amplifies Racial Stereotypes',
  ];

  const summaries = [
    'Comprehensive analysis reveals systematic bias in model predictions across multiple protected categories. Detailed statistical evidence included.',
    'Investigation shows significant performance disparities between demographic groups. Counterfactual examples demonstrate clear bias patterns.',
    'Model exhibits concerning trends in decision-making that disproportionately affect certain populations. Requires immediate attention.',
    'Audit results indicate potential fairness violations. Community review requested for validation and additional insights.',
  ];

  const author = authors[Math.floor(Math.random() * authors.length)];

  return {
    id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    author: author.name,
    role: author.role,
    trustScore: author.trust,
    title: titles[Math.floor(Math.random() * titles.length)],
    summary: summaries[Math.floor(Math.random() * summaries.length)],
    upvotes: Math.floor(Math.random() * 200) + 50,
    downvotes: Math.floor(Math.random() * 20) + 2,
    comments: Math.floor(Math.random() * 50) + 10,
    badge: author.badge,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
};

export const generateInitialMockData = () => {
  const models = Array.from({ length: 3 }, generateMockModel);
  const datasets = Array.from({ length: 2 }, generateMockDataset);
  const reports = models.map(m => generateMockReport(m.id, m.name));
  const posts = Array.from({ length: 5 }, generateMockPost);

  return { models, datasets, reports, posts };
};
