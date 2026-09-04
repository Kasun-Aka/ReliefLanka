import React from 'react';

const CONTROL =
'w-full rounded-lg border border-line-strong bg-surface-solid/80 px-3 text-sm text-ink placeholder:text-ink-faint transition-all duration-300 ease-out hover:border-brand-500/50 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-inner backdrop-blur-sm';

interface LabelProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, hint, error, children }: LabelProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ?
      <p className="text-xs text-signal-600">{error}</p> :
      hint ?
      <p className="text-xs text-ink-faint">{hint}</p> :
      null}
    </div>);

}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return <input className={`${CONTROL} h-9 ${className}`} {...rest} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props;
  return <textarea className={`${CONTROL} py-2 ${className}`} {...rest} />;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly string[];
  placeholder?: string;
}

export function Select({ options, placeholder, className = '', ...rest }: SelectProps) {
  return (
    <select className={`${CONTROL} h-9 pr-8 ${className}`} {...rest}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) =>
      <option key={option} value={option}>
          {option}
        </option>
      )}
    </select>);

}

interface ChipGroupProps<T extends string> {
  options: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
  legend: string;
}

export function ChipGroup<T extends string>({
  options,
  selected,
  onToggle,
  legend
}: ChipGroupProps<T>) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-xs font-semibold text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(option)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-300 ease-out backdrop-blur-sm ${
              active ?
              'border-brand-500 bg-brand-500/20 text-brand-300 shadow-[0_0_10px_rgba(14,165,233,0.3)]' :
              'border-line-strong bg-surface-solid/80 text-ink-muted hover:border-brand-500/50 hover:text-ink shadow-inner'}`
              }>
              
              {option}
            </button>);

        })}
      </div>
    </fieldset>);

}