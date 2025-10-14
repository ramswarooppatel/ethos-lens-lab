// Local Storage Service for EthosLens
export interface Model {
  id: string;
  name: string;
  type: string;
  tags: string[];
  description: string;
  uploadDate: string;
  fairnessScore: number;
  status: 'analyzing' | 'complete' | 'flagged';
}

export interface Dataset {
  id: string;
  name: string;
  type: string;
  tags: string[];
  description: string;
  uploadDate: string;
  sampleCount: number;
}

export interface AuditReport {
  id: string;
  modelId: string;
  modelName: string;
  generatedDate: string;
  fairnessScore: number;
  demographicParity: number;
  equalOpportunity: number;
  predictiveEquality: number;
  biasMetrics: {
    category: string;
    bias: number;
    trend: 'up' | 'down';
  }[];
  recommendations: string[];
}

export interface CommunityPost {
  id: string;
  author: string;
  role: string;
  trustScore: number;
  title: string;
  summary: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  badge: 'expert' | 'contributor' | 'citizen';
  timestamp: string;
}

export interface UserProfile {
  name: string;
  role: string;
  trustScore: number;
  badges: string[];
  stats: {
    modelsAudited: number;
    communityPosts: number;
    reportsGenerated: number;
    upvotesReceived: number;
  };
  xp: number;
}

const STORAGE_KEYS = {
  MODELS: 'ethoslens_models',
  DATASETS: 'ethoslens_datasets',
  REPORTS: 'ethoslens_reports',
  POSTS: 'ethoslens_posts',
  PROFILE: 'ethoslens_profile',
};

// Generic storage functions
export const getItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage:`, error);
    return null;
  }
};

export const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage:`, error);
  }
};

// Models
export const getModels = (): Model[] => {
  return getItem<Model[]>(STORAGE_KEYS.MODELS) || [];
};

export const addModel = (model: Model): void => {
  const models = getModels();
  setItem(STORAGE_KEYS.MODELS, [...models, model]);
};

export const getModelById = (id: string): Model | undefined => {
  const models = getModels();
  return models.find(m => m.id === id);
};

// Datasets
export const getDatasets = (): Dataset[] => {
  return getItem<Dataset[]>(STORAGE_KEYS.DATASETS) || [];
};

export const addDataset = (dataset: Dataset): void => {
  const datasets = getDatasets();
  setItem(STORAGE_KEYS.DATASETS, [...datasets, dataset]);
};

// Reports
export const getReports = (): AuditReport[] => {
  return getItem<AuditReport[]>(STORAGE_KEYS.REPORTS) || [];
};

export const addReport = (report: AuditReport): void => {
  const reports = getReports();
  setItem(STORAGE_KEYS.REPORTS, [...reports, report]);
};

export const getReportByModelId = (modelId: string): AuditReport | undefined => {
  const reports = getReports();
  return reports.find(r => r.modelId === modelId);
};

// Community Posts
export const getPosts = (): CommunityPost[] => {
  return getItem<CommunityPost[]>(STORAGE_KEYS.POSTS) || [];
};

export const addPost = (post: CommunityPost): void => {
  const posts = getPosts();
  setItem(STORAGE_KEYS.POSTS, [post, ...posts]);
};

export const votePost = (postId: string, type: 'up' | 'down'): void => {
  const posts = getPosts();
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      return {
        ...post,
        upvotes: type === 'up' ? post.upvotes + 1 : post.upvotes,
        downvotes: type === 'down' ? post.downvotes + 1 : post.downvotes,
      };
    }
    return post;
  });
  setItem(STORAGE_KEYS.POSTS, updatedPosts);
};

// User Profile
export const getProfile = (): UserProfile => {
  return getItem<UserProfile>(STORAGE_KEYS.PROFILE) || {
    name: 'Sarah Chen',
    role: 'Verified Expert',
    trustScore: 95,
    badges: ['expert', 'contributor'],
    stats: {
      modelsAudited: 23,
      communityPosts: 15,
      reportsGenerated: 31,
      upvotesReceived: 342,
    },
    xp: 2847,
  };
};

export const updateProfile = (profile: Partial<UserProfile>): void => {
  const current = getProfile();
  setItem(STORAGE_KEYS.PROFILE, { ...current, ...profile });
};

export const incrementStat = (stat: keyof UserProfile['stats'], amount: number = 1): void => {
  const profile = getProfile();
  profile.stats[stat] += amount;
  profile.xp += amount * 10;
  setItem(STORAGE_KEYS.PROFILE, profile);
};

// Get aggregated stats for dashboard
export const getStats = () => {
  const models = getModels();
  const datasets = getDatasets();
  const reports = getReports();
  const posts = getPosts();
  const profile = getProfile();

  return {
    modelsAudited: models.length,
    datasetsUploaded: datasets.length,
    reportsGenerated: reports.length,
    communityPosts: posts.length,
    totalUpvotes: posts.reduce((sum, post) => sum + post.upvotes, 0),
    averageFairnessScore: models.length > 0 ? models.reduce((sum, model) => sum + model.fairnessScore, 0) / models.length : 0,
    userStats: profile.stats,
  };
};

// Clear all data (for demo purposes)
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
};

// Insert demo data for simulation
export const insertDemoData = (): void => {
  // Clear existing data
  clearAllData();

  // Add demo models
  const demoModels: Model[] = [
    {
      id: 'demo-model-1',
      name: 'Healthcare Classifier v2.1',
      type: 'classification',
      tags: ['healthcare', 'diagnostic', 'computer-vision'],
      description: 'Advanced medical image classification model trained on diverse patient demographics.',
      uploadDate: new Date().toISOString(),
      fairnessScore: 87,
      status: 'complete',
    },
    {
      id: 'demo-model-2',
      name: 'Credit Risk Predictor',
      type: 'regression',
      tags: ['finance', 'risk-assessment', 'fairness'],
      description: 'Machine learning model for credit scoring with bias mitigation techniques.',
      uploadDate: new Date().toISOString(),
      fairnessScore: 92,
      status: 'complete',
    },
  ];

  demoModels.forEach(model => addModel(model));

  // Add demo datasets
  const demoDatasets: Dataset[] = [
    {
      id: 'demo-dataset-1',
      name: 'Healthcare Patient Records 2024',
      type: 'structured',
      tags: ['healthcare', 'demographics', 'anonymized'],
      description: 'Comprehensive patient records with demographic information for bias analysis.',
      uploadDate: new Date().toISOString(),
      sampleCount: 50000,
    },
    {
      id: 'demo-dataset-2',
      name: 'Financial Transaction Data',
      type: 'time-series',
      tags: ['finance', 'transactions', 'behavioral'],
      description: 'Historical financial transaction data for fraud detection model training.',
      uploadDate: new Date().toISOString(),
      sampleCount: 100000,
    },
  ];

  demoDatasets.forEach(dataset => addDataset(dataset));

  // Add demo reports
  const demoReports: AuditReport[] = [
    {
      id: 'demo-report-1',
      modelId: 'demo-model-1',
      modelName: 'Healthcare Classifier v2.1',
      generatedDate: new Date().toISOString(),
      fairnessScore: 87,
      demographicParity: 0.85,
      equalOpportunity: 0.82,
      predictiveEquality: 0.88,
      biasMetrics: [
        { category: 'Gender', bias: 0.12, trend: 'down' },
        { category: 'Age', bias: 0.08, trend: 'down' },
        { category: 'Ethnicity', bias: 0.15, trend: 'up' },
      ],
      recommendations: [
        'Consider additional training data for underrepresented ethnic groups',
        'Implement fairness constraints during model training',
        'Regular bias monitoring and retraining schedule',
      ],
    },
  ];

  demoReports.forEach(report => addReport(report));

  // Add demo posts
  const demoPosts: CommunityPost[] = [
    {
      id: 'demo-post-1',
      author: 'Dr. Maria Rodriguez',
      role: 'AI Ethics Researcher',
      trustScore: 98,
      title: 'Bias in Healthcare AI: A Critical Analysis',
      summary: 'Recent studies show healthcare AI models exhibit significant bias against minority groups. We need standardized fairness metrics.',
      upvotes: 45,
      downvotes: 2,
      comments: 12,
      badge: 'expert',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'demo-post-2',
      author: 'Alex Thompson',
      role: 'Machine Learning Engineer',
      trustScore: 87,
      title: 'Implementing Fairness Constraints in PyTorch',
      summary: 'Sharing practical techniques for adding fairness constraints to deep learning models during training.',
      upvotes: 32,
      downvotes: 1,
      comments: 8,
      badge: 'contributor',
      timestamp: new Date().toISOString(),
    },
  ];

  demoPosts.forEach(post => addPost(post));

  // Update profile stats
  const profile = getProfile();
  profile.stats.modelsAudited = demoModels.length;
  profile.stats.reportsGenerated = demoReports.length;
  profile.stats.communityPosts = demoPosts.length;
  setItem(STORAGE_KEYS.PROFILE, profile);
};
