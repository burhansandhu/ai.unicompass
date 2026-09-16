export interface AdminStudentLead {
  id: number;
  name: string;
  email: string;
  target: string;
  registered: string;
  completeness: number;
  shortlisted_count: number;
  status: string;
  status_color: string;
}

export interface AdminPlatformStats {
  total_students: number;
  total_universities: number;
  total_programs: number;
  total_scholarships: number;
  published_articles: number;
  live_destinations: number;
}
