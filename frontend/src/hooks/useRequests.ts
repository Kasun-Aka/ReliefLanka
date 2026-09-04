import { useCallback, useEffect, useReducer } from 'react';
import { ReliefRequest } from '../types/relief';
import { requestsService } from '../services/requestsService';

type Status = 'loading' | 'success' | 'error';

interface State {
  items: ReliefRequest[];
  status: Status;
  error: string | null;
}

type Action =
  | { type: 'LOADING' }
  | { type: 'LOADED'; items: ReliefRequest[] }
  | { type: 'ERROR'; message: string }
  | { type: 'CREATE'; item: ReliefRequest }
  | { type: 'UPDATE'; id: string; patch: Partial<ReliefRequest> }
  | { type: 'REMOVE'; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOADING':
      return { ...state, status: 'loading', error: null };
    case 'LOADED':
      return { items: action.items, status: 'success', error: null };
    case 'ERROR':
      return { ...state, status: 'error', error: action.message };
    case 'CREATE':
      return { ...state, items: [action.item, ...state.items] };
    case 'UPDATE':
      return {
        ...state,
        items: state.items.map((r) =>
          r.id === action.id ? { ...r, ...action.patch } : r
        ),
      };
    case 'REMOVE':
      return { ...state, items: state.items.filter((r) => r.id !== action.id) };
    default:
      return state;
  }
}

export function useRequests() {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    status: 'loading',
    error: null,
  });

  const load = useCallback(async () => {
    dispatch({ type: 'LOADING' });
    try {
      const items = await requestsService.getAll();
      dispatch({ type: 'LOADED', items });
    } catch (err: any) {
      dispatch({ type: 'ERROR', message: err.message ?? 'Failed to load requests' });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(async (item: ReliefRequest) => {
    const { id, createdAt, ...body } = item;
    const created = await requestsService.create(body);
    dispatch({ type: 'CREATE', item: created });
    return created;
  }, []);

  const update = useCallback(async (id: string, patch: Partial<ReliefRequest>) => {
    const updated = await requestsService.update(id, patch);
    dispatch({ type: 'UPDATE', id, patch: updated });
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    await requestsService.delete(id);
    dispatch({ type: 'REMOVE', id });
  }, []);

  return {
    items: state.items,
    status: state.status,
    error: state.error,
    reload: load,
    create,
    update,
    remove,
  };
}
