export type AttestationStatus = "not_started" | "in_progress" | "completed";

export interface AttestationStep {
  id: number;
  user_id: number;
  step_key: "ibcc" | "hec" | "mofa" | "police_passport" | string;
  status: AttestationStatus;
  notes?: string | null;
  tracking_number?: string | null;
  appointment_date?: string | null;
  completed_at?: string | null;
  updated_at?: string | null;
  title: string;
  subtitle: string;
  authority_name: string;
  portal_url: string;
  estimated_duration: string;
  estimated_fee_pkr: string;
  requirements: string[];
  procedure_steps: string[];
  important_note?: string | null;
}

export interface AttestationSummary {
  total_steps: number;
  completed_steps: number;
  in_progress_steps: number;
  completion_percentage: number;
  steps: AttestationStep[];
}

export interface AttestationStepUpdatePayload {
  status?: AttestationStatus;
  notes?: string | null;
  tracking_number?: string | null;
  appointment_date?: string | null;
}

export interface AttestationGuideItem {
  step_key: string;
  title: string;
  subtitle: string;
  authority_name: string;
  portal_url: string;
  estimated_duration: string;
  estimated_fee_pkr: string;
  requirements: string[];
  procedure_steps: string[];
  important_note?: string | null;
}
