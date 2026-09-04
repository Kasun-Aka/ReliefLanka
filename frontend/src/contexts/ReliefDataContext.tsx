import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  Center,
  InventoryItem,
  ReliefRequest,
  Volunteer } from
'../types/relief';
import { seedRequests } from '../data/requests';
import { seedCenters } from '../data/centers';
import { seedVolunteers } from '../data/volunteers';
import { seedInventory } from '../data/inventory';

interface Entity {
  id: string;
}

interface Collection<T extends Entity> {
  items: T[];
  create: (item: T) => void;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
}

function useCollection<T extends Entity>(seed: T[]): Collection<T> {
  const [items, setItems] = useState<T[]>(seed);

  const create = useCallback((item: T) => {
    setItems((prev) => [item, ...prev]);
  }, []);

  const update = useCallback((id: string, patch: Partial<T>) => {
    setItems((prev) =>
    prev.map((item) => item.id === id ? { ...item, ...patch } : item)
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return useMemo(
    () => ({ items, create, update, remove }),
    [items, create, update, remove]
  );
}

export interface DistrictSnapshot {
  district: string;
  pendingRequests: number;
  highUrgency: number;
  peopleAffected: number;
  activeCenters: number;
  availableVolunteers: number;
  stockUnits: number;
  lowStockItems: number;
  coverage: 'Critical' | 'Strained' | 'Covered';
}

interface ReliefDataValue {
  requests: Collection<ReliefRequest>;
  centers: Collection<Center>;
  volunteers: Collection<Volunteer>;
  inventory: Collection<InventoryItem>;
  districtSnapshots: DistrictSnapshot[];
}

const ReliefDataContext = createContext<ReliefDataValue | null>(null);

export function ReliefDataProvider({ children }: {children: React.ReactNode;}) {
  const requests = useCollection<ReliefRequest>(seedRequests);
  const centers = useCollection<Center>(seedCenters);
  const volunteers = useCollection<Volunteer>(seedVolunteers);
  const inventory = useCollection<InventoryItem>(seedInventory);

  const districtSnapshots = useMemo<DistrictSnapshot[]>(() => {
    const active = new Set<string>();
    requests.items.forEach((r) => active.add(r.district));
    centers.items.forEach((c) => active.add(c.district));
    volunteers.items.forEach((v) => active.add(v.preferredDistrict));
    inventory.items.forEach((i) => active.add(i.district));

    return Array.from(active).
    map((district) => {
      const districtRequests = requests.items.filter(
        (r) => r.district === district && r.status === 'Pending'
      );
      const highUrgency = districtRequests.filter((r) => r.urgency === 'High').length;
      const activeCenters = centers.items.filter(
        (c) => c.district === district && c.isActive
      ).length;
      const availableVolunteers = volunteers.items.filter(
        (v) => v.preferredDistrict === district && v.availability === 'Available'
      ).length;
      const districtStock = inventory.items.filter((i) => i.district === district);
      const lowStockItems = districtStock.filter(
        (i) => i.quantity < i.reorderLevel
      ).length;

      const coverage: DistrictSnapshot['coverage'] =
      highUrgency > 0 && (activeCenters === 0 || availableVolunteers === 0) ?
      'Critical' :
      districtRequests.length > 0 && (lowStockItems > 0 || availableVolunteers < 2) ?
      'Strained' :
      'Covered';

      return {
        district,
        pendingRequests: districtRequests.length,
        highUrgency,
        peopleAffected: districtRequests.reduce((sum, r) => sum + r.peopleAffected, 0),
        activeCenters,
        availableVolunteers,
        stockUnits: districtStock.reduce((sum, i) => sum + i.quantity, 0),
        lowStockItems,
        coverage
      };
    }).
    sort(
      (a, b) =>
      b.highUrgency - a.highUrgency ||
      b.pendingRequests - a.pendingRequests ||
      a.district.localeCompare(b.district)
    );
  }, [requests.items, centers.items, volunteers.items, inventory.items]);

  const value = useMemo<ReliefDataValue>(
    () => ({ requests, centers, volunteers, inventory, districtSnapshots }),
    [requests, centers, volunteers, inventory, districtSnapshots]
  );

  return (
    <ReliefDataContext.Provider value={value}>{children}</ReliefDataContext.Provider>);

}

export function useReliefData(): ReliefDataValue {
  const ctx = useContext(ReliefDataContext);
  if (!ctx) {
    throw new Error('useReliefData must be used inside a ReliefDataProvider');
  }
  return ctx;
}