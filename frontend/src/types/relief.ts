export type Urgency = 'Low' | 'Medium' | 'High';
export type RequestStatus = 'Pending' | 'Fulfilled';
export type Availability = 'Available' | 'Deployed';
export type VolunteerSkill =
'Medical' |
'Transport' |
'Logistics' |
'Cooking' |
'General';
export type InventoryCategory =
'Water' |
'Food' |
'Medicine' |
'Clothing' |
'Other';

export interface ReliefRequest {
  id: string;
  name: string;
  district: string;
  contactPhone: string;
  itemsNeeded: string[];
  peopleAffected: number;
  urgency: Urgency;
  status: RequestStatus;
  createdAt: string;
}

export interface Center {
  id: string;
  centerName: string;
  district: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  capacity: number;
  intakeToday: number;
  operatingHours: string;
  isActive: boolean;
  createdAt: string;
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  preferredDistrict: string;
  skills: VolunteerSkill[];
  availability: Availability;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  itemName: string;
  category: InventoryCategory;
  quantity: number;
  reorderLevel: number;
  unit: string;
  storageLocation: string;
  district: string;
  loggedAt: string;
}

export const URGENCIES: Urgency[] = ['Low', 'Medium', 'High'];
export const REQUEST_STATUSES: RequestStatus[] = ['Pending', 'Fulfilled'];
export const AVAILABILITIES: Availability[] = ['Available', 'Deployed'];
export const VOLUNTEER_SKILLS: VolunteerSkill[] = [
'Medical',
'Transport',
'Logistics',
'Cooking',
'General'];

export const INVENTORY_CATEGORIES: InventoryCategory[] = [
'Water',
'Food',
'Medicine',
'Clothing',
'Other'];