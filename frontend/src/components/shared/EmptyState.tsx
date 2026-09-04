import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
      <div className="mb-3 text-ink-faint" aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>);

}