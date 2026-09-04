/// <reference types="vite/client" />
/**
 * requestsApi.ts
 * Axios service layer for the Relief Requests module.
 * Talks to: GET/POST/PUT/DELETE /api/requests
 *
 * The backend returns { id: "REQ-XXXXXX", _mongoId: "<ObjectId>", ... }.
 * All mutation calls (update / delete) use _mongoId as the URL param
 * because MongoDB FindById needs the Mongo ObjectId.
 */

import axios from 'axios';
import type { ReliefRequest } from '../types/relief';

const BASE = `${import.meta.env.VITE_API_BASE_URL}/api/requests`;

// ---- shape that comes back from the server --------------------------------
export interface ApiRequest {
  id: string;           // "REQ-K4F2J9"  (display ID)
  _mongoId: string;     // raw MongoDB _id  (used for PUT / DELETE)
  name: string;
  district: string;
  contactPhone: string;
  itemsNeeded: string[];
  peopleAffected: number;
  urgency: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Fulfilled';
  createdAt: string;
}

// ---- mapping to the frontend type ----------------------------------------
function toRelief(r: ApiRequest): ReliefRequest {
  return {
    id: r.id,
    _mongoId: r._mongoId,
    name: r.name,
    district: r.district,
    contactPhone: r.contactPhone,
    itemsNeeded: r.itemsNeeded,
    peopleAffected: r.peopleAffected,
    urgency: r.urgency,
    status: r.status,
    createdAt: new Date(r.createdAt).toISOString(),
  };
}

// ---- API calls ------------------------------------------------------------

/** GET /api/requests — optionally filtered by district, status, urgency */
export async function fetchRequests(params?: {
  district?: string;
  status?: string;
  urgency?: string;
}): Promise<ReliefRequest[]> {
  const { data } = await axios.get<ApiRequest[]>(BASE, { params });
  return data.map(toRelief);
}

/** POST /api/requests */
export async function createRequest(
  payload: Omit<ReliefRequest, 'id' | '_mongoId' | 'createdAt' | 'status'>
): Promise<ReliefRequest> {
  const { data } = await axios.post<ApiRequest>(BASE, payload);
  return toRelief(data);
}

/** PUT /api/requests/:mongoId */
export async function updateRequest(
  mongoId: string,
  patch: Partial<Omit<ReliefRequest, 'id' | '_mongoId'>>
): Promise<ReliefRequest> {
  const { data } = await axios.put<ApiRequest>(`${BASE}/${mongoId}`, patch);
  return toRelief(data);
}

/** DELETE /api/requests/:mongoId */
export async function deleteRequest(mongoId: string): Promise<void> {
  await axios.delete(`${BASE}/${mongoId}`);
}

/** GET /api/requests/count */
export async function fetchCount(): Promise<{ pending: number; total: number }> {
  const { data } = await axios.get<{ pending: number; total: number }>(
    `${BASE}/count`
  );
  return data;
}
