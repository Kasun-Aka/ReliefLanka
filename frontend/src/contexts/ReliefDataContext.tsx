import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Center,
  InventoryItem,
  ReliefRequest,
  Volunteer } from
'../types/relief';
import { seedRequests } from '../data/requests';
import {
  createCenter as createCenterApi,
  deleteCenter as deleteCenterApi,
  listCenters,
  updateCenter as updateCenterApi } from '../services/centers';
import { seedInventory } from '../data/inventory';
import { useAuth } from './AuthContext';
import {
  createVolunteer as createVolunteerApi,
  deleteVolunteer as deleteVolunteerApi,
  listVolunteers,
  updateVolunteer as updateVolunteerApi } from '../services/volunteers';

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
  const { token } = useAuth();
  const requests = useCollection<ReliefRequest>(seedRequests);
  const [centerItems, setCenterItems] = useState<Center[]>([]);
  const centers = useMemo(() => ({
    items: centerItems,
    create: async (center: Center) => {
      const created = await createCenterApi(center);
      setCenterItems((prev) => [created, ...prev]);
    },
    update: async (id: string, patch: Partial<Center>) => {
      const updated = await updateCenterApi(id, patch);
      setCenterItems((prev) => prev.map((item) => item.id === id ? updated : item));
    },
    remove: async (id: string) => {
      await deleteCenterApi(id);
      setCenterItems((prev) => prev.filter((item) => item.id !== id));
    }
  }), [centerItems]);
  const [volunteerItems, setVolunteerItems] = useState<Volunteer[]>([]);
  const volunteers = useMemo(() => ({
    items: volunteerItems,
    create: async (volunteer: Volunteer) => {
      const created = await createVolunteerApi(volunteer);
      setVolunteerItems((prev) => [created, ...prev]);
    },
    update: async (id: string, patch: Partial<Volunteer>) => {
      const updated = await updateVolunteerApi(id, patch);
      setVolunteerItems((prev) => prev.map((item) => item.id === id ? updated : item));
    },
    remove: async (id: string) => {
      await deleteVolunteerApi(id);
      setVolunteerItems((prev) => prev.filter((item) => item.id !== id));
    }
  }), [volunteerItems]);
  const inventory = useCollection<InventoryItem>(seedInventory);

  useEffect(() => {
    if (!token) {
      setVolunteerItems([]);
      setCenterItems([]);
      return;
    }
    listVolunteers().then(setVolunteerItems).catch(() => setVolunteerItems([]));
    listCenters().then(setCenterItems).catch(() => setCenterItems([]));
  }, [token]);

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