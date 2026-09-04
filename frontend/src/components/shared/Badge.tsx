import React from 'react';

export type BadgeTone = 'neutral' | 'brand' | 'danger' | 'warning' | 'success';

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-subtle text-ink-muted border-line',
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
  danger: 'bg-signal-50 text-signal-600 border-signal-200',
  warning: 'bg-caution-50 text-caution-600 border-caution-200',
  success: 'bg-ok-50 text-ok-600 border-ok-200'
};

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
}

export function Badge({ children, tone = 'neutral', dot = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded border px-2 py-0.5 text-xs font-medium ${TONES[tone]}`}>
      
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>);

}