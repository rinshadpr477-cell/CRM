'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Pencil, AlertCircle } from 'lucide-react';
import { useProspects } from '@/context/ProspectContext';
import { ProspectForm } from '@/components/prospects/ProspectForm';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

function EditProspectContent() {
  const params = useParams();
  const id = params?.id as string;

  const { getProspectById, isLoaded, updateProspect } = useProspects();
  const prospect = getProspectById(id);

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="max-w-lg mx-auto my-16 text-center bg-white p-8 sm:p-12 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Prospect Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The prospect you are trying to edit does not exist or may have been deleted.
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28">
      {/* Back link & Header */}
      <div>
        <Link
          href={`/prospects/${prospect.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#004e9f] transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Prospect Profile</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Pencil className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Edit Prospect — {prospect.companyName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Update corporate information, pipeline classification, and assigned account representative.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card with key to reset state if prospect changes */}
      <ProspectForm
        key={prospect.id}
        initialData={prospect}
        mode="edit"
        onSubmit={async (data) => {
          return await updateProspect(prospect.id, data);
        }}
      />
    </div>
  );
}

export default function EditProspectPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading editor...</div>}>
      <EditProspectContent />
    </Suspense>
  );
}
