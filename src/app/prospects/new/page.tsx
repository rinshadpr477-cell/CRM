'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useProspects } from '@/context/ProspectContext';
import { ProspectForm } from '@/components/prospects/ProspectForm';

export default function NewProspectPage() {
  const { createProspect } = useProspects();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28">
      {/* Back link & Header */}
      <div>
        <Link
          href="/prospects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#004e9f] transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Prospects</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004e9f] flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Add New Prospect
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter company attributes and assign a sales representative to begin lead tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <ProspectForm
        mode="create"
        onSubmit={async (data) => {
          return await createProspect(data);
        }}
      />
    </div>
  );
}
