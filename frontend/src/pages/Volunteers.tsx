import React, { useMemo, useState } from 'react';
import { PencilIcon, PlusIcon, Trash2Icon, UsersIcon } from 'lucide-react';
import { toast } from 'sonner';
import { MetaStat, PageHeader } from '../components/shared/PageHeader';
import { FilterBar } from '../components/shared/FilterBar';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import { Select } from '../components/shared/Field';
import { TableShell, Td, Th } from '../components/shared/Table';
import { EmptyState } from '../components/shared/EmptyState';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { VolunteerFormModal } from '../components/volunteers/VolunteerFormModal';
import { useReliefData } from '../contexts/ReliefDataContext';
import { DISTRICTS } from '../data/districts';
import { AVAILABILITIES, Volunteer, VOLUNTEER_SKILLS } from '../types/relief';
import { formatRelative, matches } from '../utils/format';
import { availabilityTone } from '../utils/tone';

export function Volunteers() {
  const { volunteers } = useReliefData();
  const [query, setQuery] = useState('');
  const [district, setDistrict] = useState('');
  const [skill, setSkill] = useState('');
  const [availability, setAvailability] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Volunteer | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Volunteer | null>(null);

  const filtered = useMemo(
    () =>
    volunteers.items.filter(
      (volunteer) =>
      matches([volunteer.name, volunteer.phone, ...volunteer.skills], query) && (
      !district || volunteer.preferredDistrict === district) && (
      !skill || (volunteer.skills as string[]).includes(skill)) && (
      !availability || volunteer.availability === availability)
    ),
    [volunteers.items, query, district, skill, availability]
  );

  const availableCount = volunteers.items.filter(
    (v) => v.availability === 'Available'
  ).length;
  const medicalAvailable = volunteers.items.filter(
    (v) => v.availability === 'Available' && v.skills.includes('Medical')
  ).length;
  const filtersActive = Boolean(query || district || skill || availability);

  const resetFilters = () => {
    setQuery('');
    setDistrict('');
    setSkill('');
    setAvailability('');
  };

  const save = (volunteer: Volunteer) => {
    if (editing) {
      volunteers.update(volunteer.id, volunteer);
      toast.success(`${volunteer.name} updated`);
    } else {
      volunteers.create(volunteer);
      toast.success(`${volunteer.name} registered for ${volunteer.preferredDistrict}`);
    }
    setFormOpen(false);
    setEditing(null);
  };

  const toggleAvailability = (volunteer: Volunteer) => {
    const next = volunteer.availability === 'Available' ? 'Deployed' : 'Available';
    volunteers.update(volunteer.id, { availability: next });
    toast.success(
      next === 'Deployed' ?
      `${volunteer.name} deployed to ${volunteer.preferredDistrict}` :
      `${volunteer.name} is back on the available roster`
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Volunteer roster"
        description="Who is registered, what they can do, and where they can get to. Coordinators deploy from this list and stand people down when a district is covered."
        meta={
        <>
            <MetaStat label="available now" value={String(availableCount)} />
            <MetaStat
            label="currently deployed"
            value={String(volunteers.items.length - availableCount)} />
          
            <MetaStat label="medical-trained available" value={String(medicalAvailable)} />
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
            Register volunteer
          </Button>
        } />
      

      <FilterBar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search name, phone or skill"
        resultLabel={`${filtered.length} of ${volunteers.items.length} volunteers`}
        onReset={resetFilters}
        showReset={filtersActive}>
        
        <Select
          aria-label="Filter by preferred district"
          className="w-44"
          options={DISTRICTS}
          placeholder="All districts"
          value={district}
          onChange={(e) => setDistrict(e.target.value)} />
        
        <Select
          aria-label="Filter by skill"
          className="w-40"
          options={VOLUNTEER_SKILLS}
          placeholder="Any skill"
          value={skill}
          onChange={(e) => setSkill(e.target.value)} />
        
        <Select
          aria-label="Filter by availability"
          className="w-40"
          options={AVAILABILITIES}
          placeholder="Any status"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)} />
        
      </FilterBar>

      {filtered.length === 0 ?
      <EmptyState
        icon={<UsersIcon className="h-7 w-7" />}
        title="No volunteers match these filters"
        description="Try a different district or skill, or register someone new to the roster."
        action={
        filtersActive ?
        <Button onClick={resetFilters}>Clear filters</Button> :
        undefined
        } /> :


      <TableShell
        caption="Registered volunteers"
        head={
        <>
              <Th>Volunteer</Th>
              <Th>Preferred district</Th>
              <Th>Skills</Th>
              <Th>Status</Th>
              <Th>Registered</Th>
              <Th align="right">Actions</Th>
            </>
        }>
        
          {filtered.map((volunteer) =>
        <tr key={volunteer.id} className="transition-colors duration-150 ease-out hover:bg-brand-50/60">
              <Td>
                <span className="block font-medium text-ink">{volunteer.name}</span>
                <span className="font-mono text-xs text-ink-faint">{volunteer.phone}</span>
              </Td>
              <Td>{volunteer.preferredDistrict}</Td>
              <Td>
                <div className="flex flex-wrap gap-1.5">
                  {volunteer.skills.map((s) =>
              <Badge key={s} tone={s === 'Medical' ? 'danger' : 'neutral'}>
                      {s}
                    </Badge>
              )}
                </div>
              </Td>
              <Td>
                <Badge tone={availabilityTone(volunteer.availability)} dot>
                  {volunteer.availability}
                </Badge>
              </Td>
              <Td className="whitespace-nowrap text-xs text-ink-muted">
                {formatRelative(volunteer.createdAt)}
              </Td>
              <Td align="right">
                <div className="flex items-center justify-end gap-1.5">
                  <Button size="sm" onClick={() => toggleAvailability(volunteer)}>
                    {volunteer.availability === 'Available' ? 'Deploy' : 'Stand down'}
                  </Button>
                  <Button
                size="sm"
                variant="ghost"
                aria-label={`Edit ${volunteer.name}`}
                onClick={() => {
                  setEditing(volunteer);
                  setFormOpen(true);
                }}>
                
                    <PencilIcon className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                size="sm"
                variant="ghost"
                aria-label={`Remove ${volunteer.name}`}
                onClick={() => setPendingDelete(volunteer)}
                className="hover:text-signal-600">
                
                    <Trash2Icon className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Td>
            </tr>
        )}
        </TableShell>
      }

      <VolunteerFormModal
        open={formOpen}
        initial={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={save} />
      

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove this volunteer?"
        message={`${pendingDelete?.name ?? ''} will be removed from the roster and can no longer be deployed.`}
        confirmLabel="Remove volunteer"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          volunteers.remove(pendingDelete.id);
          toast.success(`${pendingDelete.name} removed from the roster`);
          setPendingDelete(null);
        }} />
      
    </div>);

}