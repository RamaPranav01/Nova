// API base URL - update this to match your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types for API responses
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ChatRequest {
  message: string;
  policy?: string;
}

export interface ChatResponse {
  response: string;
  status: 'success' | 'blocked' | 'warning';
  reason?: string;
  analysis: {
    threat_detected: boolean;
    policy_violations: string[];
    confidence: number;
  };
}

export interface AnalyticsData {
  total_requests: number;
  blocked_threats: number;
  successful_requests: number;
  average_response_time: number;
  cost_savings: number;
  uptime: number;
  threats_over_time: Array<{
    timestamp: string;
    count: number;
  }>;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  user_message: string;
  ai_response: string;
  status: 'success' | 'blocked' | 'warning';
  threat_detected: boolean;
  policy_violations: string[];
  response_time: number;
  hash: string;
}

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('aegis_token');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

// Authentication API calls
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token
    localStorage.setItem('aegis_token', response.access_token);
    localStorage.setItem('aegis_user', JSON.stringify(response.user));
    
    return response;
  },

  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await apiCall<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    // Store token
    localStorage.setItem('aegis_token', response.access_token);
    localStorage.setItem('aegis_user', JSON.stringify(response.user));
    
    return response;
  },

  logout: () => {
    localStorage.removeItem('aegis_token');
    localStorage.removeItem('aegis_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('aegis_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('aegis_token');
  },
};

// Chat API calls
export const chatAPI = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    return await apiCall<ChatResponse>('/aegis-chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  // For the demo page - simulate Aegis processing
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  simulateAegisChat: async (message: string, _policy: string): Promise<ChatResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple threat detection logic
    const lowerMessage = message.toLowerCase();
    let status: 'success' | 'blocked' | 'warning' = 'success';
    let reason: string | undefined;
    let threatDetected = false;
    const policyViolations: string[] = [];
    
    // Check for medical advice
    if (lowerMessage.includes('medical') || lowerMessage.includes('diagnose') || lowerMessage.includes('treatment')) {
      status = 'blocked';
      reason = 'Medical advice request detected';
      threatDetected = true;
      policyViolations.push('medical_advice');
    }
    
    // Check for personal information
    if (lowerMessage.includes('password') || lowerMessage.includes('credit card') || lowerMessage.includes('ssn')) {
      status = 'blocked';
      reason = 'Personal information request detected';
      threatDetected = true;
      policyViolations.push('personal_info');
    }
    
    // Check for harmful content
    if (lowerMessage.includes('hack') || lowerMessage.includes('exploit') || lowerMessage.includes('bypass')) {
      status = 'warning';
      reason = 'Potentially harmful content detected';
      threatDetected = true;
      policyViolations.push('harmful_content');
    }
    
    return {
      response: status === 'blocked' 
        ? 'I cannot process this request as it violates our security policies.'
        : 'I understand your request. Here\'s what I can tell you about that topic...',
      status,
      reason,
      analysis: {
        threat_detected: threatDetected,
        policy_violations: policyViolations,
        confidence: threatDetected ? 0.95 : 0.1,
      },
    };
  },
};

// Analytics API calls
export const analyticsAPI = {
  getDashboardData: async (): Promise<AnalyticsData> => {
    return await apiCall<AnalyticsData>('/analytics/dashboard');
  },

  getThreatsOverTime: async (timeframe: string = '24h'): Promise<AnalyticsData['threats_over_time']> => {
    return await apiCall<AnalyticsData['threats_over_time']>(`/analytics/threats?timeframe=${timeframe}`);
  },
};

// Logs API calls
export const logsAPI = {
  getLogs: async (page: number = 1, limit: number = 50, filters?: Record<string, string>): Promise<{
    logs: LogEntry[];
    total: number;
    page: number;
    total_pages: number;
  }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    
    return await apiCall(`/logs?${params}`);
  },

  freezeThreat: async (logId: string): Promise<void> => {
    return await apiCall(`/logs/${logId}/freeze`, {
      method: 'POST',
    });
  },

  verifyLogIntegrity: async (logId: string): Promise<{
    is_valid: boolean;
    hash_verified: boolean;
  }> => {
    return await apiCall(`/logs/${logId}/verify`);
  },
};

// Policy types
export interface Policy {
  id: string;
  name: string;
  description: string;
  rules: string[];
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// Policies API calls
export const policiesAPI = {
  getPolicies: async (): Promise<Policy[]> => {
    return await apiCall('/policies');
  },

  createPolicy: async (policy: Omit<Policy, 'id' | 'created_at' | 'updated_at'>): Promise<Policy> => {
    return await apiCall('/policies', {
      method: 'POST',
      body: JSON.stringify(policy),
    });
  },

  updatePolicy: async (id: string, policy: Partial<Omit<Policy, 'id' | 'created_at' | 'updated_at'>>): Promise<Policy> => {
    return await apiCall(`/policies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(policy),
    });
  },

  deletePolicy: async (id: string): Promise<void> => {
    return await apiCall(`/policies/${id}`, {
      method: 'DELETE',
    });
  },
};

// Error handling utility
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Request interceptor for error handling
export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error: unknown) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof Error && error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new APIError('Network error - please check your connection', 0, 'NETWORK_ERROR');
    }
    
    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    throw new APIError(errorMessage, 500, 'UNKNOWN_ERROR');
  }
}; 