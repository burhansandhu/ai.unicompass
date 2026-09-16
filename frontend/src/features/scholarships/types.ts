export interface Scholarship {
  id: number;
  title: string;
  slug: string;
  provider: string;
  country_id: number | null;
  country_name?: string | null;
  country_flag_emoji?: string | null;
  country_slug?: string | null;
  degree_level: string;
  coverage_type: string;
  amount_value: string | null;
  deadline_date: string;
  eligibility_criteria: string | null;
  application_link: string | null;
  description: string | null;
  is_active: boolean;
  is_saved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScholarshipFilterState {
  search?: string;
  country_slug?: string;
  degree_level?: string;
  coverage_type?: string;
}

export interface ScholarshipCreatePayload {
  title: string;
  provider: string;
  country_id?: number | null;
  degree_level: string;
  coverage_type: string;
  amount_value?: string;
  deadline_date: string;
  eligibility_criteria?: string;
  application_link?: string;
  description?: string;
  is_active?: boolean;
}

export interface ScholarshipUpdatePayload extends Partial<ScholarshipCreatePayload> {
  slug?: string;
}

export interface SavedScholarshipItem {
  id: number;
  scholarship_id: number;
  scholarship: Scholarship;
  created_at: string;
}

export interface ScholarshipToggleResponse {
  scholarship_id: number;
  is_saved: boolean;
  message: string;
}
