export interface University {
  id: number;
  name: string;
  slug: string;
  city: string;
  world_ranking?: number | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  website_url?: string | null;
  accepts_moi_waiver: boolean;
  moi_conditions?: string | null;
  country_id: number;
  country_name: string;
  country_code: string;
  country_flag_emoji: string;
  programs_count: number;
}

export interface Program {
  id: number;
  university_id: number;
  university_name: string;
  university_city: string;
  university_logo_url?: string | null;
  university_world_ranking?: number | null;
  country_id: number;
  country_name: string;
  country_code: string;
  country_flag_emoji: string;
  name: string;
  slug: string;
  degree_level: string;
  discipline: string;
  duration_years: number;
  intake_seasons: string[];
  min_cgpa: number;
  min_cgpa_scale: number;
  annual_tuition_original: number;
  currency_code: string;
  currency_symbol: string;

  // Real-Time Computed PKR Values
  annual_tuition_pkr: number;
  annual_living_cost_pkr: number;
  total_annual_cost_pkr: number;

  // English & MOI
  min_ielts_score?: number | null;
  min_pte_score?: number | null;
  accepts_moi: boolean;
  moi_waiver_eligible: boolean;
  moi_conditions?: string | null;

  // Deadlines & Evaluation
  application_deadline_fall?: string | null;
  application_deadline_spring?: string | null;
  description?: string | null;
  is_active: boolean;
  is_shortlisted: boolean;
  match_status?: "eligible" | "competitive" | "stretch" | null;
  match_reason?: string | null;
}

export interface ProgramFilterState {
  search?: string;
  country_slug?: string;
  degree_level?: string;
  discipline?: string;
  max_budget_pkr?: number;
  moi_only?: boolean;
  match_my_profile?: boolean;
}

export interface ShortlistedProgramItem {
  id: number;
  program_id: number;
  notes?: string | null;
  created_at: string;
  program: Program;
}

export interface ShortlistToggleResponse {
  shortlisted: boolean;
  program_id: number;
  message: string;
}
