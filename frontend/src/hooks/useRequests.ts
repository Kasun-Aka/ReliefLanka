/**
 * useRequests.ts
 * Standalone hook for the Relief Requests module.
 *
 * Provides the same { items, create, update, remove } interface as the
 * in-memory Collection in ReliefDataContext, so Requests.tsx needs only
 * a one-line import change — the rest of the page is untouched.
 *
 * This hook does NOT touch ReliefDataContext, so other members'
 * in-memory Centers / Volunteers / Inventory data stays intact.
 */

import { useCallback, useEffect, useState } from 'react';
import type { ReliefRequest } from '../types/relief';
import * as api from '../services/requestsApi';

export type RequestsStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseRequestsResult {
  items: ReliefRequest[];
  status: RequestsStatus;
  error: string | null;
  /** Reload the full list from the API */
  reload: () => void;
  /** POST — adds to the top of the list on success */
  create: (item: ReliefRequest) => Promise<void>;
  /** PUT — patches the item in local state immediately, then persists */
  update: (id: string, patch: Partial<ReliefRequest>) => Promise<void>;
  /** DELETE — removes from local state on success */
  remove: (id: string) => Promise<void>;
}

export function useRequests(): UseRequestsResult {
  const [items, setItems] = useState<ReliefRequest[]>([]);
  const [status, setStatus] = useState<RequestsStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // ---- fetch ---------------------------------------------------------------
  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const data = await api.fetchRequests();
      setItems(data);
      setStatus('success');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Could not reach the server.';
      setError(msg);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ---- create --------------------------------------------------------------
  const create = useCallback(async (item: ReliefRequest) => {
    // Optimistic: prepend a placeholder; replace with real record on success
    setItems((prev) => [item, ...prev]);
    try {
      const saved = await api.createRequest({
        name: item.name,
        district: item.district,
        contactPhone: item.contactPhone,
        itemsNeeded: item.itemsNeeded,
        peopleAffected: item.peopleAffected,
        urgency: item.urgency,
      });
      // Replace the placeholder with the server-issued REQ-XXXXXX id
      setItems((prev) =>
        prev.map((r) => (r.id === item.id ? saved : r))
      );
    } catch (err: unknown) {
      // Rollback on failure
      setItems((prev) => prev.filter((r) => r.id !== item.id));
      throw err; // let Requests.tsx catch & show a toast
    }
  }, []);

  // ---- update --------------------------------------------------------------
  const update = useCallback(async (id: string, patch: Partial<ReliefRequest>) => {
    // Optimistic update in local state
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
    // Find the _mongoId needed for the PUT call
    setItems((prev) => {
      const target = prev.find((r) => r.id === id);
      if (!target?._mongoId) return prev; // no Mongo id yet — skip API call
      api
        .updateRequest(target._mongoId, patch)
        .then((saved) => {
          setItems((latest) =>
            latest.map((r) => (r.id === id ? saved : r))
          );
        })
        .catch(() => {
          // Revert optimistic update on failure
          setItems((latest) =>
            latest.map((r) => (r.id === id ? { ...r } : r))
          );
        });
      return prev; // return unchanged for this setState call
    });
  }, []);

  // ---- remove --------------------------------------------------------------
  const remove = useCallback(async (id: string) => {
    const target = items.find((r) => r.id === id);
    // Optimistic removal
    setItems((prev) => prev.filter((r) => r.id !== id));
    if (target?._mongoId) {
      try {
        await api.deleteRequest(target._mongoId);
      } catch (err: unknown) {
        // Revert on failure
        setItems((prev) => [target, ...prev]);
        throw err;
      }
    }
  }, [items]);

  return {
    items,
    status,
    error,
    reload: load,
    create,
    update,
    remove,
  };
}
