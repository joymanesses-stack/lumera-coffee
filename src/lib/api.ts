import type { User } from 'firebase/auth';
import { auth } from './firebase';

const API_URL = (import.meta.env.VITE_API_URL || 'https://lumera-coffee-backend.onrender.com').replace(/\/$/, '');
const ADMIN_API_URL = (import.meta.env.VITE_ADMIN_API_URL || API_URL).replace(/\/$/, '');
let backendToken: string | null = null;
let backendUid: string | null = null;
let sessionPromise: Promise<string> | null = null;
let sessionPromiseUid: string | null = null;
let adminToken: string | null = sessionStorage.getItem('lumera_admin_token');
export const hasAdminSession = () => Boolean(adminToken);

export async function backendSession(user: User): Promise<string> {
  if (backendToken && backendUid === user.uid) return backendToken;
  if (sessionPromise && sessionPromiseUid === user.uid) return sessionPromise;
  sessionPromiseUid = user.uid;
  sessionPromise = (async () => {
    const idToken = await user.getIdToken();
    const response = await fetch(`${API_URL}/v1/auth/firebase`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || typeof data.token !== 'string') throw new Error(data.error || 'Could not start a secure backend session.');
    backendToken = data.token;
    backendUid = user.uid;
    return backendToken;
  })().finally(() => {
    if (sessionPromiseUid === user.uid) { sessionPromise = null; sessionPromiseUid = null; }
  });
  return sessionPromise;
}

export async function adminLogin(email: string, password: string): Promise<void> {
  const response = await fetch(`${ADMIN_API_URL}/v1/auth/admin-login`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || typeof data.token !== 'string' || data.user?.role !== 'admin') {
    throw new Error(data.error || 'Administrator sign-in failed.');
  }
  adminToken = data.token;
  sessionStorage.setItem('lumera_admin_token', adminToken);
}

export function adminLogout() { adminToken = null; sessionStorage.removeItem('lumera_admin_token'); }

export async function adminApiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!adminToken) throw new Error('Sign in with the administrator account first.');
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json');
  headers.set('authorization', `Bearer ${adminToken}`);
  const response = await fetch(`${ADMIN_API_URL}${path}`, { ...init, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
  return data as T;
}

async function ensureBackendSession(): Promise<string> {
  const user = auth?.currentUser;
  if (!user) throw new Error('Sign in before using this service.');
  if (backendToken && backendUid === user.uid) return backendToken;
  return backendSession(user);
}

export function clearBackendSession() { backendToken = null; backendUid = null; }
export function getBackendToken() { return backendToken; }
export function backendUrl(path: string) { return `${API_URL}${path}`; }

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method || 'GET').toUpperCase();
  const isPublic = path.startsWith('/v1/auth/') || path === '/v1/health' || (path === '/v1/inquiries' && method === 'POST');
  const token = isPublic ? backendToken : await ensureBackendSession();
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json');
  if (token) headers.set('authorization', `Bearer ${token}`);
  const response = await fetch(backendUrl(path), { ...init, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
  return data as T;
}

