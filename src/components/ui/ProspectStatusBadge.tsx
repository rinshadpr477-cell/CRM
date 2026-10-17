import React from 'react';
import { LeadStatus } from '@/types/prospect';

interface ProspectStatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

export function ProspectStatusBadge({ status, size = 'md' }: ProspectStatusBadgeProps) {
  const configs: Record<
    LeadStatus,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    new: {
      label: 'New',
      bg: 'bg-blue-50/80',
      text: 'text-blue-700',
      border: 'border-blue-200/80',
      dot: 'bg-blue-500',
    },
    contacted: {
      label: 'Contacted',
      bg: 'bg-amber-50/80',
      text: 'text-amber-800',
      border: 'border-amber-200/80',
      dot: 'bg-amber-500',
    },
    qualified: {
      label: 'Qualified',
      bg: 'bg-emerald-50/80',
      text: 'text-emerald-800',
      border: 'border-emerald-200/80',
      dot: 'bg-[#34A853]',
    },
    unqualified: {
      label: 'Unqualified',
      bg: 'bg-rose-50/80',
      text: 'text-rose-800',
      border: 'border-rose-200/80',
      dot: 'bg-rose-500',
    },
  };

  const config = configs[status] || configs.new;

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs gap-1.5'
      : 'px-2.5 py-1 text-xs font-semibold gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} transition-colors tracking-wide`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
