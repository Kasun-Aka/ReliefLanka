import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  BoxesIcon,
  LifeBuoyIcon,
  PackageIcon,
  UsersIcon } from
'lucide-react';
import { Badge } from '../components/shared/Badge';
import { Button } from '../components/shared/Button';
import { TableShell, Td, Th } from '../components/shared/Table';
import { useReliefData } from '../contexts/ReliefDataContext';
import { formatNumber, formatRelative } from '../utils/format';
import { coverageTone, urgencyTone } from '../utils/tone';

function SecondaryStat({
  label,
  value,
  sub,
  to





}: {label: string;value: string;sub: string;to: string;}) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-lg border border-line bg-surface p-4 shadow-panel transition-colors duration-150 ease-out hover:border-brand-200">
      
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
        {label}
      </span>
      <span className="mt-2 font-mono text-2xl text-ink">{value}</span>
      <span className="mt-1 text-xs text-ink-muted">{sub}</span>
    </Link>);

}

export function Home() {
  const { requests, centers, volunteers, inventory, districtSnapshots } = useReliefData();

  const pending = requests.items.filter((r) => r.status === 'Pending');
  const highUrgency = pending.
  filter((r) => r.urgency === 'High').
  sort((a, b) => b.peopleAffected - a.peopleAffected);
  const peopleWaiting = pending.reduce((sum, r) => sum + r.peopleAffected, 0);
  const activeCenters = centers.items.filter((c) => c.isActive);
  const availableVolunteers = volunteers.items.filter(
    (v) => v.availability === 'Available'
  );
  const lowStock = inventory.items.
  filter((i) => i.quantity < i.reorderLevel).
  sort((a, b) => a.quantity / a.reorderLevel - b.quantity / b.reorderLevel);
  const fulfilledShare = Math.round(
    (requests.items.length - pending.length) / Math.max(1, requests.items.length) * 100
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border border-line bg-surface p-6 shadow-panel lg:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-signal-600" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-wide text-signal-600">
                Active response
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-ink">
              {formatNumber(peopleWaiting)} people are still waiting on assistance
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Across {pending.length} open requests in{' '}
              {new Set(pending.map((r) => r.district)).size} districts.{' '}
              {fulfilledShare}% of all logged requests have been fulfilled so far.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/requests">
                <Button variant="primary">
                  Open the request queue
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/centers">
                <Button>Find a drop-off center</Button>
              </Link>
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line lg:w-auto lg:min-w-[380px]">
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-ink-faint">High urgency</dt>
              <dd className="mt-1 font-mono text-xl text-signal-600">
                {highUrgency.length}
              </dd>
            </div>
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-ink-faint">Districts affected</dt>
              <dd className="mt-1 font-mono text-xl text-ink">
                {new Set(pending.map((r) => r.district)).size}
              </dd>
            </div>
            <div className="bg-surface px-4 py-3">
              <dt className="text-xs text-ink-faint">Low stock lines</dt>
              <dd className="mt-1 font-mono text-xl text-caution-600">
                {lowStock.length}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SecondaryStat
          label="Open requests"
          value={String(pending.length)}
          sub={`${requests.items.length} logged in total`}
          to="/requests" />
        
        <SecondaryStat
          label="Active centers"
          value={String(activeCenters.length)}
          sub={`${formatNumber(activeCenters.reduce((s, c) => s + c.capacity, 0))} daily intake capacity`}
          to="/centers" />
        
        <SecondaryStat
          label="Volunteers available"
          value={String(availableVolunteers.length)}
          sub={`${volunteers.items.length - availableVolunteers.length} currently deployed`}
          to="/volunteers" />
        
        <SecondaryStat
          label="Districts stocked"
          value={String(new Set(inventory.items.map((i) => i.district)).size)}
          sub={`${inventory.items.length} stock lines tracked`}
          to="/inventory" />
        
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2" aria-labelledby="readiness-heading">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <h2 id="readiness-heading" className="text-lg font-semibold text-ink">
                District readiness
              </h2>
              <p className="mt-0.5 text-sm text-ink-muted">
                Demand and supply side by side, so effort can be moved to where it is
                short.
              </p>
            </div>
            <Link
              to="/requests"
              className="shrink-0 text-sm font-medium text-brand-600 transition-colors duration-150 ease-out hover:text-brand-900">
              
              View all requests
            </Link>
          </div>
          <TableShell
            caption="District readiness across all four modules"
            head={
            <>
                <Th>District</Th>
                <Th align="right">Open</Th>
                <Th align="right">People</Th>
                <Th align="right">Centers</Th>
                <Th align="right">Volunteers</Th>
                <Th align="right">Low stock</Th>
                <Th align="right">Coverage</Th>
              </>
            }>
            
            {districtSnapshots.map((snapshot) =>
            <tr key={snapshot.district} className="transition-colors duration-150 ease-out hover:bg-brand-50/60">
                <Td>
                  <span className="font-medium text-ink">{snapshot.district}</span>
                  {snapshot.highUrgency > 0 &&
                <span className="ml-2 text-xs text-signal-600">
                      {snapshot.highUrgency} high
                    </span>
                }
                </Td>
                <Td align="right" className="font-mono">
                  {snapshot.pendingRequests}
                </Td>
                <Td align="right" className="font-mono">
                  {formatNumber(snapshot.peopleAffected)}
                </Td>
                <Td align="right" className="font-mono">
                  {snapshot.activeCenters}
                </Td>
                <Td align="right" className="font-mono">
                  {snapshot.availableVolunteers}
                </Td>
                <Td align="right" className="font-mono">
                  {snapshot.lowStockItems || '—'}
                </Td>
                <Td align="right">
                  <Badge tone={coverageTone(snapshot.coverage)} dot>
                    {snapshot.coverage}
                  </Badge>
                </Td>
              </tr>
            )}
          </TableShell>
        </section>

        <div className="flex flex-col gap-6">
          <section
            className="rounded-lg border border-line bg-surface shadow-panel"
            aria-labelledby="urgent-heading">
            
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <h2 id="urgent-heading" className="text-sm font-semibold text-ink">
                Needs attention now
              </h2>
              <Link
                to="/requests"
                className="text-xs font-medium text-brand-600 transition-colors duration-150 ease-out hover:text-brand-900">
                
                Queue
              </Link>
            </div>
            {highUrgency.length === 0 ?
            <p className="px-4 py-6 text-sm text-ink-muted">
                No high-urgency requests are open. The queue is under control.
              </p> :

            <ul className="divide-y divide-line">
                {highUrgency.slice(0, 4).map((request) =>
              <li key={request.id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">
                          {request.name}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          {request.district} · {formatNumber(request.peopleAffected)}{' '}
                          people
                        </p>
                      </div>
                      <Badge tone={urgencyTone(request.urgency)} dot>
                        {request.urgency}
                      </Badge>
                    </div>
                    <p className="mt-1.5 truncate text-xs text-ink-faint">
                      {request.itemsNeeded.join(', ')} · {formatRelative(request.createdAt)}
                    </p>
                  </li>
              )}
              </ul>
            }
          </section>

          <section
            className="rounded-lg border border-line bg-surface shadow-panel"
            aria-labelledby="restock-heading">
            
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <h2 id="restock-heading" className="text-sm font-semibold text-ink">
                Restock first
              </h2>
              <Link
                to="/inventory"
                className="text-xs font-medium text-brand-600 transition-colors duration-150 ease-out hover:text-brand-900">
                
                Inventory
              </Link>
            </div>
            {lowStock.length === 0 ?
            <p className="px-4 py-6 text-sm text-ink-muted">
                Every stock line is above its reorder level.
              </p> :

            <ul className="divide-y divide-line">
                {lowStock.slice(0, 4).map((item) =>
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 px-4 py-3">
                
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {item.itemName}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {item.district} · {item.storageLocation}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-signal-600">
                      {formatNumber(item.quantity)}/{formatNumber(item.reorderLevel)}
                    </span>
                  </li>
              )}
              </ul>
            }
          </section>
        </div>
      </div>

      <section aria-labelledby="modules-heading" className="border-t border-line pt-6">
        <h2 id="modules-heading" className="sr-only">
          Modules
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
          {
            to: '/requests',
            icon: LifeBuoyIcon,
            title: 'Relief requests',
            copy: 'Log and track assistance requests from affected households.'
          },
          {
            to: '/centers',
            icon: PackageIcon,
            title: 'Drop-off centers',
            copy: 'Publish where donations can be handed over, district by district.'
          },
          {
            to: '/volunteers',
            icon: UsersIcon,
            title: 'Volunteers',
            copy: 'Register skills and availability, then deploy to the field.'
          },
          {
            to: '/inventory',
            icon: BoxesIcon,
            title: 'Inventory',
            copy: 'Track relief stock levels and flag what needs restocking.'
          }].
          map(({ to, icon: Icon, title, copy }) =>
          <Link
            key={to}
            to={to}
            className="group flex h-full flex-col rounded-lg border border-line bg-surface p-4 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50/40">
            
              <Icon className="h-5 w-5 text-brand-600" aria-hidden="true" />
              <h3 className="mt-3 text-sm font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">{copy}</p>
              <span className="mt-auto pt-3 text-xs font-medium text-brand-600">
                Open module →
              </span>
            </Link>
          )}
        </div>
      </section>
    </div>);

}