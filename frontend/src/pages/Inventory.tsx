import React, { useMemo, useState, useEffect } from 'react';
import {
  AlertTriangleIcon,
  BoxesIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon } from
'lucide-react';
import { toast } from 'sonner';
import { MetaStat, PageHeader } from '../components/shared/PageHeader';
import { FilterBar } from '../components/shared/FilterBar';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import { Select } from '../components/shared/Field';
import { TableShell, Td, Th } from '../components/shared/Table';
import { EmptyState } from '../components/shared/EmptyState';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { InventoryFormModal } from '../components/inventory/InventoryFormModal';
import { useReliefData } from '../contexts/ReliefDataContext';
import { DISTRICTS } from '../data/districts';
import { INVENTORY_CATEGORIES, InventoryItem } from '../types/relief';
import { formatNumber, formatRelative, matches } from '../utils/format';
import { categoryTone } from '../utils/tone';
import { inventoryService } from '../services/inventoryService';

export function Inventory() {
  const { inventory } = useReliefData();
  const [query, setQuery] = useState('');
  const [district, setDistrict] = useState('');
  const [category, setCategory] = useState('');
  const [lowOnly, setLowOnly] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<InventoryItem | null>(null);

  useEffect(() => {
    inventoryService.getAll().then((data) => {
      inventory.setAll(data);
    }).catch(err => {
      console.error(err);
      toast.error('Failed to fetch inventory from server');
    });
  }, []);

  const lowStock = inventory.items.filter((i) => i.quantity < i.reorderLevel);

  const filtered = useMemo(
    () =>
    inventory.items.filter(
      (item) =>
      matches([item.itemName, item.storageLocation, item.category], query) && (
      !district || item.district === district) && (
      !category || item.category === category) && (
      !lowOnly || item.quantity < item.reorderLevel)
    ),
    [inventory.items, query, district, category, lowOnly]
  );

  const filtersActive = Boolean(query || district || category || lowOnly);

  const resetFilters = () => {
    setQuery('');
    setDistrict('');
    setCategory('');
    setLowOnly(false);
  };

  const save = async (item: InventoryItem) => {
    try {
      if (editing) {
        const updated = await inventoryService.update(item.id, item);
        inventory.update(updated.id, updated);
        toast.success(`${updated.itemName} stock updated`);
      } else {
        const { id, loggedAt, ...data } = item;
        const created = await inventoryService.create(data as any);
        inventory.create(created);
        toast.success(`${created.itemName} logged in ${created.district}`);
      }
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save inventory item');
    }
  };

  const remove = async (item: InventoryItem) => {
    try {
      await inventoryService.delete(item.id);
      inventory.remove(item.id);
      toast.success(`${item.itemName} removed from inventory`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete item');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Resource & inventory"
        description="What relief stock exists, in what quantity, and in which district — the supply side that pending requests are matched against."
        meta={
        <>
            <MetaStat label="stock lines" value={String(inventory.items.length)} />
            <MetaStat
            label="districts stocked"
            value={String(new Set(inventory.items.map((i) => i.district)).size)} />
          
            <MetaStat label="below reorder level" value={String(lowStock.length)} />
          </>
        }
        action={
        <Button
          variant="primary"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}>
          
            <PlusIcon className="h-4 w-4" />
            Log stock
          </Button>
        } />
      

      {lowStock.length > 0 && !lowOnly &&
      <div className="flex flex-col gap-3 rounded-lg border border-caution-200 bg-caution-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2.5 text-sm text-caution-600">
            <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              <span className="font-semibold">{lowStock.length} stock lines</span> are
              below their reorder level, across{' '}
              {new Set(lowStock.map((i) => i.district)).size} districts.
            </span>
          </p>
          <Button size="sm" onClick={() => setLowOnly(true)}>
            Show low stock only
          </Button>
        </div>
      }

      <FilterBar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search item or storage location"
        resultLabel={`${filtered.length} of ${inventory.items.length} stock lines`}
        onReset={resetFilters}
        showReset={filtersActive}>
        
        <Select
          aria-label="Filter by district"
          className="w-44"
          options={DISTRICTS}
          placeholder="All districts"
          value={district}
          onChange={(e) => setDistrict(e.target.value)} />
        
        <Select
          aria-label="Filter by category"
          className="w-40"
          options={INVENTORY_CATEGORIES}
          placeholder="Any category"
          value={category}
          onChange={(e) => setCategory(e.target.value)} />
        
        <label className="inline-flex h-9 items-center gap-2 rounded border border-line-strong bg-white px-3 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={lowOnly}
            onChange={(e) => setLowOnly(e.target.checked)}
            className="h-4 w-4 rounded border-line-strong text-brand-700 focus:ring-brand-600" />
          
          Low stock only
        </label>
      </FilterBar>

      {filtered.length === 0 ?
      <EmptyState
        icon={<BoxesIcon className="h-7 w-7" />}
        title="No stock matches these filters"
        description="Nothing is logged against this combination yet. Log stock as it arrives at a storage point."
        action={
        filtersActive ?
        <Button onClick={resetFilters}>Clear filters</Button> :
        undefined
        } /> :


      <TableShell
        caption="Relief inventory"
        head={
        <>
              <Th>Item</Th>
              <Th>Category</Th>
              <Th>District</Th>
              <Th>Storage location</Th>
              <Th align="right">Stock level</Th>
              <Th align="right">Updated</Th>
              <Th align="right">Actions</Th>
            </>
        }>
        
          {filtered.map((item) => {
          const low = item.quantity < item.reorderLevel;
          const ratio = Math.min(
            100,
            Math.round(item.quantity / Math.max(1, item.reorderLevel * 2) * 100)
          );
          return (
            <tr key={item.id} className="transition-colors duration-150 ease-out hover:bg-brand-50/60">
                <Td>
                  <span className="block font-medium text-ink">{item.itemName}</span>
                  <span className="font-mono text-xs text-ink-faint">{item.id}</span>
                </Td>
                <Td>
                  <Badge tone={categoryTone(item.category)}>{item.category}</Badge>
                </Td>
                <Td>{item.district}</Td>
                <Td className="text-ink-muted">{item.storageLocation}</Td>
                <Td align="right">
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="font-mono text-sm text-ink">
                      {formatNumber(item.quantity)} {item.unit}
                    </span>
                    <div className="h-1 w-28 overflow-hidden rounded-full bg-line">
                      <div
                      className={`h-full rounded-full ${
                      low ? 'bg-signal-600' : 'bg-ok-600'}`
                      }
                      style={{ width: `${Math.max(4, ratio)}%` }} />
                    
                    </div>
                    <span
                    className={`text-[11px] ${low ? 'text-signal-600' : 'text-ink-faint'}`}>
                    
                      {low ? 'Below' : 'Above'} reorder level of{' '}
                      {formatNumber(item.reorderLevel)}
                    </span>
                  </div>
                </Td>
                <Td align="right" className="whitespace-nowrap text-xs text-ink-muted">
                  {formatRelative(item.loggedAt)}
                </Td>
                <Td align="right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                    size="sm"
                    variant="ghost"
                    aria-label={`Edit ${item.itemName}`}
                    onClick={() => {
                      setEditing(item);
                      setFormOpen(true);
                    }}>
                    
                      <PencilIcon className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                    size="sm"
                    variant="ghost"
                    aria-label={`Delete ${item.itemName}`}
                    onClick={() => setPendingDelete(item)}
                    className="hover:text-signal-600">
                    
                      <Trash2Icon className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Td>
              </tr>);

        })}
        </TableShell>
      }

      <InventoryFormModal
        open={formOpen}
        initial={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={save} />
      

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this stock line?"
        message={`${pendingDelete?.itemName ?? ''} at ${pendingDelete?.storageLocation ?? ''} will no longer count towards district stock.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          remove(pendingDelete).then(() => setPendingDelete(null));
        }} />
      
    </div>);

}