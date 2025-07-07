import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  LoginRequest,
  JwtResponse,
  Session,
  CreateSessionRequest,
  UpdateSessionRequest,
  SessionAnalytics,
  ProgressAnalytics,
  HighestGrades,
  AverageGrades,
  SessionDiscipline,
} from '../types';

class ApiService {
  private baseUrl = 'https://ascend-api-production.up.railway.app';
  
  private async getHeaders(): Promise<HeadersInit> {
    const token = await AsyncStorage.getItem('jwt_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }
  
  // Authentication
  async login(email: string, password: string): Promise<JwtResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Login failed: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  }
  
  async validateToken(): Promise<User> {
    const response = await fetch(`${this.baseUrl}/auth/validate`, {
      headers: await this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Invalid token');
    }
    
    return response.json();
  }
  
  async createUser(email: string, password: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create user: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  }
  
  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${this.baseUrl}/api/users/me`, {
      headers: await this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    
    return response.json();
  }
  
  // Sessions
  async getSessions(params?: { discipline?: SessionDiscipline; date?: string }): Promise<Session[]> {
    const queryParams = new URLSearchParams();
    if (params?.discipline) queryParams.append('discipline', params.discipline);
    if (params?.date) queryParams.append('date', params.date);
    
    const response = await fetch(`${this.baseUrl}/api/sessions?${queryParams}`, {
      headers: await this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }
    
    return response.json();
  }
  
  async getSession(id: string): Promise<Session> {
    const response = await fetch(`${this.baseUrl}/api/sessions/${id}`, {
      headers: await this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch session');
    }
    
    return response.json();
  }
  
  async createSession(session: CreateSessionRequest): Promise<Session> {
    const response = await fetch(`${this.baseUrl}/api/sessions`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(session),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create session');
    }
    
    return response.json();
  }
  
  async updateSession(id: string, updates: UpdateSessionRequest): Promise<Session> {
    const response = await fetch(`${this.baseUrl}/api/sessions/${id}`, {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update session');
    }
    
    return response.json();
  }
  
  async replaceSession(id: string, session: CreateSessionRequest): Promise<Session> {
    const response = await fetch(`${this.baseUrl}/api/sessions/${id}`, {
      method: 'PUT',
      headers: await this.getHeaders(),
      body: JSON.stringify(session),
    });
    
    if (!response.ok) {
      throw new Error('Failed to replace session');
    }
    
    return response.json();
  }
  
  async deleteSession(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/sessions/${id}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete session');
    }
  }
  
  async getGradesForDiscipline(discipline: SessionDiscipline): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/api/sessions/grades/${discipline}`, {
      headers: await this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch grades');
    }
    
    return response.json();
  }
  
  // Analytics
  async getAnalytics(): Promise<SessionAnalytics> {
    const response = await fetch(`${this.baseUrl}/api/sessions/analytics`, {
      headers: await this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }
    
    return response.json();
  }
  
  async getProgressAnalytics(): Promise<ProgressAnalytics> {
    const response = await fetch(`${this.baseUrl}/api/sessions/stats/progress`, {
      headers: await this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch progress analytics');
    }
    
    return response.json();
  }
  
  async getHighestGrades(): Promise<HighestGrades> {
    const response = await fetch(`${this.baseUrl}/api/sessions/stats/highest`, {
      headers: await this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch highest grades');
    }
    
    return response.json();
  }
  
  async getAverageGrades(): Promise<AverageGrades> {
    const response = await fetch(`${this.baseUrl}/api/sessions/stats/average`, {
      headers: await this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch average grades');
    }
    
    return response.json();
  }
  
  // Health check
  async healthCheck(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/health`);
    
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    
    return response.text();
  }
}

export const apiService = new ApiService(); 