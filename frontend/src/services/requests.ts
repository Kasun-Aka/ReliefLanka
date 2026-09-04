import axios from 'axios';
import { ReliefRequest } from '../types/relief';

const API_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:5000'}/api/requests`;
function authConfig() {
  const token = localStorage.getItem('relieflanka_token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
}
type RequestResponse = Omit<ReliefRequest, 'id'> & { _id: string; id?: string };
function toRequest(item: RequestResponse): ReliefRequest {
  return { id: item._id ?? item.id ?? '', name: item.name, district: item.district, contactPhone: item.contactPhone, itemsNeeded: item.itemsNeeded, peopleAffected: item.peopleAffected, urgency: item.urgency, status: item.status, createdAt: item.createdAt };
}
export async function listRequests(): Promise<ReliefRequest[]> { const response = await axios.get<RequestResponse[]>(API_URL); return response.data.map(toRequest); }
export async function createRequest(request: ReliefRequest): Promise<ReliefRequest> { const response = await axios.post<RequestResponse>(API_URL, { name: request.name, district: request.district, contactPhone: request.contactPhone, itemsNeeded: request.itemsNeeded, peopleAffected: request.peopleAffected, urgency: request.urgency }); return toRequest(response.data); }
export async function updateRequest(id: string, patch: Partial<ReliefRequest>): Promise<ReliefRequest> { const response = await axios.put<RequestResponse>(`${API_URL}/${id}`, patch, authConfig()); return toRequest(response.data); }
export async function deleteRequest(id: string): Promise<void> { await axios.delete(`${API_URL}/${id}`, authConfig()); }
