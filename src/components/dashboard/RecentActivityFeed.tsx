'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { UserPlus, RefreshCw, CheckCircle, FileText, Activity } from 'lucide-react';
import { Prospect } from '@/types/prospect';
import { formatRelativeTime } from '@/lib/utils';

interface RecentActivityFeedProps {
  prospects: Prospect[];
}

export function RecentActivityFeed({ prospects }: RecentActivityFeedProps) {
  // Aggregate all activities from all prospects, sort by timestamp desc, take top 6
  const activities = useMemo(() => {
    const list: Array<{
      id: string;
      prospectId: string;
      companyName: string;
      type: string;
      title: string;
      description: string;
      timestamp: string;
    }> = [];

    prospects.forEach((p) => {
      (p.activityHistory || []).forEach((act) => {
        list.push({
          ...act,
          prospectId: p.id,
          companyName: p.companyName,
        });
      });
    });

    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return list.slice(0, 6);
  }, [prospects]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created':
        return {
          icon: <UserPlus className="w-4 h-4 text-blue-600" />,
          bg: 'bg-blue-50 border-blue-200/80',
        };
      case 'status_change':
        return {
          icon: <CheckCircle className="w-4 h-4 text-[#34A853]" />,
          bg: 'bg-emerald-50 border-emerald-200/80',
        };
      case 'note_added':
        return {
          icon: <FileText className="w-4 h-4 text-purple-600" />,
          bg: 'bg-purple-50 border-purple-200/80',
        };
      default:
        return {
          icon: <RefreshCw className="w-4 h-4 text-slate-600" />,
          bg: 'bg-slate-100 border-slate-200',
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
      <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#004e9f]" />
            <span>Recent Activity</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of lead mutations, notes, and qualification events
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100 mt-2">
        {activities.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No recent activity recorded.
          </div>
        ) : (
          activities.map((act) => {
            const style = getActivityIcon(act.type);
            return (
              <div key={act.id} className="py-3.5 flex items-start gap-3.5 group">
                <div
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 mt-0.5 ${style.bg}`}
                >
                  {style.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {act.title}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                      {formatRelativeTime(act.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                    {act.description}
                  </p>
                  <div className="mt-1">
                    <Link
                      href={`/prospects/${act.prospectId}`}
                      className="text-[11px] font-semibold text-[#004e9f] hover:underline"
                    >
                      {act.companyName}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-400">
          Auto-synchronized with browser state
        </span>
      </div>
    </div>
  );
}
