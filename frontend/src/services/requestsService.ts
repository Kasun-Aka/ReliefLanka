import { ReliefRequest } from '../types/relief';
import { auth } from '../config/firebase';

const BASE = `${import.meta.env.VITE_API_BASE_URL}/api/requests`;

function toClient(doc: any): ReliefRequest {
  return {
    id: doc._mongoId ?? doc._id ?? doc.id,
    name: doc.name,
    district: doc.district,
    contactPhone: doc.contactPhone,
    itemsNeeded: doc.itemsNeeded ?? [],
    peopleAffected: doc.peopleAffected,
    urgency: doc.urgency,
    status: doc.status,
    createdAt: doc.createdAt,
  };
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = await auth.currentUser?.getIdToken();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    headers,
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const requestsService = {
  getAll: async (params?: { district?: string; status?: string; urgency?: string }) => {
    const qs = new URLSearchParams();
    if (params?.district) qs.set('district', params.district);
    if (params?.status) qs.set('status', params.status);
    if (params?.urgency) qs.set('urgency', params.urgency);
    const url = qs.toString() ? `${BASE}?${qs}` : BASE;
    const data = await request<any[]>(url);
    return data.map(toClient);
  },

  create: async (body: Omit<ReliefRequest, 'id' | 'createdAt'>) => {
    const data = await request<any>(BASE, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return toClient(data);
  },

  update: async (id: string, patch: Partial<ReliefRequest>) => {
    const data = await request<any>(`${BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
    return toClient(data);
  },

  delete: async (id: string) => {
    await request<unknown>(`${BASE}/${id}`, { method: 'DELETE' });
  },
};
