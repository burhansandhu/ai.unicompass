import { ApiClient } from "@/lib/api-client";
import {
  Program,
  University,
  ProgramFilterState,
  ShortlistedProgramItem,
  ShortlistToggleResponse,
} from "./types";

export async function getPrograms(filters?: ProgramFilterState): Promise<Program[]> {
  const query = new URLSearchParams();
  if (filters?.search) query.set("search", filters.search);
  if (filters?.country_slug) query.set("country_slug", filters.country_slug);
  if (filters?.degree_level) query.set("degree_level", filters.degree_level);
  if (filters?.discipline) query.set("discipline", filters.discipline);
  if (filters?.max_budget_pkr) query.set("max_budget_pkr", filters.max_budget_pkr.toString());
  if (filters?.moi_only) query.set("moi_only", "true");
  if (filters?.match_my_profile) query.set("match_my_profile", "true");

  const qs = query.toString();
  return ApiClient.get<Program[]>(`/discovery/programs${qs ? `?${qs}` : ""}`);
}

export async function getMatchedPrograms(): Promise<Program[]> {
  return ApiClient.get<Program[]>("/discovery/programs/matched");
}

export async function getProgramById(programId: number): Promise<Program> {
  return ApiClient.get<Program>(`/discovery/programs/${programId}`);
}

export async function getUniversities(): Promise<University[]> {
  return ApiClient.get<University[]>("/discovery/universities");
}

export async function toggleShortlist(programId: number): Promise<ShortlistToggleResponse> {
  return ApiClient.post<ShortlistToggleResponse>(`/discovery/programs/${programId}/shortlist`, {});
}

export async function getMyShortlist(): Promise<ShortlistedProgramItem[]> {
  return ApiClient.get<ShortlistedProgramItem[]>("/discovery/student/shortlist");
}
