import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

const VARIANTS: Record<Variant, string> = {
  primary:
  'bg-brand-700 text-white border-brand-700 hover:bg-brand-900 hover:border-brand-900',
  secondary:
  'bg-white text-ink border-line-strong hover:bg-subtle hover:border-ink-faint',
  ghost: 'bg-transparent text-ink-muted border-transparent hover:bg-subtle hover:text-ink',
  danger: 'bg-white text-signal-600 border-signal-200 hover:bg-signal-50'
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
      className={`inline-flex items-center justify-center rounded border font-medium transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props} />);


}