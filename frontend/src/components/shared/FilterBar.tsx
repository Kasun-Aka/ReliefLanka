import React from 'react';
import { SearchIcon, XIcon } from 'lucide-react';

interface FilterBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
  children?: React.ReactNode;
  resultLabel: string;
  onReset?: () => void;
  showReset?: boolean;
}

export function FilterBar({
  query,
  onQueryChange,
  placeholder,
  children,
  resultLabel,
  onReset,
  showReset = false
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-3 shadow-panel lg:flex-row lg:items-center">
      <div className="relative lg:w-72">
        <SearchIcon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
          aria-hidden="true" />
        
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-9 w-full rounded border border-line-strong bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint transition-colors duration-150 ease-out hover:border-ink-faint focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100" />
        
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      <div className="flex items-center gap-3 lg:ml-auto">
        {showReset && onReset &&
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 transition-colors duration-150 ease-out hover:text-brand-900">
          
            <XIcon className="h-3.5 w-3.5" />
            Clear filters
          </button>
        }
        <span className="text-xs text-ink-muted">{resultLabel}</span>
      </div>
    </div>);

}