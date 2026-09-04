import React from 'react';
import { CheckCircle2Icon, PencilIcon, RotateCcwIcon, Trash2Icon } from 'lucide-react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';
import { ReliefRequest } from '../../types/relief';
import { useReliefData } from '../../contexts/ReliefDataContext';
import { formatDate, formatNumber, formatRelative } from '../../utils/format';
import { requestStatusTone, urgencyTone } from '../../utils/tone';

interface RequestDetailModalProps {
  request: ReliefRequest | null;
  onClose: () => void;
  onEdit: (request: ReliefRequest) => void;
  onToggleStatus: (request: ReliefRequest) => void;
  onDelete: (request: ReliefRequest) => void;
  canManage?: boolean;
}

function Detail({ label, value }: {label: string;value: React.ReactNode;}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-ink">{value}</dd>
    </div>);

}

export function RequestDetailModal({
  request,
  onClose,
  onEdit,
  onToggleStatus,
  onDelete,
  canManage = false
}: RequestDetailModalProps) {
  const { centers, volunteers, inventory } = useReliefData();
  if (!request) return null;

  const districtCenters = centers.items.filter(
    (c) => c.district === request.district && c.isActive
  );
  const districtVolunteers = volunteers.items.filter(
    (v) => v.preferredDistrict === request.district && v.availability === 'Available'
  );
  const districtStock = inventory.items.filter((i) => i.district === request.district);

  return (
    <Modal
      open={Boolean(request)}
      width="lg"
      title={`${request.id} · ${request.name}`}
      description={`${request.district} district · logged ${formatRelative(request.createdAt)}`}
      onClose={onClose}
      footer={
      <>
          {canManage && <Button
          variant="danger"
          onClick={() => onDelete(request)}
          className="mr-auto">
          
            <Trash2Icon className="h-3.5 w-3.5" />
            Delete
          </Button>}
          {canManage && <Button onClick={() => onEdit(request)}>
            <PencilIcon className="h-3.5 w-3.5" />
            Edit
          </Button>}
          {canManage && <Button variant="primary" onClick={() => onToggleStatus(request)}>
            {request.status === 'Pending' ?
          <>
                <CheckCircle2Icon className="h-3.5 w-3.5" />
                Mark fulfilled
              </> :

          <>
                <RotateCcwIcon className="h-3.5 w-3.5" />
                Reopen request
              </>
          }
          </Button>}
        </>
      }>
      
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={urgencyTone(request.urgency)} dot>
          {request.urgency} urgency
        </Badge>
        <Badge tone={requestStatusTone(request.status)}>{request.status}</Badge>
        <span className="text-xs text-ink-faint">
          Submitted {formatDate(request.createdAt)}
        </span>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        <Detail label="District" value={request.district} />
        <Detail
          label="Contact"
          value={<span className="font-mono text-sm">{request.contactPhone}</span>} />
        
        <Detail
          label="People affected"
          value={formatNumber(request.peopleAffected)} />
        
      </dl>

      <div className="mt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Items needed
        </h3>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {request.itemsNeeded.map((item) =>
          <li
            key={item}
            className="rounded border border-line bg-subtle px-2 py-1 text-xs text-ink">
            
              {item}
            </li>
          )}
        </ul>
      </div>

      <section className="mt-6 rounded-lg border border-line bg-subtle p-4">
        <h3 className="text-sm font-semibold text-ink">
          What {request.district} has right now
        </h3>
        <p className="mt-0.5 text-xs text-ink-muted">
          Read-only district context pulled from the other three modules.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded border border-line bg-surface p-3">
            <p className="font-mono text-lg text-ink">{districtCenters.length}</p>
            <p className="text-xs text-ink-muted">active drop-off centers</p>
          </div>
          <div className="rounded border border-line bg-surface p-3">
            <p className="font-mono text-lg text-ink">{districtVolunteers.length}</p>
            <p className="text-xs text-ink-muted">volunteers available</p>
          </div>
          <div className="rounded border border-line bg-surface p-3">
            <p className="font-mono text-lg text-ink">{districtStock.length}</p>
            <p className="text-xs text-ink-muted">stock lines held</p>
          </div>
        </div>
        {districtStock.length > 0 &&
        <ul className="mt-3 divide-y divide-line border-t border-line pt-1 text-sm">
            {districtStock.slice(0, 4).map((item) =>
          <li key={item.id} className="flex items-center justify-between py-1.5">
                <span className="text-ink">{item.itemName}</span>
                <span className="font-mono text-xs text-ink-muted">
                  {formatNumber(item.quantity)} {item.unit}
                </span>
              </li>
          )}
          </ul>
        }
      </section>
    </Modal>);

}