export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified';

export interface ActivityEvent {
  id: string;
  type: 'created' | 'updated' | 'status_change' | 'note_added';
  title: string;
  description: string;
  timestamp: string;
}

export interface NoteItem {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Prospect {
  id: string;
  companyName: string;
  website: string;
  industry: string;
  country: string;
  annualRevenue: number;
  employeeCount: number;
  assignedEmployee: string;
  status: LeadStatus;
  description: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
  activityHistory: ActivityEvent[];
  notes?: NoteItem[];
}

export type ProspectFormData = Omit<Prospect, 'id' | 'createdAt' | 'updatedAt' | 'activityHistory' | 'notes'>;

export interface ProspectFiltersState {
  search: string;
  status: string;
  industry: string;
  assignedEmployee: string;
}

export type SortField = 'companyName' | 'annualRevenue' | 'employeeCount' | 'updatedAt' | 'status' | 'industry';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}

export interface DashboardMetrics {
  totalProspects: number;
  newProspects: number;
  qualifiedLeads: number;
  unqualifiedLeads: number;
  contactedLeads: number;
  totalPipelineValue: number;
  conversionRate: number;
}
