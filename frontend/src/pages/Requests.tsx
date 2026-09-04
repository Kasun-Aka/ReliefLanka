import React, { useMemo, useState } from 'react';
import { InboxIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { MetaStat, PageHeader } from '../components/shared/PageHeader';
import { FilterBar } from '../components/shared/FilterBar';
import { Button } from '../components/shared/Button';
import { Badge } from '../components/shared/Badge';
import { Select } from '../components/shared/Field';
import { TableShell, Td, Th } from '../components/shared/Table';
import { EmptyState } from '../components/shared/EmptyState';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { RequestFormModal } from '../components/requests/RequestFormModal';
import { RequestDetailModal } from '../components/requests/RequestDetailModal';
import { useReliefData } from '../contexts/ReliefDataContext';
import { DISTRICTS } from '../data/districts';
import { ReliefRequest, REQUEST_STATUSES, URGENCIES } from '../types/relief';
import { formatNumber, formatRelative, matches } from '../utils/format';
import { requestStatusTone, urgencyTone } from '../utils/tone';

export function Requests() {
  const { requests } = useReliefData();
  const [query, setQuery] = useState('');
  const [district, setDistrict] = useState('');
  const [urgency, setUrgency] = useState('');
  const [status, setStatus] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ReliefRequest | null>(null);
  const [selected, setSelected] = useState<ReliefRequest | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ReliefRequest | null>(null);

  const filtered = useMemo(
    () =>
    requests.items.filter(
      (request) =>
      matches([request.name, request.id, ...request.itemsNeeded], query) && (
      !district || request.district === district) && (
      !urgency || request.urgency === urgency) && (
      !status || request.status === status)
    ),
    [requests.items, query, district, urgency, status]
  );

  const pending = requests.items.filter((r) => r.status === 'Pending');
  const filtersActive = Boolean(query || district || urgency || status);

  const resetFilters = () => {
    setQuery('');
    setDistrict('');
    setUrgency('');
    setStatus('');
  };

  const save = (request: ReliefRequest) => {
    if (editing) {
      requests.update(request.id, request);
      toast.success(`Request ${request.id} updated`);
    } else {
      requests.create(request);
      toast.success(`Request ${request.id} logged for ${request.district}`);
    }
    setFormOpen(false);
    setEditing(null);
    setSelected(null);
  };

  const toggleStatus = (request: ReliefRequest) => {
    const next = request.status === 'Pending' ? 'Fulfilled' : 'Pending';
    requests.update(request.id, { status: next });
    setSelected({ ...request, status: next });
    toast.success(`${request.id} marked ${next.toLowerCase()}`);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    requests.remove(pendingDelete.id);
    toast.success(`Request ${pendingDelete.id} deleted`);
    setPendingDelete(null);
    setSelected(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Relief requests"
        description="Every assistance request logged from the field, ordered so the most urgent unmet needs surface first."
        meta={
        <>
            <MetaStat label="pending" value={String(pending.length)} />
            <MetaStat
            label="high urgency"
            value={String(pending.filter((r) => r.urgency === 'High').length)} />
          
            <MetaStat
            label="people awaiting help"
            value={formatNumber(
              pending.reduce((sum, r) => sum + r.peopleAffected, 0)
            )} />
          
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
            Log request
          </Button>
        } />
      

      <FilterBar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search name, ID or item"
        resultLabel={`${filtered.length} of ${requests.items.length} requests`}
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
          aria-label="Filter by urgency"
          className="w-36"
          options={URGENCIES}
          placeholder="Any urgency"
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)} />
        
        <Select
          aria-label="Filter by status"
          className="w-36"
          options={REQUEST_STATUSES}
          placeholder="Any status"
          value={status}
          onChange={(e) => setStatus(e.target.value)} />
        
      </FilterBar>

      {filtered.length === 0 ?
      <EmptyState
        icon={<InboxIcon className="h-7 w-7" />}
        title="No requests match these filters"
        description="Try widening the district or urgency filter, or log a new request from the field."
        action={
        filtersActive ?
        <Button onClick={resetFilters}>Clear filters</Button> :
        undefined
        } /> :


      <TableShell
        caption="Relief requests"
        head={
        <>
              <Th>Request</Th>
              <Th>District</Th>
              <Th>Items needed</Th>
              <Th align="right">People</Th>
              <Th>Urgency</Th>
              <Th>Status</Th>
              <Th align="right">Logged</Th>
            </>
        }>
        
          {filtered.map((request) =>
        <tr
          key={request.id}
          tabIndex={0}
          role="button"
          onClick={() => setSelected(request)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setSelected(request);
            }
          }}
          className="cursor-pointer transition-colors duration-150 ease-out hover:bg-brand-50/60">
          
              <Td>
                <span className="block font-medium text-ink">{request.name}</span>
                <span className="font-mono text-xs text-ink-faint">{request.id}</span>
              </Td>
              <Td>{request.district}</Td>
              <Td className="max-w-xs">
                <span className="block truncate text-ink-muted">
                  {request.itemsNeeded.join(', ')}
                </span>
              </Td>
              <Td align="right" className="font-mono">
                {formatNumber(request.peopleAffected)}
              </Td>
              <Td>
                <Badge tone={urgencyTone(request.urgency)} dot>
                  {request.urgency}
                </Badge>
              </Td>
              <Td>
                <Badge tone={requestStatusTone(request.status)}>{request.status}</Badge>
              </Td>
              <Td align="right" className="whitespace-nowrap text-xs text-ink-muted">
                {formatRelative(request.createdAt)}
              </Td>
            </tr>
        )}
        </TableShell>
      }

      <RequestFormModal
        open={formOpen}
        initial={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={save} />
      

      <RequestDetailModal
        request={pendingDelete || formOpen ? null : selected}
        onClose={() => setSelected(null)}
        onEdit={(request) => {
          setEditing(request);
          setFormOpen(true);
        }}
        onToggleStatus={toggleStatus}
        onDelete={setPendingDelete} />
      

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this request?"
        message={`Request ${pendingDelete?.id ?? ''} from ${pendingDelete?.name ?? ''} will be removed from the coordination board. This cannot be undone.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete} />
      
    </div>);

}