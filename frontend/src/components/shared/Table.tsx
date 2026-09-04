import React from 'react';

export function TableShell({
  head,
  children,
  caption




}: {head: React.ReactNode;children: React.ReactNode;caption: string;}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-surface shadow-panel">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line bg-subtle">{head}</tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>);

}

export function Th({
  children,
  align = 'left',
  className = ''




}: {children: React.ReactNode;align?: 'left' | 'right';className?: string;}) {
  return (
    <th
      scope="col"
      className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-faint ${
      align === 'right' ? 'text-right' : 'text-left'} ${
      className}`}>
      
      {children}
    </th>);

}

export function Td({
  children,
  align = 'left',
  className = ''




}: {children: React.ReactNode;align?: 'left' | 'right';className?: string;}) {
  return (
    <td
      className={`px-4 py-3 align-middle text-ink ${
      align === 'right' ? 'text-right' : 'text-left'} ${
      className}`}>
      
      {children}
    </td>);

}