const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export function getTokens(): { access: string | null; refresh: string | null } {
  if (typeof window === 'undefined') return { access: null, refresh: null };
  return {
    access: localStorage.getItem(ACCESS_KEY),
    refresh: localStorage.getItem(REFRESH_KEY),
  };
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export type UserRole = 'admin' | 'doctor' | 'patient';

export interface AuthUser {
  sub: string;
  email: string;
  role: UserRole;
}

export function roleHome(role: UserRole): string {
  if (role === 'doctor') return '/doctor/prescriptions';
  if (role === 'patient') return '/patient/prescriptions';
  return '/admin';
}
