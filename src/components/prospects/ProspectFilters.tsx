'use client';

import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { AVAILABLE_INDUSTRIES, AVAILABLE_EMPLOYEES } from '@/data/seedData';
import { ProspectFiltersState } from '@/types/prospect';

interface ProspectFiltersProps {
  filters: ProspectFiltersState;
  onFilterChange: (newFilters: ProspectFiltersState) => void;
  onReset: () => void;
  totalFiltered: number;
}

export function ProspectFilters({
  filters,
  onFilterChange,
  onReset,
  totalFiltered,
}: ProspectFiltersProps) {
  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.industry !== 'all' ||
    filters.assignedEmployee !== 'all';

  const handleChange = (key: keyof ProspectFiltersState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <label htmlFor="search-prospects" className="sr-only">
            Search prospects by company name
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="search-prospects"
            type="text"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search company name..."
            className="w-full h-10 pl-10 pr-4 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004e9f] transition-all"
          />
          {filters.search && (
            <button
              onClick={() => handleChange('search', '')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="filter-status" className="sr-only">
            Filter by lead status
          </label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full h-10 px-3 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#004e9f] transition-all cursor-pointer"
          >
            <option value="all">All Lead Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="unqualified">Unqualified</option>
          </select>
        </div>

        {/* Industry Filter */}
        <div>
          <label htmlFor="filter-industry" className="sr-only">
            Filter by industry
          </label>
          <select
            id="filter-industry"
            value={filters.industry}
            onChange={(e) => handleChange('industry', e.target.value)}
            className="w-full h-10 px-3 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#004e9f] transition-all cursor-pointer truncate"
          >
            <option value="all">All Industries</option>
            {AVAILABLE_INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        {/* Assigned Employee Filter */}
        <div>
          <label htmlFor="filter-employee" className="sr-only">
            Filter by assigned employee
          </label>
          <select
            id="filter-employee"
            value={filters.assignedEmployee}
            onChange={(e) => handleChange('assignedEmployee', e.target.value)}
            className="w-full h-10 px-3 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#004e9f] transition-all cursor-pointer"
          >
            <option value="all">All Sales Reps</option>
            {AVAILABLE_EMPLOYEES.map((emp) => (
              <option key={emp} value={emp}>
                {emp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Indicators & Reset Action */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2 text-slate-500">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Showing <strong className="text-slate-800">{totalFiltered}</strong> matching prospect{totalFiltered === 1 ? '' : 's'}
          </span>
        </div>

        {isFiltered && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
