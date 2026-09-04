import { Volunteer } from '../types/relief';
import { hoursAgo } from '../utils/format';

export const seedVolunteers: Volunteer[] = [
{
  id: 'VOL-501',
  name: 'Dr. Anushka Ratnayake',
  phone: '077 331 0092',
  preferredDistrict: 'Ratnapura',
  skills: ['Medical', 'General'],
  availability: 'Deployed',
  createdAt: hoursAgo(80)
},
{
  id: 'VOL-502',
  name: 'Suresh Ganeshan',
  phone: '071 884 2210',
  preferredDistrict: 'Batticaloa',
  skills: ['Transport', 'Logistics'],
  availability: 'Available',
  createdAt: hoursAgo(60)
},
{
  id: 'VOL-503',
  name: 'Iresha Madushani',
  phone: '076 220 7741',
  preferredDistrict: 'Colombo',
  skills: ['Logistics'],
  availability: 'Deployed',
  createdAt: hoursAgo(45)
},
{
  id: 'VOL-504',
  name: 'Mohamed Aslam',
  phone: '075 610 3388',
  preferredDistrict: 'Kalutara',
  skills: ['Cooking', 'General'],
  availability: 'Available',
  createdAt: hoursAgo(33)
},
{
  id: 'VOL-505',
  name: 'Chathura Wijesinghe',
  phone: '078 445 9901',
  preferredDistrict: 'Gampaha',
  skills: ['Transport'],
  availability: 'Available',
  createdAt: hoursAgo(20)
},
{
  id: 'VOL-506',
  name: 'Nirosha Peiris',
  phone: '070 990 2214',
  preferredDistrict: 'Trincomalee',
  skills: ['Medical', 'Logistics'],
  availability: 'Available',
  createdAt: hoursAgo(12)
},
{
  id: 'VOL-507',
  name: 'Lakmal Sooriyaarachchi',
  phone: '072 118 6640',
  preferredDistrict: 'Matara',
  skills: ['General'],
  availability: 'Deployed',
  createdAt: hoursAgo(8)
}];