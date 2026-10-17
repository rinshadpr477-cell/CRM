import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean | null;
    label: string;
  };
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-blue-50',
  iconTextColor = 'text-[#004e9f]',
  trend,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {value}
          </div>
        </div>
        <div
          className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105',
            iconBgColor,
            iconTextColor
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500">{subtitle}</span>
        {trend && (
          <div
            className={cn(
              'inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full',
              trend.isPositive === true
                ? 'bg-emerald-50 text-emerald-700'
                : trend.isPositive === false
                ? 'bg-rose-50 text-rose-700'
                : 'bg-slate-100 text-slate-600'
            )}
          >
            {trend.isPositive === true && <TrendingUp className="w-3 h-3" />}
            {trend.isPositive === false && <TrendingDown className="w-3 h-3" />}
            {trend.isPositive === null && <Minus className="w-3 h-3" />}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}
