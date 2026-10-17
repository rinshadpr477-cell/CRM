'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { useProspects } from '@/context/ProspectContext';
import { Button } from '@/components/ui/Button';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ProspectActivityChart } from '@/components/dashboard/ProspectActivityChart';
import { LeadQualificationChart } from '@/components/dashboard/LeadQualificationChart';
import { RecentProspectsTable } from '@/components/dashboard/RecentProspectsTable';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const { prospects, isLoaded, metrics } = useProspects();

  if (!isLoaded) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track your prospects and monitor lead performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/prospects">
            <Button variant="outline" size="md" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
              All Prospects
            </Button>
          </Link>
          <Link href="/prospects/new">
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
              Add Prospect
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Prospects"
          value={metrics.totalProspects}
          subtitle="All active pipeline accounts"
          icon={Users}
          iconBgColor="bg-blue-50"
          iconTextColor="text-[#004e9f]"
          trend={{
            value: `${formatCurrency(metrics.totalPipelineValue)} val`,
            isPositive: true,
            label: 'Total estimated pipeline',
          }}
        />

        <MetricCard
          title="New Prospects"
          value={metrics.newProspects}
          subtitle="Awaiting initial discovery"
          icon={UserPlus}
          iconBgColor="bg-sky-50"
          iconTextColor="text-sky-600"
          trend={{
            value: `${metrics.totalProspects > 0 ? Math.round((metrics.newProspects / metrics.totalProspects) * 100) : 0}% of total`,
            isPositive: null,
            label: 'Share of total leads',
          }}
        />

        <MetricCard
          title="Qualified Leads"
          value={metrics.qualifiedLeads}
          subtitle="Ready for technical demo / RFP"
          icon={CheckCircle2}
          iconBgColor="bg-emerald-50"
          iconTextColor="text-[#34A853]"
          trend={{
            value: `${metrics.conversionRate}% qualification`,
            isPositive: true,
            label: 'Lead qualification rate',
          }}
        />

        <MetricCard
          title="Unqualified Leads"
          value={metrics.unqualifiedLeads}
          subtitle="Out of budget or timeline"
          icon={XCircle}
          iconBgColor="bg-rose-50"
          iconTextColor="text-rose-600"
          trend={{
            value: `${metrics.totalProspects > 0 ? Math.round((metrics.unqualifiedLeads / metrics.totalProspects) * 100) : 0}% archived`,
            isPositive: false,
            label: 'Disqualified rate',
          }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Area Chart (2 Columns on large screens) */}
        <div className="lg:col-span-2">
          <ProspectActivityChart prospects={prospects} />
        </div>

        {/* Lead Qualification Donut Chart (1 Column) */}
        <div>
          <LeadQualificationChart prospects={prospects} />
        </div>
      </div>

      {/* Bottom Grid: Recent Prospects Table + Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Prospects Table (2 Columns) */}
        <div className="lg:col-span-2">
          <RecentProspectsTable prospects={prospects} />
        </div>

        {/* Activity Feed (1 Column) */}
        <div>
          <RecentActivityFeed prospects={prospects} />
        </div>
      </div>
    </div>
  );
}
