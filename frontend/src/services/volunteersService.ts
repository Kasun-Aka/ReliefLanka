import { Volunteer } from '../types/relief';
import { auth } from '../config/firebase';

const BASE = `${import.meta.env.VITE_API_BASE_URL}/api/volunteers`;

function toClient(doc: any): Volunteer {
  return {
    id: doc._mongoId ?? doc._id ?? doc.id,
    name: doc.name,
    phone: doc.phone,
    preferredDistrict: doc.preferredDistrict,
    skills: doc.skills ?? [],
    availability: doc.availability,
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

export const volunteersService = {
  getAll: async (params?: { district?: string; availability?: string; skill?: string }) => {
    const qs = new URLSearchParams();
    if (params?.district) qs.set('district', params.district);
    if (params?.availability) qs.set('availability', params.availability);
    if (params?.skill) qs.set('skill', params.skill);
    const url = qs.toString() ? `${BASE}?${qs}` : BASE;
    const data = await request<any[]>(url);
    return data.map(toClient);
  },

  create: async (body: Omit<Volunteer, 'id'>) => {
    const data = await request<any>(BASE, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return toClient(data);
  },

  update: async (id: string, patch: Partial<Volunteer>) => {
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
