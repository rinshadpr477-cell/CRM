'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  Globe,
  User,
  Mail,
  Phone,
  Pencil,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useProspects } from '@/context/ProspectContext';
import { Button } from '@/components/ui/Button';
import { ProspectStatusBadge } from '@/components/ui/ProspectStatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';

function ProspectDetailsContent() {
  const params = useParams();
  const id = params?.id as string;

  const { getProspectById, isLoaded, addNote } = useProspects();
  const prospect = getProspectById(id);

  const [noteContent, setNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteError, setNoteError] = useState('');

  if (!isLoaded) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Not found fallback
  if (!prospect) {
    return (
      <div className="max-w-lg mx-auto my-16 text-center bg-white p-8 sm:p-12 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Prospect Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The requested prospect ID could not be found or may have been deleted from local storage.
        </p>
        <div className="mt-6">
          <Link href="/prospects">
            <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Prospects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) {
      setNoteError('Note content cannot be blank.');
      return;
    }
    setNoteError('');
    setIsAddingNote(true);
    await addNote(prospect.id, noteContent.trim());
    setNoteContent('');
    setIsAddingNote(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/prospects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#004e9f] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Prospects Directory</span>
        </Link>
        <Link href={`/prospects/${prospect.id}/edit`}>
          <Button variant="outline" size="sm" leftIcon={<Pencil className="w-3.5 h-3.5" />}>
            Edit Prospect
          </Button>
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#004e9f] to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {prospect.companyName}
                </h1>
                <ProspectStatusBadge status={prospect.status} size="md" />
              </div>
              <p className="mt-1 text-sm text-slate-500 flex items-center gap-2">
                <span>{prospect.industry}</span>
                <span>•</span>
                <span>{prospect.country}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:self-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <User className="w-4 h-4 text-slate-400" />
            <div className="text-xs">
              <span className="text-slate-400 block font-medium">Assigned Representative</span>
              <span className="font-semibold text-slate-800">{prospect.assignedEmployee}</span>
            </div>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-medium uppercase tracking-wider text-[10px]">
              Annual Revenue
            </span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              {formatCurrency(prospect.annualRevenue)}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium uppercase tracking-wider text-[10px]">
              Employees
            </span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              {prospect.employeeCount.toLocaleString()} team members
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium uppercase tracking-wider text-[10px]">
              First Ingested
            </span>
            <span className="text-sm font-semibold text-slate-800 mt-0.5 block">
              {formatDate(prospect.createdAt)}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium uppercase tracking-wider text-[10px]">
              Last Modified
            </span>
            <span className="text-sm font-semibold text-slate-800 mt-0.5 block">
              {formatDate(prospect.updatedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Details (Left 2 cols) & Sidebar (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Company Scope & Activity Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Description & Scope */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Company Overview & Strategic Context
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {prospect.description || 'No corporate description provided for this prospect.'}
            </p>

            {prospect.website && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Corporate Website</span>
                <a
                  href={prospect.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#004e9f] hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{prospect.website.replace(/^https?:\/\//, '')}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#004e9f]" />
                <span>Lifecycle History & Timeline</span>
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                {(prospect.activityHistory || []).length} Recorded Events
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:inset-y-2 before:left-2.5 before:w-0.5 before:bg-slate-200">
              {(prospect.activityHistory || []).map((event) => (
                <div key={event.id} className="relative group">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#004e9f] ring-4 ring-white" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900">
                      {event.title}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatDateTime(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Collaborative Account Notes */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span>Account Notes & Internal Memos</span>
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                {(prospect.notes || []).length} Notes
              </span>
            </div>

            {/* Note input form */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={2}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Log a call summary, RFP requirement, or next step..."
                className="w-full p-3 text-xs sm:text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004e9f] transition-all"
              />
              {noteError && (
                <p className="text-xs text-rose-600 font-medium">{noteError}</p>
              )}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  isLoading={isAddingNote}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Post Note
                </Button>
              </div>
            </form>

            {/* Note list */}
            <div className="space-y-3 pt-2">
              {(prospect.notes || []).length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No internal notes recorded yet. Add your first note above.
                </div>
              ) : (
                prospect.notes?.map((n) => (
                  <div
                    key={n.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{n.author}</span>
                      <span className="text-slate-400 text-[11px]">
                        {formatDateTime(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Contact Details Card & Metadata */}
        <div className="space-y-6">
          {/* Contact Person Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#004e9f]" />
              <span>Key Stakeholder</span>
            </h2>

            {prospect.contactName || prospect.contactEmail || prospect.contactPhone ? (
              <div className="space-y-4">
                {prospect.contactName && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Name
                    </span>
                    <span className="text-sm font-semibold text-slate-900 block mt-0.5">
                      {prospect.contactName}
                    </span>
                  </div>
                )}

                {prospect.contactEmail && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Email
                    </span>
                    <a
                      href={`mailto:${prospect.contactEmail}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#004e9f] hover:underline mt-0.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{prospect.contactEmail}</span>
                    </a>
                  </div>
                )}

                {prospect.contactPhone && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Direct Telephone
                    </span>
                    <a
                      href={`tel:${prospect.contactPhone}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#004e9f] mt-0.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prospect.contactPhone}</span>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No direct contact person recorded for this account.
              </div>
            )}
          </div>

          {/* Security & Data Integrity Card */}
          <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-[#34A853]" />
              <span>Pipeline Security</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Account telemetry and status audits are encrypted in client storage with active state preservation.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              Record ID: <span className="font-mono text-slate-300">{prospect.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProspectDetailsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading details...</div>}>
      <ProspectDetailsContent />
    </Suspense>
  );
}
