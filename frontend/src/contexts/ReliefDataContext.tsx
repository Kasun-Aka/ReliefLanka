import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import {
  Center,
  InventoryItem,
  ReliefRequest,
  Volunteer
} from '../types/relief';
import { requestsService } from '../services/requestsService';
import { centersService } from '../services/centersService';
import { volunteersService } from '../services/volunteersService';
import { inventoryService } from '../services/inventoryService';

interface Entity {
  id: string;
}

interface Collection<T extends Entity, OmitType = Omit<T, 'id'>> {
  items: T[];
  create: (item: OmitType) => Promise<void>;
  update: (id: string, patch: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
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
  loading: boolean;
  requests: Collection<ReliefRequest, Omit<ReliefRequest, 'id' | 'createdAt'>>;
  centers: Collection<Center, Omit<Center, 'id'>>;
  volunteers: Collection<Volunteer, Omit<Volunteer, 'id'>>;
  inventory: Collection<InventoryItem, Omit<InventoryItem, 'id' | 'lastUpdated'>>;
  districtSnapshots: DistrictSnapshot[];
  refreshData: () => Promise<void>;
}

const ReliefDataContext = createContext<ReliefDataValue | null>(null);

function useAsyncCollection<T extends Entity, OmitType>(
  initialData: T[],
  apiService: {
    create: (data: OmitType) => Promise<T>;
    update: (id: string, patch: Partial<T>) => Promise<T>;
    delete: (id: string) => Promise<void>;
  }
) {
  const [items, setItems] = useState<T[]>(initialData);

  // When initial data updates, sync state
  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  const create = useCallback(async (item: OmitType) => {
    const created = await apiService.create(item);
    setItems((prev) => [created, ...prev]);
  }, [apiService]);

  const update = useCallback(async (id: string, patch: Partial<T>) => {
    const updated = await apiService.update(id, patch);
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
  }, [apiService]);

  const remove = useCallback(async (id: string) => {
    await apiService.delete(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, [apiService]);

  return useMemo(
    () => ({ items, create, update, remove }),
    [items, create, update, remove]
  );
}

export function ReliefDataProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [initialRequests, setInitialRequests] = useState<ReliefRequest[]>([]);
  const [initialCenters, setInitialCenters] = useState<Center[]>([]);
  const [initialVolunteers, setInitialVolunteers] = useState<Volunteer[]>([]);
  const [initialInventory, setInitialInventory] = useState<InventoryItem[]>([]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [reqs, cents, vols, invs] = await Promise.all([
        requestsService.getAll(),
        centersService.getAll(),
        volunteersService.getAll(),
        inventoryService.getAll(),
      ]);
      setInitialRequests(reqs);
      setInitialCenters(cents);
      setInitialVolunteers(vols);
      setInitialInventory(invs);
    } catch (error) {
      console.error('Failed to load relief data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const requests = useAsyncCollection<ReliefRequest, Omit<ReliefRequest, 'id' | 'createdAt'>>(initialRequests, requestsService);
  const centers = useAsyncCollection<Center, Omit<Center, 'id'>>(initialCenters, centersService);
  const volunteers = useAsyncCollection<Volunteer, Omit<Volunteer, 'id'>>(initialVolunteers, volunteersService);
  const inventory = useAsyncCollection<InventoryItem, Omit<InventoryItem, 'id' | 'lastUpdated'>>(initialInventory, inventoryService);

  const districtSnapshots = useMemo<DistrictSnapshot[]>(() => {
    const active = new Set<string>();
    requests.items.forEach((r) => active.add(r.district));
    centers.items.forEach((c) => active.add(c.district));
    volunteers.items.forEach((v) => active.add(v.preferredDistrict));
    inventory.items.forEach((i) => active.add(i.district));

    return Array.from(active)
      .map((district) => {
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
        const lowStockItems = districtStock.filter((i) => i.quantity < i.reorderLevel).length;

        const coverage: DistrictSnapshot['coverage'] =
          highUrgency > 0 && (activeCenters === 0 || availableVolunteers === 0)
            ? 'Critical'
            : districtRequests.length > 0 && (lowStockItems > 0 || availableVolunteers < 2)
            ? 'Strained'
            : 'Covered';

        return {
          district,
          pendingRequests: districtRequests.length,
          highUrgency,
          peopleAffected: districtRequests.reduce((sum, r) => sum + r.peopleAffected, 0),
          activeCenters,
          availableVolunteers,
          stockUnits: districtStock.reduce((sum, i) => sum + i.quantity, 0),
          lowStockItems,
          coverage,
        };
      })
      .sort(
        (a, b) =>
          b.highUrgency - a.highUrgency ||
          b.pendingRequests - a.pendingRequests ||
          a.district.localeCompare(b.district)
      );
  }, [requests.items, centers.items, volunteers.items, inventory.items]);

  const value = useMemo<ReliefDataValue>(
    () => ({ loading, requests, centers, volunteers, inventory, districtSnapshots, refreshData: fetchAll }),
    [loading, requests, centers, volunteers, inventory, districtSnapshots, fetchAll]
  );

  return (
    <ReliefDataContext.Provider value={value}>{children}</ReliefDataContext.Provider>
  );
}

export function useReliefData(): ReliefDataValue {
  const ctx = useContext(ReliefDataContext);
  if (!ctx) {
    throw new Error('useReliefData must be used inside a ReliefDataProvider');
  }
  return ctx;
}