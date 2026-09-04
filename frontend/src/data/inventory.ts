import { InventoryItem } from '../types/relief';
import { hoursAgo } from '../utils/format';

export const seedInventory: InventoryItem[] = [
{
  id: 'INV-801',
  itemName: 'Bottled drinking water',
  category: 'Water',
  quantity: 4200,
  reorderLevel: 2000,
  unit: 'liters',
  storageLocation: 'Colombo Central Warehouse',
  district: 'Colombo',
  loggedAt: hoursAgo(3)
},
{
  id: 'INV-802',
  itemName: 'Water purification tablets',
  category: 'Water',
  quantity: 180,
  reorderLevel: 500,
  unit: 'boxes',
  storageLocation: 'Ratnapura Town Hall Hub',
  district: 'Ratnapura',
  loggedAt: hoursAgo(5)
},
{
  id: 'INV-803',
  itemName: 'Rice (25kg sacks)',
  category: 'Food',
  quantity: 640,
  reorderLevel: 200,
  unit: 'sacks',
  storageLocation: 'Colombo Central Warehouse',
  district: 'Colombo',
  loggedAt: hoursAgo(11)
},
{
  id: 'INV-804',
  itemName: 'Dry ration packs',
  category: 'Food',
  quantity: 95,
  reorderLevel: 300,
  unit: 'packs',
  storageLocation: 'Kalutara District Secretariat',
  district: 'Kalutara',
  loggedAt: hoursAgo(7)
},
{
  id: 'INV-805',
  itemName: 'First aid kits',
  category: 'Medicine',
  quantity: 42,
  reorderLevel: 60,
  unit: 'kits',
  storageLocation: 'Batticaloa Methodist Church',
  district: 'Batticaloa',
  loggedAt: hoursAgo(16)
},
{
  id: 'INV-806',
  itemName: 'Antibiotics (assorted)',
  category: 'Medicine',
  quantity: 310,
  reorderLevel: 150,
  unit: 'boxes',
  storageLocation: 'Colombo Central Warehouse',
  district: 'Colombo',
  loggedAt: hoursAgo(26)
},
{
  id: 'INV-807',
  itemName: 'Blankets',
  category: 'Clothing',
  quantity: 720,
  reorderLevel: 250,
  unit: 'units',
  storageLocation: 'Gampaha Youth Centre',
  district: 'Gampaha',
  loggedAt: hoursAgo(19)
},
{
  id: 'INV-808',
  itemName: "Children's clothing",
  category: 'Clothing',
  quantity: 130,
  reorderLevel: 200,
  unit: 'bundles',
  storageLocation: 'Ratnapura Town Hall Hub',
  district: 'Ratnapura',
  loggedAt: hoursAgo(30)
},
{
  id: 'INV-809',
  itemName: 'Tarpaulin sheets',
  category: 'Other',
  quantity: 260,
  reorderLevel: 100,
  unit: 'sheets',
  storageLocation: 'Batticaloa Methodist Church',
  district: 'Batticaloa',
  loggedAt: hoursAgo(38)
},
{
  id: 'INV-810',
  itemName: 'Mosquito nets',
  category: 'Other',
  quantity: 88,
  reorderLevel: 120,
  unit: 'units',
  storageLocation: 'Kalutara District Secretariat',
  district: 'Kalutara',
  loggedAt: hoursAgo(44)
}];