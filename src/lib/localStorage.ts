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

// Clear all data (for demo purposes)
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
};
