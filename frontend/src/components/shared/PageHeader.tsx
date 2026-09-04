import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  meta?: React.ReactNode;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, meta, action }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-line pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{description}</p>
        {meta && <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">{meta}</div>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </header>);

}

export function MetaStat({ label, value }: {label: string;value: string;}) {
  return (
    <span className="flex items-baseline gap-1.5 text-sm">
      <span className="font-mono text-base font-medium text-ink">{value}</span>
      <span className="text-ink-muted">{label}</span>
    </span>);

}