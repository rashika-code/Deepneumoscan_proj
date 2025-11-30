const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
}

export const api = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  async signup(username: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    return response.json();
  },

  async submitSelfAssessment(data: unknown, token: string) {
    const response = await fetch(`${API_BASE_URL}/assessments/self`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to submit assessment');
    return response.json();
  },

  async uploadXRay(formData: FormData, token: string) {
    const response = await fetch(`${API_BASE_URL}/xray/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to analyze X-Ray');
    return response.json();
  },

  async submitCuringAssessment(data: unknown, token: string) {
    const response = await fetch(`${API_BASE_URL}/assessments/curing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to submit curing assessment');
    return response.json();
  },

  async getHistory(token: string) {
    const response = await fetch(`${API_BASE_URL}/history`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
  },

  async deleteRecord(type: string, id: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/history/${type}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to delete record');
    return response.json();
  },
};
