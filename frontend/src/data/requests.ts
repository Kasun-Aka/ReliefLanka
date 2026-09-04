import { ReliefRequest } from '../types/relief';
import { hoursAgo } from '../utils/format';

export const seedRequests: ReliefRequest[] = [
{
  id: 'REQ-1042',
  name: 'Nuwan Perera',
  district: 'Ratnapura',
  contactPhone: '077 214 8890',
  itemsNeeded: ['Drinking water', 'Baby formula', 'Blankets'],
  peopleAffected: 24,
  urgency: 'High',
  status: 'Pending',
  createdAt: hoursAgo(2)
},
{
  id: 'REQ-1041',
  name: 'Fathima Rizwan',
  district: 'Batticaloa',
  contactPhone: '071 660 3312',
  itemsNeeded: ['Insulin', 'First aid kits'],
  peopleAffected: 6,
  urgency: 'High',
  status: 'Pending',
  createdAt: hoursAgo(4)
},
{
  id: 'REQ-1040',
  name: 'Kamal Jayasinghe',
  district: 'Kalutara',
  contactPhone: '076 118 2044',
  itemsNeeded: ['Dry rations', 'Cooking gas'],
  peopleAffected: 41,
  urgency: 'Medium',
  status: 'Pending',
  createdAt: hoursAgo(9)
},
{
  id: 'REQ-1039',
  name: 'Thavaraj Selvam',
  district: 'Trincomalee',
  contactPhone: '070 553 7781',
  itemsNeeded: ['Tarpaulin sheets', 'Mosquito nets'],
  peopleAffected: 18,
  urgency: 'Medium',
  status: 'Pending',
  createdAt: hoursAgo(14)
},
{
  id: 'REQ-1038',
  name: 'Sanduni Wickrama',
  district: 'Colombo',
  contactPhone: '077 902 1145',
  itemsNeeded: ['Drinking water'],
  peopleAffected: 12,
  urgency: 'High',
  status: 'Fulfilled',
  createdAt: hoursAgo(21)
},
{
  id: 'REQ-1037',
  name: 'Ravi Bandara',
  district: 'Kegalle',
  contactPhone: '075 447 9020',
  itemsNeeded: ['School supplies', 'Clothing'],
  peopleAffected: 30,
  urgency: 'Low',
  status: 'Pending',
  createdAt: hoursAgo(28)
},
{
  id: 'REQ-1036',
  name: 'Ayesha Nizam',
  district: 'Gampaha',
  contactPhone: '071 233 6650',
  itemsNeeded: ['Dry rations', 'Drinking water', 'Sanitary items'],
  peopleAffected: 55,
  urgency: 'High',
  status: 'Fulfilled',
  createdAt: hoursAgo(36)
},
{
  id: 'REQ-1035',
  name: 'Dinesh Kumara',
  district: 'Matara',
  contactPhone: '078 771 4408',
  itemsNeeded: ['Water purification tablets'],
  peopleAffected: 9,
  urgency: 'Medium',
  status: 'Fulfilled',
  createdAt: hoursAgo(48)
}];