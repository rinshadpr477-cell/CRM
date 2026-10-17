'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Building2, User } from 'lucide-react';
import { Prospect } from '@/types/prospect';
import { ProspectStatusBadge } from '@/components/ui/ProspectStatusBadge';
import { formatDate } from '@/lib/utils';

interface RecentProspectsTableProps {
  prospects: Prospect[];
}

export function RecentProspectsTable({ prospects }: RecentProspectsTableProps) {
  // Sort by updatedAt descending, take top 5
  const recent = [...prospects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
      <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Recent Prospects
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Recently engaged or updated prospective accounts
          </p>
        </div>

        <Link
          href="/prospects"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#004e9f] hover:text-[#003d7c] transition-colors p-1.5 rounded-lg hover:bg-blue-50"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-5 sm:px-6">Company</th>
              <th className="py-3 px-4 hidden md:table-cell">Industry</th>
              <th className="py-3 px-4 hidden sm:table-cell">Assigned Rep</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 hidden lg:table-cell">Last Updated</th>
              <th className="py-3 px-5 sm:px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {recent.map((prospect) => (
              <tr
                key={prospect.id}
                className="hover:bg-slate-50/60 transition-colors group"
              >
                <td className="py-3.5 px-5 sm:px-6 font-medium text-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 group-hover:text-[#004e9f] transition-colors">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <Link
                        href={`/prospects/${prospect.id}`}
                        className="hover:underline font-semibold text-slate-900 line-clamp-1"
                      >
                        {prospect.companyName}
                      </Link>
                      <span className="text-xs text-slate-400 block md:hidden line-clamp-1">
                        {prospect.industry}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-600 hidden md:table-cell">
                  <span className="line-clamp-1">{prospect.industry}</span>
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-600 hidden sm:table-cell">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prospect.assignedEmployee}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <ProspectStatusBadge status={prospect.status} size="sm" />
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-500 hidden lg:table-cell">
                  {formatDate(prospect.updatedAt)}
                </td>
                <td className="py-3.5 px-5 sm:px-6 text-right">
                  <Link
                    href={`/prospects/${prospect.id}`}
                    className="inline-flex items-center justify-center text-xs font-semibold text-[#004e9f] hover:text-white hover:bg-[#004e9f] px-2.5 py-1 rounded-lg border border-slate-200 hover:border-[#004e9f] transition-all"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/40 text-center">
        <Link
          href="/prospects"
          className="text-xs font-semibold text-slate-600 hover:text-[#004e9f] transition-colors"
        >
          Manage all {prospects.length} prospects in directory &rarr;
        </Link>
      </div>
    </div>
  );
}
