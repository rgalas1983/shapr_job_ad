export type LocationType = 'Budapest' | 'Denver' | 'Remote';

export interface JobFormData {
  jobTitle: string;
  location: LocationType;
  isRelocationApplicable: boolean; // Only for Denver/Budapest
  rawNotes: string;
}

export interface GenerationState {
  isLoading: boolean;
  content: string | null;
  error: string | null;
}