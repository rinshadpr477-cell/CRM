'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Globe,
  DollarSign,
  Users,
  Briefcase,
  UserCheck,
  Mail,
  Phone,
  Save,
  ArrowLeft,
} from 'lucide-react';
import { Prospect, ProspectFormData, LeadStatus } from '@/types/prospect';
import { AVAILABLE_INDUSTRIES, AVAILABLE_EMPLOYEES, AVAILABLE_COUNTRIES } from '@/data/seedData';
import { Button } from '@/components/ui/Button';

interface ProspectFormProps {
  initialData?: Prospect;
  mode: 'create' | 'edit';
  onSubmit: (data: ProspectFormData) => Promise<Prospect | null | undefined>;
}

interface FormErrors {
  companyName?: string;
  website?: string;
  industry?: string;
  country?: string;
  annualRevenue?: string;
  employeeCount?: string;
  assignedEmployee?: string;
  status?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export function ProspectForm({ initialData, mode, onSubmit }: ProspectFormProps) {
  const router = useRouter();
  const isEdit = mode === 'edit';

  const [formData, setFormData] = useState<ProspectFormData>({
    companyName: initialData?.companyName || '',
    website: initialData?.website || '',
    industry: initialData?.industry || AVAILABLE_INDUSTRIES[0],
    country: initialData?.country || AVAILABLE_COUNTRIES[0],
    annualRevenue: initialData?.annualRevenue ?? 1000000,
    employeeCount: initialData?.employeeCount ?? 25,
    assignedEmployee: initialData?.assignedEmployee || AVAILABLE_EMPLOYEES[0],
    status: (initialData?.status as LeadStatus) || 'new',
    description: initialData?.description || '',
    contactName: initialData?.contactName || '',
    contactEmail: initialData?.contactEmail || '',
    contactPhone: initialData?.contactPhone || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Company Name
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required.';
    } else if (formData.companyName.trim().length < 2) {
      newErrors.companyName = 'Company name must be at least 2 characters.';
    }

    // Website
    if (formData.website.trim()) {
      const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
      if (!urlPattern.test(formData.website.trim())) {
        newErrors.website = 'Enter a valid URL (e.g., https://example.com).';
      }
    }

    // Industry
    if (!formData.industry) {
      newErrors.industry = 'Please select an industry.';
    }

    // Country
    if (!formData.country.trim()) {
      newErrors.country = 'Please select or enter a country.';
    }

    // Annual Revenue
    if (formData.annualRevenue === undefined || isNaN(formData.annualRevenue)) {
      newErrors.annualRevenue = 'Annual revenue is required.';
    } else if (formData.annualRevenue < 0) {
      newErrors.annualRevenue = 'Annual revenue cannot be negative.';
    }

    // Number of Employees
    if (formData.employeeCount === undefined || isNaN(formData.employeeCount)) {
      newErrors.employeeCount = 'Employee count is required.';
    } else if (formData.employeeCount < 1) {
      newErrors.employeeCount = 'Employee count must be at least 1.';
    }

    // Assigned Employee
    if (!formData.assignedEmployee) {
      newErrors.assignedEmployee = 'Please assign a team representative.';
    }

    // Contact Email
    if (formData.contactEmail && formData.contactEmail.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.contactEmail.trim())) {
        newErrors.contactEmail = 'Enter a valid email address.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      // Auto-format website if missing protocol
      let normalizedWebsite = formData.website.trim();
      if (normalizedWebsite && !/^https?:\/\//i.test(normalizedWebsite)) {
        normalizedWebsite = `https://${normalizedWebsite}`;
      }

      const payload: ProspectFormData = {
        ...formData,
        companyName: formData.companyName.trim(),
        website: normalizedWebsite,
        annualRevenue: Number(formData.annualRevenue),
        employeeCount: Math.round(Number(formData.employeeCount)),
        contactName: formData.contactName?.trim() || undefined,
        contactEmail: formData.contactEmail?.trim() || undefined,
        contactPhone: formData.contactPhone?.trim() || undefined,
        description: formData.description.trim(),
      };

      const result = await onSubmit(payload);
      if (result) {
        if (isEdit && initialData) {
          router.push(`/prospects/${initialData.id}`);
        } else {
          router.push('/prospects');
        }
      }
    } catch (err) {
      console.error('Error submitting prospect form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Profile Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004e9f] flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Company Information</h2>
            <p className="text-xs text-slate-500">Essential business attributes and corporate identification</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Company Name */}
          <div className="sm:col-span-2">
            <label htmlFor="companyName" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="e.g. Apex Cloud Solutions"
              className={`w-full h-11 px-4 text-sm bg-slate-50 focus:bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004e9f] transition-all ${
                errors.companyName ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
              }`}
            />
            {errors.companyName && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.companyName}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Website URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-4 h-4" />
              </div>
              <input
                id="website"
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://apexcloud.io"
                className={`w-full h-11 pl-10 pr-4 text-sm bg-slate-50 focus:bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004e9f] transition-all ${
                  errors.website ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.website && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.website}</p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Industry <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004e9f] transition-all cursor-pointer"
              >
                {AVAILABLE_INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Country <span className="text-rose-500">*</span>
            </label>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full h-11 px-4 text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004e9f] transition-all cursor-pointer"
            >
              {AVAILABLE_COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.country}</p>
            )}
          </div>

          {/* Annual Revenue */}
          <div>
            <label htmlFor="annualRevenue" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Annual Revenue (USD) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                id="annualRevenue"
                type="number"
                min="0"
                step="50000"
                value={formData.annualRevenue}
                onChange={(e) => setFormData({ ...formData, annualRevenue: Number(e.target.value) })}
                className={`w-full h-11 pl-10 pr-4 text-sm bg-slate-50 focus:bg-white border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004e9f] transition-all ${
                  errors.annualRevenue ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.annualRevenue && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.annualRevenue}</p>
            )}
          </div>

          {/* Employee Count */}
          <div>
            <label htmlFor="employeeCount" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Number of Employees <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Users className="w-4 h-4" />
              </div>
              <input
                id="employeeCount"
                type="number"
                min="1"
                step="1"
                value={formData.employeeCount}
                onChange={(e) => setFormData({ ...formData, employeeCount: Number(e.target.value) })}
                className={`w-full h-11 pl-10 pr-4 text-sm bg-slate-50 focus:bg-white border rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004e9f] transition-all ${
                  errors.employeeCount ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.employeeCount && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.employeeCount}</p>
            )}
          </div>

          {/* Assigned Employee */}
          <div>
            <label htmlFor="assignedEmployee" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Assigned Representative <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserCheck className="w-4 h-4" />
              </div>
              <select
                id="assignedEmployee"
                value={formData.assignedEmployee}
                onChange={(e) => setFormData({ ...formData, assignedEmployee: e.target.value })}
                className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004e9f] transition-all cursor-pointer"
              >
                {AVAILABLE_EMPLOYEES.map((emp) => (
                  <option key={emp} value={emp}>
                    {emp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lead Status */}
          <div>
            <label htmlFor="status" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Lead Lifecycle Status <span className="text-rose-500">*</span>
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
              className="w-full h-11 px-4 text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004e9f] transition-all cursor-pointer font-medium"
            >
              <option value="new">New (Uncontacted)</option>
              <option value="contacted">Contacted (In Scoping)</option>
              <option value="qualified">Qualified (Sales Ready)</option>
              <option value="unqualified">Unqualified (Disqualified)</option>
            </select>
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Company Description & Business Scope
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Summary of business model, core services, technology stack, and sales engagement context..."
              className="w-full p-4 text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004e9f] transition-all resize-y"
            />
          </div>
        </div>
      </div>

      {/* Primary Contact Person Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Key Contact Details (Optional)</h2>
            <p className="text-xs text-slate-500">Direct stakeholder contact credentials for sales outreach</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Contact Person Name */}
          <div>
            <label htmlFor="contactName" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Contact Name
            </label>
            <input
              id="contactName"
              type="text"
              value={formData.contactName || ''}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              placeholder="e.g. Jonathan Vance"
              className="w-full h-11 px-4 text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004e9f] transition-all"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label htmlFor="contactEmail" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="contactEmail"
                type="email"
                value={formData.contactEmail || ''}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="j.vance@company.com"
                className={`w-full h-11 pl-10 pr-4 text-sm bg-slate-50 focus:bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004e9f] transition-all ${
                  errors.contactEmail ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.contactEmail && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.contactEmail}</p>
            )}
          </div>

          {/* Contact Phone */}
          <div>
            <label htmlFor="contactPhone" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone || ''}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+1 (415) 555-0199"
                className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004e9f] transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          disabled={isSubmitting}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          leftIcon={<Save className="w-4 h-4" />}
        >
          {isEdit ? 'Save Changes' : 'Create Prospect'}
        </Button>
      </div>
    </form>
  );
}
