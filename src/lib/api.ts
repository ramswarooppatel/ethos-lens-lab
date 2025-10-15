const API_BASE = "http://127.0.0.1:8000";

interface AuthToken {
  access_token: string;
  token_type: string;
}

interface AuthToken {
  access_token: string;
  token_type: string;
}

interface ColumnSchema {
  column_name: string;
  column_type: string;
  null_count: number | null;
  unique_count: number | null;
  example_value: string | number | null;
}

interface DatasetResponse {
  id: number;
  name: string;
  file_type: string;
  file_path: string;
  row_count: number | null;
  target_column: string | null;
  sensitive_columns: string[] | null;
  columns: ColumnSchema[];
  status: string;
}

interface ColumnSuggestion {
  target_column: string | null;
  sensitive_columns: string[];
}

interface ConfirmColumnsRequest {
  target_column: string;
  sensitive_columns: string[];
}

interface ColumnResponse {
  name: string;
  column_type: string;
  missing_count: number;
  missing_percentage: number;
  unique_count: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stats: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  example_value: any;
  top_values: Record<string, number> | null;
  created_at: string | null;
  updated_at: string | null;
  is_target: boolean;
  is_sensitive: boolean;
}

interface TestResult {
  test_name: string;
  status: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: Record<string, any> | null;
  suggestion: string | null;
}

interface DatasetEvaluationResponse {
  dataset_id: number;
  dataset_name: string;
  total_rows: number;
  columns: ColumnResponse[];
  tests: TestResult[];
}

interface ResponsePost {
  id: number;
  user_id: number | null;
  title: string;
  content: string;
  created_at: string;
  updated_at: string | null;
  upvotes: number;
  downvotes: number;
}

interface PostUpdate {
  title?: string;
  content?: string;
}

// Auth APIs
export const authAPI = {
  register: async (data: { username: string; email: string; password: string }) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  login: async (data: { email: string; password: string }): Promise<AuthToken> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Dataset APIs
export const datasetAPI = {
  // Test API connection
  testConnection: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/`);
      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  },

  upload: async (file: File, token?: string): Promise<DatasetResponse> => {
    console.log(`Uploading file ${file.name} to ${API_BASE}/datasets/upload`);
    const formData = new FormData();
    formData.append("file", file);

    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/datasets/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Upload successful:', result);
    return result;
  },

  suggestColumns: async (datasetId: number, token?: string): Promise<ColumnSuggestion> => {
    console.log(`Suggesting columns for dataset ${datasetId}`);
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/datasets/${datasetId}/suggest_columns`, {
      method: "POST",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Suggest columns failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Suggest columns result:', result);
    return result;
  },

  updateColumns: async (
    datasetId: number,
    data: ConfirmColumnsRequest,
    token?: string
  ): Promise<DatasetResponse> => {
    console.log(`Updating columns for dataset ${datasetId}:`, data);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/datasets/${datasetId}/update_columns`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Update columns failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Update columns result:', result);
    return result;
  },

  confirm: async (
    datasetId: number,
    data?: ConfirmColumnsRequest,
    token?: string
  ): Promise<DatasetResponse> => {
    console.log(`Confirming dataset ${datasetId}:`, data);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/datasets/${datasetId}/confirm`, {
      method: "PUT",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Confirm failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Confirm result:', result);
    return result;
  },

  getEvaluation: async (datasetId: number, token?: string): Promise<DatasetEvaluationResponse> => {
    console.log(`Getting evaluation for dataset ${datasetId}`);
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/datasets/${datasetId}/evaluation`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Get evaluation failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Evaluation result:', result);
    return result;
  },

  predictTargetColumn: async (datasetId: number, userInput: string, token?: string): Promise<string> => {
    console.log(`Predicting target column for dataset ${datasetId} with input: ${userInput}`);
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/datasets/${datasetId}/predict_target_column?user_input=${encodeURIComponent(userInput)}`, {
      method: "POST",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Predict target column failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.text();
    console.log('Predict target column result:', result);
    return result;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findPotentialColumns: async (datasetId: number, targetColumn: string, datasetAnalysis: any, token?: string): Promise<any> => {
    console.log(`Finding potential columns for dataset ${datasetId}`);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/datasets/${datasetId}/find_potential_columns?target_column=${encodeURIComponent(targetColumn)}`, {
      method: "POST",
      headers,
      body: JSON.stringify(datasetAnalysis),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Find potential columns failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Find potential columns result:', result);
    return result;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateReport: async (datasetId: number, token?: string): Promise<any> => {
    console.log(`Generating report for dataset ${datasetId}`);
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/datasets/${datasetId}/generate_report`, {
      method: "POST",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Generate report failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Generate report result:', result);
    return result;
  },
};

// Posts APIs
export const postsAPI = {
  getAllPosts: async (token?: string): Promise<ResponsePost[]> => {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/posts`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    return response.json();
  },

  getPost: async (postId: number, token?: string): Promise<ResponsePost> => {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/posts/${postId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    return response.json();
  },

  createPost: async (data: { title: string; content: string }, token?: string): Promise<ResponsePost> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/posts`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create post: ${response.statusText}`);
    }

    return response.json();
  },

  updatePost: async (postId: number, data: PostUpdate, token?: string): Promise<ResponsePost> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/posts/${postId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update post: ${response.statusText}`);
    }

    return response.json();
  },

  deletePost: async (postId: number, token?: string): Promise<void> => {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/posts/${postId}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete post: ${response.statusText}`);
    }
  },

  upvotePost: async (postId: number, token?: string) => {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/posts/${postId}/upvote`, {
      method: "POST",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to upvote post: ${response.statusText}`);
    }

    return response.json();
  },

  downvotePost: async (postId: number, token?: string) => {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/posts/${postId}/downvote`, {
      method: "POST",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to downvote post: ${response.statusText}`);
    }

    return response.json();
  },
};

// Leaderboard APIs
export const leaderboardAPI = {
  getLeaderboard: async (limit: number = 10, token?: string) => {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/leaderboard/?limit=${limit}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
    }

    return response.json();
  },

  getUserContributions: async (userId: number, token?: string) => {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/leaderboard/user/${userId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user contributions: ${response.statusText}`);
    }

    return response.json();
  },

  // LLM Competition API
  async runLLMCompetition(modelA: string, modelB: string, prompt: string, rounds: number = 5) {
    const token = localStorage.getItem('access_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/api/llm-competition`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model_a: modelA,
        model_b: modelB,
        prompt: prompt,
        rounds: rounds
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to run LLM competition: ${response.statusText}`);
    }

    return response.json();
  },
};

// Export runLLMCompetition directly for easier importing
export const runLLMCompetition = leaderboardAPI.runLLMCompetition;