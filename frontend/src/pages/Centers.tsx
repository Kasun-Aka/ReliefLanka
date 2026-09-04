import React, { useMemo, useState } from 'react';
import {
  ClockIcon,
  MapPinIcon,
  PackageIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  Trash2Icon } from
'lucide-react';
import { toast } from 'sonner';
import { MetaStat, PageHeader } from '../components/shared/PageHeader';
import { FilterBar } from '../components/shared/FilterBar';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import { Select } from '../components/shared/Field';
import { EmptyState } from '../components/shared/EmptyState';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { CenterFormModal } from '../components/centers/CenterFormModal';
import { useReliefData } from '../contexts/ReliefDataContext';
import { DISTRICTS } from '../data/districts';
import { Center } from '../types/relief';
import { formatNumber, matches } from '../utils/format';
import { useAuth } from '../contexts/AuthContext';

const STATUS_OPTIONS = ['Accepting donations', 'Temporarily closed'];

export function Centers() {
  const { centers } = useReliefData();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [district, setDistrict] = useState('');
  const [status, setStatus] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Center | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Center | null>(null);

  const filtered = useMemo(
    () =>
    centers.items.filter(
      (center) =>
      matches([center.centerName, center.contactPerson, center.address], query) && (
      !district || center.district === district) && (
      !status || (
      status === 'Accepting donations' ? center.isActive : !center.isActive))
    ),
    [centers.items, query, district, status]
  );

  const active = centers.items.filter((c) => c.isActive);
  const filtersActive = Boolean(query || district || status);

  const resetFilters = () => {
    setQuery('');
    setDistrict('');
    setStatus('');
  };

  const save = async (center: Center) => {
    try {
      if (editing) {
        await centers.update(center.id, center);
        toast.success(`${center.centerName} updated`);
      } else {
        await centers.create(center);
        toast.success(`${center.centerName} added to the directory`);
      }
      setFormOpen(false);
      setEditing(null);
    } catch {
      toast.error('Could not save this center. Check the backend connection.');
    }
  };

  const toggleActive = async (center: Center) => {
    try {
      await centers.update(center.id, { isActive: !center.isActive });
      toast.success(
        center.isActive ?
        `${center.centerName} marked temporarily closed` :
        `${center.centerName} is accepting donations again`
      );
    } catch {
      toast.error('Could not update this center.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Drop-off collection centers"
        description="The public directory of donation hubs. Donors use it to find where to hand over supplies; coordinators use it to see which districts still have intake capacity."
        meta={
        <>
            <MetaStat label="accepting donations" value={String(active.length)} />
            <MetaStat
            label="districts covered"
            value={String(new Set(active.map((c) => c.district)).size)} />
          
            <MetaStat
            label="daily intake capacity"
            value={formatNumber(active.reduce((sum, c) => sum + c.capacity, 0))} />
          
          </>
        }
        action={
        user?.role !== 'coordinator' &&
        <Button
          variant="primary"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}>
          
            <PlusIcon className="h-4 w-4" />
            Register center
          </Button>
        } />
      

      <FilterBar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search center, contact or address"
        resultLabel={`${filtered.length} of ${centers.items.length} centers`}
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
          aria-label="Filter by intake status"
          className="w-52"
          options={STATUS_OPTIONS}
          placeholder="Any intake status"
          value={status}
          onChange={(e) => setStatus(e.target.value)} />
        
      </FilterBar>

      {filtered.length === 0 ?
      <EmptyState
        icon={<PackageIcon className="h-7 w-7" />}
        title="No centers match these filters"
        description="Widen the district filter, or register a new drop-off point for this area."
        action={
        filtersActive ?
        <Button onClick={resetFilters}>Clear filters</Button> :
        user?.role !== 'coordinator' ?
        <Button variant="primary" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <PlusIcon className="h-4 w-4" />
          Register a drop-off center
        </Button> :
        undefined
        } /> :


      <ul className="flex flex-col gap-3">
          {filtered.map((center) => {
          const utilisation = Math.min(
            100,
            Math.round(center.intakeToday / center.capacity * 100)
          );
          const nearFull = utilisation >= 85;
          return (
            <li
              key={center.id}
              className="rounded-lg border border-line bg-surface p-5 shadow-panel">
              
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold text-ink">
                        {center.centerName}
                      </h2>
                      <Badge tone={center.isActive ? 'success' : 'neutral'} dot>
                        {center.isActive ? 'Accepting donations' : 'Temporarily closed'}
                      </Badge>
                      {center.isActive && nearFull &&
                    <Badge tone="warning">Near capacity</Badge>
                    }
                    </div>
                    <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-ink-muted">
                        <MapPinIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <dt className="sr-only">Location</dt>
                        <dd>
                          {center.address ? `${center.address}, ` : ''}
                          <span className="font-medium text-ink">{center.district}</span>
                        </dd>
                      </div>
                      <div className="flex items-center gap-2 text-ink-muted">
                        <PhoneIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <dt className="sr-only">Contact</dt>
                        <dd>
                          {center.contactPerson} ·{' '}
                          <span className="font-mono text-xs">{center.contactPhone}</span>
                        </dd>
                      </div>
                      <div className="flex items-center gap-2 text-ink-muted">
                        <ClockIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <dt className="sr-only">Operating hours</dt>
                        <dd>{center.operatingHours}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="w-full shrink-0 lg:w-64">
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-ink-muted">Intake today</span>
                      <span className="font-mono text-ink">
                        {formatNumber(center.intakeToday)} / {formatNumber(center.capacity)}
                      </span>
                    </div>
                    <div
                    className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line"
                    role="img"
                    aria-label={`${utilisation}% of daily capacity used`}>
                    
                      <div
                      className={`h-full rounded-full ${
                      nearFull ? 'bg-caution-600' : 'bg-brand-600'}`
                      }
                      style={{ width: `${utilisation}%` }} />
                    
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {user?.role !== 'coordinator' && center.ownerId === user?.id && <Button size="sm" onClick={() => toggleActive(center)}>
                        {center.isActive ? 'Mark closed' : 'Reopen'}
                      </Button>}
                      {user?.role !== 'coordinator' && center.ownerId === user?.id && <Button
                      size="sm"
                      onClick={() => {
                        setEditing(center);
                        setFormOpen(true);
                      }}>
                      
                        <PencilIcon className="h-3.5 w-3.5" />
                        Edit
                      </Button>}
                      {(user?.role === 'coordinator' || center.ownerId === user?.id) && <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setPendingDelete(center)}
                      aria-label={`Delete ${center.centerName}`}>
                      
                        <Trash2Icon className="h-3.5 w-3.5" />
                      </Button>}
                    </div>
                  </div>
                </div>
              </li>);

        })}
        </ul>
      }

      <CenterFormModal
        open={formOpen}
        initial={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={save} />
      

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove this drop-off center?"
        message={`${pendingDelete?.centerName ?? ''} will disappear from the public donation directory immediately.`}
        confirmLabel="Remove center"
        onCancel={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return;
          try {
            await centers.remove(pendingDelete.id);
            toast.success(`${pendingDelete.centerName} removed`);
            setPendingDelete(null);
          } catch {
            toast.error('Could not remove this center.');
          }
        }} />
      
    </div>);

}