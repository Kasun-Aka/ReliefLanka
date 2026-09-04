import axios from 'axios';
import { Center } from '../types/relief';

const API_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:5000'}/api/centers`;

function authConfig() {
  const token = localStorage.getItem('relieflanka_token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
}

type CenterResponse = Omit<Center, 'id'> & { _id: string; ownerId?: string; id?: string };

function toCenter(center: CenterResponse): Center {
  return {
    id: center._id ?? center.id ?? '',
    ownerId: center.ownerId,
    centerName: center.centerName,
    district: center.district,
    address: center.address,
    contactPerson: center.contactPerson,
    contactPhone: center.contactPhone,
    capacity: center.capacity,
    intakeToday: center.intakeToday ?? 0,
    operatingHours: center.operatingHours,
    isActive: center.isActive,
    createdAt: center.createdAt
  };
}

export async function listCenters(): Promise<Center[]> {
  const response = await axios.get<CenterResponse[]>(API_URL, authConfig());
  return response.data.map(toCenter);
}

export async function createCenter(center: Center): Promise<Center> {
  const response = await axios.post<CenterResponse>(API_URL, {
    centerName: center.centerName,
    district: center.district,
    address: center.address,
    contactPerson: center.contactPerson,
    contactPhone: center.contactPhone,
    capacity: center.capacity,
    operatingHours: center.operatingHours,
    isActive: center.isActive
  }, authConfig());
  return toCenter(response.data);
}

export async function updateCenter(id: string, center: Partial<Center>): Promise<Center> {
  const response = await axios.put<CenterResponse>(`${API_URL}/${id}`, center, authConfig());
  return toCenter(response.data);
}

export async function deleteCenter(id: string): Promise<void> {
  await axios.delete(`${API_URL}/${id}`, authConfig());
}
