import { ApiClient } from "@/lib/api-client";
import {
  Scholarship,
  ScholarshipFilterState,
  ScholarshipCreatePayload,
  ScholarshipUpdatePayload,
  SavedScholarshipItem,
  ScholarshipToggleResponse,
} from "./types";

export async function getScholarships(filters?: ScholarshipFilterState): Promise<Scholarship[]> {
  const query = new URLSearchParams();
  if (filters?.search) query.set("search", filters.search);
  if (filters?.country_slug) query.set("country_slug", filters.country_slug);
  if (filters?.degree_level) query.set("degree_level", filters.degree_level);
  if (filters?.coverage_type) query.set("coverage_type", filters.coverage_type);

  const qs = query.toString();
  return ApiClient.get<Scholarship[]>(`/scholarships${qs ? `?${qs}` : ""}`);
}

export async function getScholarshipByIdOrSlug(idOrSlug: string | number): Promise<Scholarship> {
  return ApiClient.get<Scholarship>(`/scholarships/${idOrSlug}`);
}

export async function toggleSaveScholarship(scholarshipId: number): Promise<ScholarshipToggleResponse> {
  return ApiClient.post<ScholarshipToggleResponse>(`/scholarships/${scholarshipId}/save`, {});
}

export async function getSavedScholarships(): Promise<SavedScholarshipItem[]> {
  return ApiClient.get<SavedScholarshipItem[]>("/scholarships/student/saved");
}

export async function createScholarship(payload: ScholarshipCreatePayload): Promise<Scholarship> {
  return ApiClient.post<Scholarship>("/scholarships", payload);
}

export async function updateScholarship(
  id: number,
  payload: ScholarshipUpdatePayload
): Promise<Scholarship> {
  return ApiClient.put<Scholarship>(`/scholarships/${id}`, payload);
}

export async function deleteScholarship(id: number): Promise<{ message: string }> {
  return ApiClient.delete<{ message: string }>(`/scholarships/${id}`);
}
