import React from 'react';

const CONTROL =
'w-full rounded border border-line-strong bg-white px-3 text-sm text-ink placeholder:text-ink-faint transition-colors duration-150 ease-out hover:border-ink-faint focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100';

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
              className={`rounded border px-2.5 py-1 text-xs font-medium transition-colors duration-150 ease-out ${
              active ?
              'border-brand-700 bg-brand-700 text-white' :
              'border-line-strong bg-white text-ink-muted hover:border-ink-faint hover:text-ink'}`
              }>
              
              {option}
            </button>);

        })}
      </div>
    </fieldset>);

}