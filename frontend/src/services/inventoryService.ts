import { InventoryItem } from '../types/relief';
import { auth } from '../config/firebase';

const BASE = `${import.meta.env.VITE_API_BASE_URL}/api/inventory`;

function toClient(doc: any): InventoryItem {
  return {
    id: doc._mongoId ?? doc._id ?? doc.id,
    itemName: doc.itemName,
    category: doc.category,
    quantity: doc.quantity,
    unit: doc.unit,
    reorderLevel: doc.reorderLevel,
    storageLocation: doc.storageLocation ?? '',
    district: doc.district,
    loggedAt: doc.loggedAt ?? doc.lastUpdated,
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

export const inventoryService = {
  getAll: async (params?: { district?: string; category?: string }) => {
    const qs = new URLSearchParams();
    if (params?.district) qs.set('district', params.district);
    if (params?.category) qs.set('category', params.category);
    const url = qs.toString() ? `${BASE}?${qs}` : BASE;
    const data = await request<any[]>(url);
    return data.map(toClient);
  },

  create: async (body: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const data = await request<any>(BASE, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return toClient(data);
  },

  update: async (id: string, patch: Partial<InventoryItem>) => {
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
