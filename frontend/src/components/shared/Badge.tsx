import React from 'react';

export type BadgeTone = 'neutral' | 'brand' | 'danger' | 'warning' | 'success';

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-subtle text-ink-muted border-line',
  brand: 'bg-brand-500/15 text-brand-300 border-brand-500/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]',
  danger: 'bg-signal-500/15 text-signal-400 border-signal-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
  warning: 'bg-caution-500/15 text-caution-400 border-caution-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
  success: 'bg-ok-500/15 text-ok-400 border-ok-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
};

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
}

export function Badge({ children, tone = 'neutral', dot = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm transition-all duration-300 ${TONES[tone]}`}>
      
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>);

}