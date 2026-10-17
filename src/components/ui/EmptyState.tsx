import React from 'react';
import { SearchX, Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  type?: 'search' | 'data';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  type = 'data',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const isSearch = type === 'search';
  const displayTitle = title || (isSearch ? 'No matching prospects found' : 'No prospects recorded yet');
  const displayDesc =
    description ||
    (isSearch
      ? 'Try adjusting your search terms or clearing active filters to find what you need.'
      : 'Get started by creating your first business prospect.');

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200/80 my-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        {isSearch ? <SearchX className="w-7 h-7" /> : <Inbox className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{displayTitle}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">{displayDesc}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant={isSearch ? 'outline' : 'primary'} size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
