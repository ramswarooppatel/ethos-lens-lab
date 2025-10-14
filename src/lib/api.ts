const API_BASE = "http://127.0.0.1:8000";

interface AuthToken {
  access_token: string;
  token_type: string;
}

interface DatasetResponse {
  id: number;
  name: string;
  file_type: string;
  file_path: string;
  row_count: number;
  target_column: string | null;
  sensitive_columns: string[];
  columns: Array<{
    column_name: string;
    column_type: string;
    null_count: number;
    unique_count: number;
    example_value: string | number;
  }>;
  status: string;
}

interface ColumnSuggestion {
  target_column: string;
  sensitive_columns: string[];
}

interface ConfirmColumnsRequest {
  target_column: string;
  sensitive_columns: string[];
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
};