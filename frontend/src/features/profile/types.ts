export interface StudentProfile {
  id: number;
  user_id: number;

  // 1. Secondary / Higher Secondary Education
  secondary_education_type?: string | null;
  secondary_grades?: string | null;
  higher_secondary_type?: string | null;
  higher_secondary_grades?: string | null;

  // 2. Tertiary Education
  degree_level?: string | null;
  degree_type?: string | null;
  degree_field?: string | null;
  conferring_university?: string | null;
  cgpa?: number | null;
  cgpa_scale: number;
  hec_recognized: boolean;
  graduation_year?: number | null;

  // 3. Language & Tests
  english_test_type?: string | null;
  english_overall_score?: number | null;
  listening_score?: number | null;
  reading_score?: number | null;
  writing_score?: number | null;
  speaking_score?: number | null;
  moi_eligible: boolean;
  test_date_or_planned?: string | null;

  // 4. Work Experience & Gaps
  work_experience_years: number;
  current_job_title?: string | null;
  academic_gap_years: number;
  gap_explanation?: string | null;

  // 5. Financials & Target Preferences
  max_annual_budget_pkr?: number | null;
  funding_source?: string | null;
  has_28_day_bank_balance: boolean;
  target_destinations: string[];
  target_degree_level?: string | null;
  target_field?: string | null;
  target_intake?: string | null;

  completeness_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface StudentProfileUpdatePayload {
  secondary_education_type?: string | null;
  secondary_grades?: string | null;
  higher_secondary_type?: string | null;
  higher_secondary_grades?: string | null;

  degree_level?: string | null;
  degree_type?: string | null;
  degree_field?: string | null;
  conferring_university?: string | null;
  cgpa?: number | null;
  cgpa_scale?: number;
  hec_recognized?: boolean;
  graduation_year?: number | null;

  english_test_type?: string | null;
  english_overall_score?: number | null;
  listening_score?: number | null;
  reading_score?: number | null;
  writing_score?: number | null;
  speaking_score?: number | null;
  moi_eligible?: boolean;
  test_date_or_planned?: string | null;

  work_experience_years?: number;
  current_job_title?: string | null;
  academic_gap_years?: number;
  gap_explanation?: string | null;

  max_annual_budget_pkr?: number | null;
  funding_source?: string | null;
  has_28_day_bank_balance?: boolean;
  target_destinations?: string[];
  target_degree_level?: string | null;
  target_field?: string | null;
  target_intake?: string | null;
}
