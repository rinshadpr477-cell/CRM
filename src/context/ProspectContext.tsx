'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Prospect, ProspectFormData, DashboardMetrics } from '@/types/prospect';
import {
  loadStoredProspects,
  createProspectRecord,
  updateProspectRecord,
  deleteProspectRecord,
  addNoteToProspect,
  resetProspectsToSeed,
} from '@/lib/storage';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ProspectContextValue {
  prospects: Prospect[];
  isLoaded: boolean;
  metrics: DashboardMetrics;
  createProspect: (data: ProspectFormData) => Promise<Prospect>;
  updateProspect: (id: string, data: Partial<ProspectFormData>) => Promise<Prospect | null>;
  deleteProspect: (id: string) => Promise<boolean>;
  addNote: (id: string, content: string) => Promise<Prospect | null>;
  getProspectById: (id: string) => Prospect | undefined;
  resetData: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const ProspectContext = createContext<ProspectContextValue | undefined>(undefined);

export function ProspectProvider({ children }: { children: React.ReactNode }) {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.resolve().then(() => {
      if (mounted) {
        const data = loadStoredProspects();
        setProspects(data);
        setIsLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const createProspect = useCallback(
    async (data: ProspectFormData): Promise<Prospect> => {
      const created = createProspectRecord(data);
      setProspects((prev) => [created, ...prev]);
      showToast(`Prospect "${data.companyName}" added successfully.`, 'success');
      return created;
    },
    [showToast]
  );

  const updateProspect = useCallback(
    async (id: string, data: Partial<ProspectFormData>): Promise<Prospect | null> => {
      const updated = updateProspectRecord(id, data);
      if (updated) {
        setProspects((prev) => prev.map((p) => (p.id === id ? updated : p)));
        showToast(`Prospect "${updated.companyName}" updated successfully.`, 'success');
      } else {
        showToast(`Failed to update prospect.`, 'error');
      }
      return updated;
    },
    [showToast]
  );

  const deleteProspect = useCallback(
    async (id: string): Promise<boolean> => {
      const target = prospects.find((p) => p.id === id);
      const companyName = target?.companyName || 'Prospect';
      const success = deleteProspectRecord(id);
      if (success) {
        setProspects((prev) => prev.filter((p) => p.id !== id));
        showToast(`Deleted "${companyName}" from records.`, 'info');
      } else {
        showToast(`Could not delete prospect.`, 'error');
      }
      return success;
    },
    [prospects, showToast]
  );

  const addNote = useCallback(
    async (id: string, content: string): Promise<Prospect | null> => {
      const updated = addNoteToProspect(id, { author: 'Alex Morgan', content });
      if (updated) {
        setProspects((prev) => prev.map((p) => (p.id === id ? updated : p)));
        showToast(`Note added successfully.`, 'success');
      }
      return updated;
    },
    [showToast]
  );

  const getProspectById = useCallback(
    (id: string): Prospect | undefined => {
      return prospects.find((p) => p.id === id);
    },
    [prospects]
  );

  const resetData = useCallback(() => {
    const data = resetProspectsToSeed();
    setProspects(data);
    showToast(`Restored seed sample prospects.`, 'info');
  }, [showToast]);

  const metrics: DashboardMetrics = useMemo(() => {
    const totalProspects = prospects.length;
    const newProspects = prospects.filter((p) => p.status === 'new').length;
    const qualifiedLeads = prospects.filter((p) => p.status === 'qualified').length;
    const unqualifiedLeads = prospects.filter((p) => p.status === 'unqualified').length;
    const contactedLeads = prospects.filter((p) => p.status === 'contacted').length;
    const totalPipelineValue = prospects.reduce((sum, p) => sum + (p.annualRevenue || 0), 0);
    const conversionRate = totalProspects > 0 ? Math.round((qualifiedLeads / totalProspects) * 100) : 0;

    return {
      totalProspects,
      newProspects,
      qualifiedLeads,
      unqualifiedLeads,
      contactedLeads,
      totalPipelineValue,
      conversionRate,
    };
  }, [prospects]);

  return (
    <ProspectContext.Provider
      value={{
        prospects,
        isLoaded,
        metrics,
        createProspect,
        updateProspect,
        deleteProspect,
        addNote,
        getProspectById,
        resetData,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </ProspectContext.Provider>
  );
}

export function useProspects() {
  const context = useContext(ProspectContext);
  if (!context) {
    throw new Error('useProspects must be used within a ProspectProvider');
  }
  return context;
}
