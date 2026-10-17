'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Building2,
  Eye,
  Pencil,
  Trash2,
  Globe,
  Users,
} from 'lucide-react';
import { Prospect, SortConfig, SortField } from '@/types/prospect';
import { ProspectStatusBadge } from '@/components/ui/ProspectStatusBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ProspectTableProps {
  prospects: Prospect[];
  onDelete: (id: string) => Promise<boolean>;
  onResetFilters?: () => void;
  isFiltered?: boolean;
}

const ITEMS_PER_PAGE = 7;

export function ProspectTable({
  prospects,
  onDelete,
  onResetFilters,
  isFiltered = false,
}: ProspectTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'updatedAt',
    order: 'desc',
  });

  // State for delete modal
  const [prospectToDelete, setProspectToDelete] = useState<Prospect | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sorting
  const sortedProspects = useMemo(() => {
    const list = [...prospects];
    const { field, order } = sortConfig;

    list.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (field === 'annualRevenue' || field === 'employeeCount') {
        const diff = (aVal as number) - (bVal as number);
        return order === 'asc' ? diff : -diff;
      }

      if (field === 'updatedAt') {
        const diff = new Date(aVal as string).getTime() - new Date(bVal as string).getTime();
        return order === 'asc' ? diff : -diff;
      }

      const strA = (aVal as string).toLowerCase();
      const strB = (bVal as string).toLowerCase();
      if (strA < strB) return order === 'asc' ? -1 : 1;
      if (strA > strB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [prospects, sortConfig]);

  // Pagination calculation
  const totalItems = sortedProspects.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Auto-adjust page if current page exceeds total pages after deletion
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  if (validCurrentPage !== currentPage && totalPages > 0) {
    setCurrentPage(validCurrentPage);
  }

  const paginatedProspects = useMemo(() => {
    const start = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return sortedProspects.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProspects, validCurrentPage]);

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        return {
          field,
          order: prev.order === 'asc' ? 'desc' : 'asc',
        };
      }
      return {
        field,
        order: 'asc',
      };
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />;
    }
    return sortConfig.order === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-[#004e9f]" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[#004e9f]" />
    );
  };

  const confirmDelete = async () => {
    if (!prospectToDelete) return;
    setIsDeleting(true);
    await onDelete(prospectToDelete.id);
    setIsDeleting(false);
    setProspectToDelete(null);
  };

  if (prospects.length === 0) {
    return (
      <EmptyState
        type={isFiltered ? 'search' : 'data'}
        actionLabel={isFiltered ? 'Clear Filters' : 'Add First Prospect'}
        onAction={
          isFiltered
            ? onResetFilters
            : () => {
                router.push('/prospects/new');
              }
        }
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
      {/* Table responsive scroll container */}
      <div className="overflow-x-auto min-h-[360px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none">
              <th
                onClick={() => handleSort('companyName')}
                className="py-3.5 px-6 cursor-pointer hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Company</span>
                  {getSortIcon('companyName')}
                </div>
              </th>
              <th
                onClick={() => handleSort('industry')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors hidden md:table-cell"
              >
                <div className="flex items-center gap-1.5">
                  <span>Industry</span>
                  {getSortIcon('industry')}
                </div>
              </th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Country</th>
              <th className="py-3.5 px-4 hidden sm:table-cell">Assigned Rep</th>
              <th
                onClick={() => handleSort('annualRevenue')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Revenue</span>
                  {getSortIcon('annualRevenue')}
                </div>
              </th>
              <th
                onClick={() => handleSort('employeeCount')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors text-right hidden xl:table-cell"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Employees</span>
                  {getSortIcon('employeeCount')}
                </div>
              </th>
              <th
                onClick={() => handleSort('status')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th
                onClick={() => handleSort('updatedAt')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors hidden lg:table-cell"
              >
                <div className="flex items-center gap-1.5">
                  <span>Updated</span>
                  {getSortIcon('updatedAt')}
                </div>
              </th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {paginatedProspects.map((prospect) => (
              <tr
                key={prospect.id}
                className="hover:bg-slate-50/70 transition-colors group"
              >
                {/* Company Name */}
                <td className="py-4 px-6 font-medium text-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 group-hover:text-[#004e9f] transition-colors">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/prospects/${prospect.id}`}
                        className="font-semibold text-slate-900 hover:text-[#004e9f] hover:underline line-clamp-1"
                      >
                        {prospect.companyName}
                      </Link>
                      {prospect.website && (
                        <span className="text-xs text-slate-400 block truncate max-w-[180px]">
                          {prospect.website.replace(/^https?:\/\//, '')}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Industry */}
                <td className="py-4 px-4 text-xs text-slate-600 hidden md:table-cell">
                  <span className="line-clamp-1">{prospect.industry}</span>
                </td>

                {/* Country */}
                <td className="py-4 px-4 text-xs text-slate-600 hidden lg:table-cell">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{prospect.country}</span>
                  </div>
                </td>

                {/* Assigned Rep */}
                <td className="py-4 px-4 text-xs text-slate-700 hidden sm:table-cell">
                  <span className="truncate">{prospect.assignedEmployee}</span>
                </td>

                {/* Annual Revenue */}
                <td className="py-4 px-4 text-xs font-semibold text-slate-900 text-right">
                  {formatCurrency(prospect.annualRevenue)}
                </td>

                {/* Employee Count */}
                <td className="py-4 px-4 text-xs text-slate-600 text-right hidden xl:table-cell">
                  <div className="flex items-center justify-end gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prospect.employeeCount.toLocaleString()}</span>
                  </div>
                </td>

                {/* Lead Status */}
                <td className="py-4 px-4">
                  <ProspectStatusBadge status={prospect.status} size="sm" />
                </td>

                {/* Last Updated */}
                <td className="py-4 px-4 text-xs text-slate-500 hidden lg:table-cell whitespace-nowrap">
                  {formatDate(prospect.updatedAt)}
                </td>

                {/* Action Buttons */}
                <td className="py-4 px-6 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/prospects/${prospect.id}`}
                      className="p-1.5 text-slate-500 hover:text-[#004e9f] hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                      aria-label={`View ${prospect.companyName}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/prospects/${prospect.id}/edit`}
                      className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit Prospect"
                      aria-label={`Edit ${prospect.companyName}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setProspectToDelete(prospect)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Prospect"
                      aria-label={`Delete ${prospect.companyName}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <Pagination
        currentPage={validCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(prospectToDelete)}
        title="Delete Prospect Record"
        message={`Are you sure you want to permanently delete "${prospectToDelete?.companyName}"? This action removes the account from your pipeline, metric calculations, and local records.`}
        confirmLabel="Confirm Delete"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setProspectToDelete(null)}
      />
    </div>
  );
}
