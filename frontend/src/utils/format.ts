/** Formatting and small derivation helpers shared across modules. */

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

export function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3600_000).toISOString();
}

export function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function matches(haystack: string[], query: string): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return haystack.some((value) => value.toLowerCase().includes(q));
}