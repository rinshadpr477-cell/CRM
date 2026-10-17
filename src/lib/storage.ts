import { Prospect, ProspectFormData, ActivityEvent, NoteItem } from '@/types/prospect';
import { INITIAL_PROSPECTS } from '@/data/seedData';

const STORAGE_KEY = 'prospect_crm_records_v1';

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function loadStoredProspects(): Prospect[] {
  if (!isBrowser()) {
    return INITIAL_PROSPECTS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROSPECTS));
      return INITIAL_PROSPECTS;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const valid = parsed.filter(
        (p) =>
          p &&
          typeof p === 'object' &&
          typeof p.id === 'string' &&
          typeof p.companyName === 'string' &&
          typeof p.status === 'string'
      );
      if (valid.length > 0) {
        return valid;
      }
    }
    // If corrupted or empty array, restore valid initial seed
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROSPECTS));
    return INITIAL_PROSPECTS;
  } catch (error) {
    console.error('Recovering corrupted localStorage with seed data:', error);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROSPECTS));
    } catch {
      // In case quota or private browsing blocks writing
    }
    return INITIAL_PROSPECTS;
  }
}

export function saveStoredProspects(prospects: Prospect[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prospects));
  } catch (error) {
    console.error('Failed to save prospects to localStorage:', error);
  }
}

export function createProspectRecord(data: ProspectFormData): Prospect {
  const current = loadStoredProspects();
  const now = new Date().toISOString();
  const newId = `prsp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

  const createdActivity: ActivityEvent = {
    id: `act-${Date.now()}-1`,
    type: 'created',
    title: 'Prospect Created',
    description: `Added ${data.companyName} with status "${data.status}".`,
    timestamp: now,
  };

  const newProspect: Prospect = {
    ...data,
    id: newId,
    createdAt: now,
    updatedAt: now,
    activityHistory: [createdActivity],
    notes: [],
  };

  const updated = [newProspect, ...current];
  saveStoredProspects(updated);
  return newProspect;
}

export function updateProspectRecord(id: string, updates: Partial<ProspectFormData>): Prospect | null {
  const current = loadStoredProspects();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const existing = current[index];
  const now = new Date().toISOString();

  const activityEvents: ActivityEvent[] = [...(existing.activityHistory || [])];

  if (updates.status && updates.status !== existing.status) {
    activityEvents.unshift({
      id: `act-${Date.now()}-stat`,
      type: 'status_change',
      title: 'Status Updated',
      description: `Status changed from "${existing.status}" to "${updates.status}".`,
      timestamp: now,
    });
  } else {
    activityEvents.unshift({
      id: `act-${Date.now()}-upd`,
      type: 'updated',
      title: 'Prospect Updated',
      description: `Updated company details and profile attributes.`,
      timestamp: now,
    });
  }

  const updatedProspect: Prospect = {
    ...existing,
    ...updates,
    updatedAt: now,
    activityHistory: activityEvents,
  };

  const updatedList = [...current];
  updatedList[index] = updatedProspect;
  saveStoredProspects(updatedList);
  return updatedProspect;
}

export function deleteProspectRecord(id: string): boolean {
  const current = loadStoredProspects();
  const filtered = current.filter((p) => p.id !== id);
  if (filtered.length === current.length) return false;
  saveStoredProspects(filtered);
  return true;
}

export function addNoteToProspect(
  id: string,
  noteData: { author: string; content: string }
): Prospect | null {
  const current = loadStoredProspects();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const existing = current[index];
  const now = new Date().toISOString();

  const newNote: NoteItem = {
    id: `note-${Date.now()}`,
    author: noteData.author || 'Alex Morgan',
    content: noteData.content,
    createdAt: now,
  };

  const activity: ActivityEvent = {
    id: `act-${Date.now()}-note`,
    type: 'note_added',
    title: 'Note Added',
    description: `Note added by ${newNote.author}: "${newNote.content.slice(0, 60)}${newNote.content.length > 60 ? '...' : ''}"`,
    timestamp: now,
  };

  const updatedProspect: Prospect = {
    ...existing,
    notes: [newNote, ...(existing.notes || [])],
    activityHistory: [activity, ...(existing.activityHistory || [])],
    updatedAt: now,
  };

  const updatedList = [...current];
  updatedList[index] = updatedProspect;
  saveStoredProspects(updatedList);
  return updatedProspect;
}

export function getAllRecentActivities(limit = 10): (ActivityEvent & { companyName: string; prospectId: string })[] {
  const prospects = loadStoredProspects();
  const allEvents: (ActivityEvent & { companyName: string; prospectId: string })[] = [];

  prospects.forEach((p) => {
    (p.activityHistory || []).forEach((act) => {
      allEvents.push({
        ...act,
        companyName: p.companyName,
        prospectId: p.id,
      });
    });
  });

  allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return allEvents.slice(0, limit);
}

export function resetProspectsToSeed(): Prospect[] {
  if (isBrowser()) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROSPECTS));
    } catch {
      // safe fallback
    }
  }
  return INITIAL_PROSPECTS;
}
