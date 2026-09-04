import axios from 'axios';
import { Availability, Volunteer, VolunteerSkill } from '../types/relief';

const API_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:5000'}/api/volunteers`;

function authConfig() {
  const token = localStorage.getItem('relieflanka_token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
}

type VolunteerResponse = Omit<Volunteer, 'id'> & { _id: string; id?: string };
type VolunteerPayload = Omit<Volunteer, 'id' | 'createdAt'> & { createdAt?: string };

function toVolunteer(volunteer: VolunteerResponse): Volunteer {
  return {
    id: volunteer._id ?? volunteer.id ?? '',
    name: volunteer.name,
    phone: volunteer.phone,
    preferredDistrict: volunteer.preferredDistrict,
    skills: volunteer.skills as VolunteerSkill[],
    availability: volunteer.availability as Availability,
    createdAt: volunteer.createdAt
  };
}

export async function listVolunteers(): Promise<Volunteer[]> {
  const response = await axios.get<VolunteerResponse[]>(API_URL, authConfig());
  return response.data.map(toVolunteer);
}

export async function createVolunteer(volunteer: Volunteer): Promise<Volunteer> {
  const response = await axios.post<VolunteerResponse>(API_URL, {
    name: volunteer.name,
    phone: volunteer.phone,
    preferredDistrict: volunteer.preferredDistrict,
    skills: volunteer.skills,
    availability: volunteer.availability
  }, authConfig());
  return toVolunteer(response.data);
}

export async function updateVolunteer(
  id: string,
  patch: Partial<Volunteer>
): Promise<Volunteer> {
  const response = await axios.put<VolunteerResponse>(`${API_URL}/${id}`, patch, authConfig());
  return toVolunteer(response.data);
}

export async function deleteVolunteer(id: string): Promise<void> {
  await axios.delete(`${API_URL}/${id}`, authConfig());
}
