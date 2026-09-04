import axios from 'axios';
import { InventoryItem } from '../types/relief';

const API_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:5000'}/api/inventory`;
function authConfig() {
  const token = localStorage.getItem('relieflanka_token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
}
type InventoryResponse = Omit<InventoryItem, 'id'> & { _id: string; id?: string };
function toInventory(item: InventoryResponse): InventoryItem { return { id: item._id ?? item.id ?? '', itemName: item.itemName, category: item.category, quantity: item.quantity, reorderLevel: item.reorderLevel, unit: item.unit, storageLocation: item.storageLocation, district: item.district, loggedAt: item.loggedAt }; }
export async function listInventory(): Promise<InventoryItem[]> { const response = await axios.get<InventoryResponse[]>(API_URL); return response.data.map(toInventory); }
export async function createInventory(item: InventoryItem): Promise<InventoryItem> { const response = await axios.post<InventoryResponse>(API_URL, { itemName: item.itemName, category: item.category, quantity: item.quantity, reorderLevel: item.reorderLevel, unit: item.unit, storageLocation: item.storageLocation, district: item.district }, authConfig()); return toInventory(response.data); }
export async function updateInventory(id: string, patch: Partial<InventoryItem>): Promise<InventoryItem> { const response = await axios.put<InventoryResponse>(`${API_URL}/${id}`, patch, authConfig()); return toInventory(response.data); }
export async function deleteInventory(id: string): Promise<void> { await axios.delete(`${API_URL}/${id}`, authConfig()); }
