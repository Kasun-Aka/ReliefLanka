import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  BoxesIcon,
  LifeBuoyIcon,
  MapPinIcon,
  PackageIcon,
  UsersIcon,
  ZapIcon,
} from 'lucide-react';
import { Badge } from '../components/shared/Badge';
import { TableShell, Td, Th } from '../components/shared/Table';
import { useReliefData } from '../contexts/ReliefDataContext';
import { formatNumber, formatRelative } from '../utils/format';
import { coverageTone, urgencyTone } from '../utils/tone';

/* ─── animated counter ──────────────────────────────────────────────────── */
function AnimatedCount({ target, className }: { target: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 900;
    const from = 0;

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setDisplay(Math.round(from + (target - from) * eased));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);

  return <span className={className}>{formatNumber(display)}</span>;
}

/* ─── stat card inside hero strip ───────────────────────────────────────── */
function HeroStat({
  label,
  value,
  accent,
  to,
}: {
  label: string;
  value: number;
  accent?: boolean;
  to: string;
}) {
  return (
    <Link
      to={to}
      className={`group flex flex-col gap-1 rounded-lg px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-raised
        ${accent
          ? 'bg-signal-600 text-white'
          : 'bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
        }`}
    >
      <span className={`text-xs font-semibold uppercase tracking-wider ${accent ? 'text-red-200' : 'text-white/60'}`}>
        {label}
      </span>
      <AnimatedCount
        target={value}
        className={`font-mono text-3xl font-bold leading-none ${accent ? 'text-white' : 'text-white'}`}
      />
      <span className={`mt-0.5 flex items-center gap-1 text-xs ${accent ? 'text-red-200' : 'text-white/50'}`}>
        View details <ArrowRightIcon className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/* ─── module navigation card ─────────────────────────────────────────────── */
function ModuleCard({
  to,
  Icon,
  title,
  copy,
  count,
  countLabel,
  accent,
}: {
  to: string;
  Icon: React.ElementType;
  title: string;
  copy: string;
  count?: number;
  countLabel?: string;
  accent?: 'brand' | 'signal' | 'ok' | 'caution';
}) {
  const accentMap = {
    brand: { bg: 'bg-brand-50', icon: 'bg-brand-600', text: 'text-brand-600', border: 'hover:border-brand-300' },
    signal: { bg: 'bg-signal-50', icon: 'bg-signal-600', text: 'text-signal-600', border: 'hover:border-signal-200' },
    ok: { bg: 'bg-ok-50', icon: 'bg-ok-600', text: 'text-ok-600', border: 'hover:border-ok-200' },
    caution: { bg: 'bg-caution-50', icon: 'bg-caution-600', text: 'text-caution-600', border: 'hover:border-caution-200' },
  };
  const a = accentMap[accent ?? 'brand'];

  return (
    <Link
      to={to}
      className="group flex flex-col rounded-xl border border-line bg-surface/50 backdrop-blur-sm p-5 shadow-panel transition-all duration-300 ease-out hover:border-brand-500/50 hover:shadow-glow hover:-translate-y-1"
    >
      {/* icon badge */}
      <span className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${a.icon} text-white shadow-sm`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>

      <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-muted">{copy}</p>

      {count !== undefined && (
        <div className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${a.bg} ${a.text}`}>
          <span className="font-mono text-sm">{formatNumber(count)}</span>
          <span>{countLabel}</span>
        </div>
      )}

      <span className={`mt-4 flex items-center gap-1 text-sm font-medium ${a.text}`}>
        Open module
        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1" />
      </span>

      {/* decorative corner gradient */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100 ${a.bg}`}
      />
    </Link>
  );
}

/* ─── main page ──────────────────────────────────────────────────────────── */
export function Home() {
  const { requests, centers, volunteers, inventory, districtSnapshots } = useReliefData();

  const pending = requests.items.filter((r) => r.status === 'Pending');
  const highUrgency = pending.filter((r) => r.urgency === 'High').sort((a, b) => b.peopleAffected - a.peopleAffected);
  const peopleWaiting = pending.reduce((sum, r) => sum + r.peopleAffected, 0);
  const activeCenters = centers.items.filter((c) => c.isActive);
  const availableVols = volunteers.items.filter((v) => v.availability === 'Available');
  const lowStock = inventory.items.filter((i) => i.quantity < i.reorderLevel).sort((a, b) => a.quantity / a.reorderLevel - b.quantity / b.reorderLevel);
  const districtCount = new Set(pending.map((r) => r.district)).size;
  const fulfilledPct = Math.round((requests.items.length - pending.length) / Math.max(1, requests.items.length) * 100);

  return (
    <div className="flex flex-col gap-0">

      {/* ══════════════════════════════════════════════════════
          HERO — full-bleed with flood image
      ══════════════════════════════════════════════════════ */}
      <section className="-mx-5 -mt-8 lg:-mx-8 lg:-mt-8 relative overflow-hidden">
        {/* background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-flood.jpg')" }}
          aria-hidden="true"
        />
        {/* gradient overlay — dark left, lighter right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(7,42,63,0.97) 0%, rgba(7,42,63,0.88) 40%, rgba(13,91,136,0.70) 70%, rgba(13,91,136,0.40) 100%)',
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[1440px] px-5 pb-0 pt-16 lg:px-8 lg:pt-20">
          {/* status badge */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-red-300">
              Active response — Sri Lanka flood emergency
            </span>
          </div>

          {/* headline */}
          <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.15] tracking-tight text-white lg:text-5xl">
            {formatNumber(peopleWaiting)}{' '}
            <span className="text-brand-200">people</span> are still waiting on assistance
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
            Across <span className="font-semibold text-white">{pending.length} open requests</span> in{' '}
            <span className="font-semibold text-white">{districtCount} districts</span>.{' '}
            {fulfilledPct}% of all logged requests have been fulfilled so far.
          </p>

          {/* CTA buttons */}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/requests"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-900 shadow-raised transition-all duration-150 hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-raised"
            >
              <ZapIcon className="h-4 w-4 text-signal-600" />
              Open request queue
            </Link>
            <Link
              to="/centers"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-150 hover:bg-white/20"
            >
              <MapPinIcon className="h-4 w-4" />
              Find a drop-off center
            </Link>
          </div>

          {/* live stats strip — floats on the bottom edge of the hero */}
          <div className="mt-12 grid grid-cols-2 gap-3 pb-8 sm:grid-cols-4">
            <HeroStat label="Pending requests" value={pending.length} to="/requests" accent />
            <HeroStat label="High urgency" value={highUrgency.length} to="/requests" />
            <HeroStat label="Active centers" value={activeCenters.length} to="/centers" />
            <HeroStat label="Volunteers ready" value={availableVols.length} to="/volunteers" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MODULE CARDS
      ══════════════════════════════════════════════════════ */}
      <section className="mt-8" aria-labelledby="modules-heading">
        <div className="mb-5">
          <h2 id="modules-heading" className="text-xl font-semibold text-ink">Coordination modules</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Four independent workflows — one shared view of the disaster.
          </p>
        </div>
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <ModuleCard
            to="/requests"
            Icon={LifeBuoyIcon}
            title="Relief Requests"
            copy="Log and track assistance requests from affected households across all districts."
            count={pending.length}
            countLabel="open requests"
            accent="signal"
          />
          <ModuleCard
            to="/centers"
            Icon={PackageIcon}
            title="Drop-off Centers"
            copy="Publish where donations can be handed over, district by district."
            count={activeCenters.length}
            countLabel="active centers"
            accent="brand"
          />
          <ModuleCard
            to="/volunteers"
            Icon={UsersIcon}
            title="Volunteers"
            copy="Register skills and availability, then deploy responders to the field."
            count={availableVols.length}
            countLabel="available"
            accent="ok"
          />
          <ModuleCard
            to="/inventory"
            Icon={BoxesIcon}
            title="Inventory"
            copy="Track relief stock levels across storage points and flag what needs restocking."
            count={lowStock.length > 0 ? lowStock.length : inventory.items.length}
            countLabel={lowStock.length > 0 ? 'low stock lines' : 'stock lines'}
            accent={lowStock.length > 0 ? 'caution' : 'ok'}
          />
        </section>
      </section>

      {/* ══════════════════════════════════════════════════════
          BOTTOM GRID — district table + sidecars
      ══════════════════════════════════════════════════════ */}
      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3 animate-slide-up" style={{ animationDelay: '200ms' }}>

        {/* district readiness table — 2/3 width */}
        <section className="xl:col-span-2" aria-labelledby="readiness-heading">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 id="readiness-heading" className="text-lg font-semibold text-ink">District readiness</h2>
              <p className="mt-0.5 text-sm text-ink-muted">
                Demand and supply side by side — move effort where it is short.
              </p>
            </div>
            <Link
              to="/requests"
              className="shrink-0 text-sm font-medium text-brand-600 transition-colors duration-150 ease-out hover:text-brand-900"
            >
              View all →
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
            }
          >
            {districtSnapshots.length === 0 ? (
              <tr>
                <Td colSpan={7} className="py-10 text-center text-sm text-ink-muted">
                  No district data yet — data appears as requests and resources are logged.
                </Td>
              </tr>
            ) : (
              districtSnapshots.map((s) => (
                <tr key={s.district} className="transition-colors duration-150 ease-out hover:bg-brand-50/60">
                  <Td>
                    <span className="font-medium text-ink">{s.district}</span>
                    {s.highUrgency > 0 && (
                      <span className="ml-2 text-xs font-medium text-signal-600">{s.highUrgency} high</span>
                    )}
                  </Td>
                  <Td align="right" className="font-mono">{s.pendingRequests}</Td>
                  <Td align="right" className="font-mono">{formatNumber(s.peopleAffected)}</Td>
                  <Td align="right" className="font-mono">{s.activeCenters}</Td>
                  <Td align="right" className="font-mono">{s.availableVolunteers}</Td>
                  <Td align="right" className="font-mono">{s.lowStockItems || '—'}</Td>
                  <Td align="right">
                    <Badge tone={coverageTone(s.coverage)} dot>{s.coverage}</Badge>
                  </Td>
                </tr>
              ))
            )}
          </TableShell>
        </section>

        {/* right column — urgent + restock */}
        <div className="flex flex-col gap-6">

          {/* needs attention now */}
          <section className="rounded-xl border border-line bg-surface/60 backdrop-blur-sm shadow-panel transition-all hover:border-brand-500/30" aria-labelledby="urgent-heading">
            <div className="flex items-center justify-between border-b border-line px-5 py-4 bg-surface-solid/50">
              <div className="flex items-center gap-2">
                <AlertTriangleIcon className="h-4 w-4 text-signal-600" aria-hidden="true" />
                <h2 id="urgent-heading" className="text-sm font-semibold text-ink">Needs attention now</h2>
              </div>
              <Link
                to="/requests"
                className="text-xs font-medium text-brand-600 transition-colors duration-150 ease-out hover:text-brand-900"
              >
                Queue →
              </Link>
            </div>
            {highUrgency.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ok-50">
                  <span className="text-lg">✓</span>
                </span>
                <p className="text-sm text-ink-muted">No high-urgency requests — queue is under control.</p>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {highUrgency.slice(0, 5).map((r) => (
                  <li key={r.id} className="group px-4 py-3 transition-colors duration-100 hover:bg-signal-50/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{r.name}</p>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          {r.district} · {formatNumber(r.peopleAffected)} people
                        </p>
                      </div>
                      <Badge tone={urgencyTone(r.urgency)} dot>{r.urgency}</Badge>
                    </div>
                    <p className="mt-1.5 truncate text-xs text-ink-faint">
                      {r.itemsNeeded.join(', ')} · {formatRelative(r.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* restock first */}
          <section className="rounded-xl border border-line bg-surface/60 backdrop-blur-sm shadow-panel transition-all hover:border-brand-500/30" aria-labelledby="restock-heading">
            <div className="flex items-center justify-between border-b border-line px-5 py-4 bg-surface-solid/50">
              <div className="flex items-center gap-2">
                <BoxesIcon className="h-4 w-4 text-caution-600" aria-hidden="true" />
                <h2 id="restock-heading" className="text-sm font-semibold text-ink">Restock first</h2>
              </div>
              <Link
                to="/inventory"
                className="text-xs font-medium text-brand-600 transition-colors duration-150 ease-out hover:text-brand-900"
              >
                Inventory →
              </Link>
            </div>
            {lowStock.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ok-50">
                  <span className="text-lg">✓</span>
                </span>
                <p className="text-sm text-ink-muted">Every stock line is above its reorder level.</p>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {lowStock.slice(0, 5).map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3 transition-colors duration-100 hover:bg-caution-50/40">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{item.itemName}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{item.district} · {item.storageLocation}</p>
                    </div>
                    <span className="shrink-0 rounded bg-signal-50 px-1.5 py-0.5 font-mono text-xs font-semibold text-signal-600">
                      {formatNumber(item.quantity)}/{formatNumber(item.reorderLevel)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          FOOTER STRIP
      ══════════════════════════════════════════════════════ */}
      <div className="mt-10 flex flex-col gap-8 animate-fade-in">
        <section className="relative overflow-hidden rounded-2xl border border-line bg-surface/80 backdrop-blur-md p-6 shadow-panel lg:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 to-transparent pointer-events-none" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded bg-brand-700 text-xs font-bold text-white">RL</span>
              <div>
                <p className="text-sm font-semibold text-ink">ReliefLanka</p>
                <p className="text-xs text-ink-faint">Disaster &amp; flood assistance tracker — National Coordination Desk</p>
              </div>
            </div>
            <p className="text-xs text-ink-faint">Emergency hotline <span className="font-mono font-medium text-ink">117</span> · Data refreshed continuously during active events</p>
          </div>
        </section>
      </div>

    </div>
  );
}