const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'patient';
}

export interface Prescription {
  id: string;
  code: string;
  status: 'pending' | 'consumed';
  notes?: string;
  createdAt: string;
  consumedAt?: string;
  patient: {
    id: string;
    user: { name: string };
  };
  author: {
    id: string;
    user: { name: string };
  };
  items: PrescriptionItem[];
}

export interface PrescriptionItem {
  id: string;
  name: string;
  dosage?: string;
  quantity?: number;
  instructions?: string;
}

export interface Metrics {
  totals: { doctors: number; patients: number; prescriptions: number };
  byStatus: { pending: number; consumed: number };
  byDay: { date: string; count: number }[];
  topDoctors: { doctorId: string; name: string; count: number }[];
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && getRefreshToken()) {
    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: getRefreshToken() }),
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      headers['Authorization'] = `Bearer ${data.accessToken}`;
      const retryResponse = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });
      if (!retryResponse.ok) {
        throw new Error(`API Error: ${retryResponse.status}`);
      }
      return retryResponse.json();
    }
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data;
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

export async function getProfile(): Promise<User> {
  return apiRequest<User>('/auth/profile');
}

export async function getPatients() {
  return apiRequest<{ data: { id: string; name: string; birthDate?: string }[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/patients');
}

export async function getDoctors() {
  return apiRequest<{ data: { id: string; name: string; specialty?: string }[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/doctors');
}

export async function getPrescriptions(params?: {
  mine?: boolean;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  const endpoint = params?.mine ? '/prescriptions' : '/me/prescriptions';
  if (params?.mine) searchParams.set('mine', 'true');
  if (params?.status) searchParams.set('status', params.status);
  if (params?.from) searchParams.set('from', params.from);
  if (params?.to) searchParams.set('to', params.to);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  const query = searchParams.toString();
  return apiRequest<{ data: Prescription[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(`${endpoint}${query ? `?${query}` : ''}`);
}

export async function getPrescription(id: string) {
  return apiRequest<Prescription>(`/prescriptions/${id}`);
}

export async function createPrescription(data: {
  patientId: string;
  notes?: string;
  items: { name: string; dosage?: string; quantity?: number; instructions?: string }[];
}) {
  return apiRequest<Prescription>('/prescriptions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function consumePrescription(id: string) {
  return apiRequest<Prescription>(`/prescriptions/${id}/consume`, {
    method: 'PUT',
    body: JSON.stringify({ consumed: true }),
  });
}

export async function downloadPDF(id: string) {
  const token = getToken();
  const response = await fetch(`${API_URL}/prescriptions/${id}/pdf`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error('Failed to download PDF');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `prescription-${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function getMetrics() {
  return apiRequest<Metrics>('/admin/metrics');
}