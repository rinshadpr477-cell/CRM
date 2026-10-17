'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useProspects } from '@/context/ProspectContext';
import { Button } from '@/components/ui/Button';
import { ProspectFilters } from '@/components/prospects/ProspectFilters';
import { ProspectTable } from '@/components/prospects/ProspectTable';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProspectFiltersState } from '@/types/prospect';

export default function ProspectsPage() {
  const { prospects, isLoaded, deleteProspect } = useProspects();

  const [filters, setFilters] = useState<ProspectFiltersState>({
    search: '',
    status: 'all',
    industry: 'all',
    assignedEmployee: 'all',
  });

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      industry: 'all',
      assignedEmployee: 'all',
    });
  };

  const filteredProspects = useMemo(() => {
    return prospects.filter((p) => {
      // Search by company name
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const matchesCompany = p.companyName.toLowerCase().includes(query);
        const matchesIndustry = p.industry.toLowerCase().includes(query);
        if (!matchesCompany && !matchesIndustry) return false;
      }

      // Filter by status
      if (filters.status !== 'all' && p.status !== filters.status) {
        return false;
      }

      // Filter by industry
      if (filters.industry !== 'all' && p.industry !== filters.industry) {
        return false;
      }

      // Filter by assigned employee
      if (
        filters.assignedEmployee !== 'all' &&
        p.assignedEmployee !== filters.assignedEmployee
      ) {
        return false;
      }

      return true;
    });
  }, [prospects, filters]);

  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.industry !== 'all' ||
    filters.assignedEmployee !== 'all';

  if (!isLoaded) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Prospects
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#004e9f] border border-blue-200">
              {prospects.length} Total
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Manage, qualify, and track your business prospects.
          </p>
        </div>

        <Link href="/prospects/new">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Add Prospect
          </Button>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <ProspectFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        totalFiltered={filteredProspects.length}
      />

      {/* Main Data Table */}
      <ProspectTable
        prospects={filteredProspects}
        onDelete={deleteProspect}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
      />
    </div>
  );
}
