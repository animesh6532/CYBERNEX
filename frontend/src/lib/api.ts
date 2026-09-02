/**
 * CYBERNEX Sovereign Backend API Client Bridge
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('cybernex_jwt_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || errorData?.detail || `API Request Failed: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Health
  healthCheck: () => request<{ status: string; services: Record<string, string> }>('/health'),

  // Auth
  login: (email: string, password: string) =>
    request<{ access_token: string; user_id: string; email: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, full_name?: string) =>
    request<{ access_token: string; user_id: string; email: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
    }),

  getMe: () => request<any>('/auth/me'),

  // Workbench & Tasks
  createTask: (prompt: string, model: string, tools: string[], file_ids: string[]) =>
    request<{ task_id: string; run_id: string; status: string }>('/tasks', {
      method: 'POST',
      body: JSON.stringify({ prompt, model, tools, file_ids }),
    }),

  getTasks: () => request<any[]>('/tasks'),

  getTask: (id: string) => request<any>(`/tasks/${id}`),

  // Files
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('cybernex_jwt_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) throw new Error('File upload failed.');
    return res.json();
  },

  // Models
  getModels: () => request<any[]>('/models'),

  // Knowledge & Documents
  getKnowledgeCollections: () => request<any[]>('/knowledge/collections'),
  searchKnowledge: (query: string, collection: string) =>
    request<any[]>('/knowledge/search', {
      method: 'POST',
      body: JSON.stringify({ query, collection, limit: 5 }),
    }),

  getDocuments: () => request<any[]>('/documents'),

  // Runs
  getRun: (runId: string) => request<any>(`/runs/${runId}`),
  getRunSteps: (runId: string) => request<any[]>(`/runs/${runId}/steps`),

  // Sandbox
  runSandbox: (code: string) =>
    request<{ stdout: string; stderr: string; exit_code: number; duration: string; status: string }>('/sandbox/run', {
      method: 'POST',
      body: JSON.stringify({ code, language: 'python' }),
    }),

  // Telemetry & Hardware
  getSecurityStatus: () => request<any>('/security/status'),
  getSecurityEvents: () => request<any[]>('/security/events'),
  getSystemStatus: () => request<any>('/system/status'),

  // Settings
  getSettings: () => request<any>('/settings'),
  updateSettings: (settingsData: any) =>
    request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    }),
};
