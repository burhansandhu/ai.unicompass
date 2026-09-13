export interface MilestoneItem {
  id?: number | null;
  milestone_key: string;
  title: string;
  description: string;
  target_date: string;
  days_left: number;
  status: "completed" | "due_soon" | "upcoming" | "passed";
  is_completed: boolean;
  completed_at?: string | null;
  notes?: string | null;
  pakistani_guidance_tip: string;
  category: "exam" | "admission" | "finance" | "visa";
}

export interface ProgramDeadlineItem {
  program_id: number;
  program_name: string;
  university_name: string;
  country_name: string;
  country_flag_emoji: string;
  deadline_date: string;
  days_left: number;
  status: string;
  badge_color: string;
}

export interface TimelineSummary {
  target_intake_season: string;
  target_intake_year: number;
  intake_label: string;
  anchor_date: string;
  days_until_intake: number;
  completed_milestones: number;
  total_milestones: number;
  milestones: MilestoneItem[];
  program_deadlines: ProgramDeadlineItem[];
}

export interface MilestoneUpdatePayload {
  is_completed?: boolean;
  target_date?: string;
  notes?: string;
}
