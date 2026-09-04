import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

const VARIANTS: Record<Variant, string> = {
  primary:
  'bg-gradient-to-r from-brand-600 to-brand-500 text-white border-transparent hover:from-brand-500 hover:to-brand-400 shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] hover:-translate-y-0.5',
  secondary:
  'bg-surface-solid text-ink border-line-strong hover:bg-subtle hover:border-brand-400/50 hover:-translate-y-0.5 shadow-panel',
  ghost: 'bg-transparent text-ink-muted border-transparent hover:bg-subtle hover:text-ink',
  danger: 'bg-signal-600/10 text-signal-400 border-signal-600/30 hover:bg-signal-600/20 hover:border-signal-400 hover:-translate-y-0.5 shadow-panel'
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-2.5 text-xs gap-1.5',
  md: 'h-9 px-3.5 text-sm gap-2'
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg border font-medium transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props} />);


}