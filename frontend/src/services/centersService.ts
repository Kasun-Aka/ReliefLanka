import { Center } from '../types/relief';

const BASE = `${import.meta.env.VITE_API_BASE_URL}/api/centers`;

function toClient(doc: any): Center {
  return {
    id: doc._mongoId ?? doc._id ?? doc.id,
    centerName: doc.centerName ?? doc.name,
    district: doc.district,
    address: doc.address ?? '',
    contactPerson: doc.contactPerson,
    contactPhone: doc.contactPhone ?? doc.phone,
    capacity: doc.capacity,
    intakeToday: doc.intakeToday ?? doc.currentOccupancy ?? 0,
    operatingHours: doc.operatingHours ?? '',
    isActive: doc.isActive,
    createdAt: doc.createdAt,
  };
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const centersService = {
  getAll: async (params?: { district?: string; isActive?: boolean }) => {
    const qs = new URLSearchParams();
    if (params?.district) qs.set('district', params.district);
    if (params?.isActive !== undefined) qs.set('isActive', String(params.isActive));
    const url = qs.toString() ? `${BASE}?${qs}` : BASE;
    const data = await request<any[]>(url);
    return data.map(toClient);
  },

  create: async (body: Omit<Center, 'id'>) => {
    const data = await request<any>(BASE, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return toClient(data);
  },

  update: async (id: string, patch: Partial<Center>) => {
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
