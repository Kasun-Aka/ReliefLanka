import { Center } from '../types/relief';
import { hoursAgo } from '../utils/format';

export const seedCenters: Center[] = [
{
  id: 'CTR-201',
  centerName: 'Ratnapura Town Hall Hub',
  district: 'Ratnapura',
  address: 'Main St, opposite Clock Tower',
  contactPerson: 'S. Alwis',
  contactPhone: '045 222 1180',
  capacity: 400,
  intakeToday: 318,
  operatingHours: '07:00 – 21:00 daily',
  isActive: true,
  createdAt: hoursAgo(70)
},
{
  id: 'CTR-202',
  centerName: 'Colombo Central Warehouse',
  district: 'Colombo',
  address: 'Bloemendhal Rd, Kotahena',
  contactPerson: 'M. Fernando',
  contactPhone: '011 244 7710',
  capacity: 1200,
  intakeToday: 540,
  operatingHours: '24 hours',
  isActive: true,
  createdAt: hoursAgo(120)
},
{
  id: 'CTR-203',
  centerName: 'Batticaloa Methodist Church',
  district: 'Batticaloa',
  address: 'Trinco Rd, Kallady',
  contactPerson: 'J. Thevarajah',
  contactPhone: '065 222 3390',
  capacity: 250,
  intakeToday: 61,
  operatingHours: '08:00 – 18:00',
  isActive: true,
  createdAt: hoursAgo(52)
},
{
  id: 'CTR-204',
  centerName: 'Kalutara District Secretariat',
  district: 'Kalutara',
  address: 'Nagoda Rd, Kalutara North',
  contactPerson: 'P. Dissanayake',
  contactPhone: '034 222 8814',
  capacity: 300,
  intakeToday: 275,
  operatingHours: '08:30 – 17:00 (Mon–Sat)',
  isActive: true,
  createdAt: hoursAgo(64)
},
{
  id: 'CTR-205',
  centerName: 'Gampaha Youth Centre',
  district: 'Gampaha',
  address: 'Bauddhaloka Mw, Gampaha',
  contactPerson: 'N. Silva',
  contactPhone: '033 223 4402',
  capacity: 180,
  intakeToday: 44,
  operatingHours: '09:00 – 19:00',
  isActive: true,
  createdAt: hoursAgo(30)
},
{
  id: 'CTR-206',
  centerName: 'Matara Coastal Depot',
  district: 'Matara',
  address: 'Beach Rd, Matara Fort',
  contactPerson: 'H. Gunaratne',
  contactPhone: '041 222 6675',
  capacity: 220,
  intakeToday: 0,
  operatingHours: 'Closed for restocking',
  isActive: false,
  createdAt: hoursAgo(150)
}];