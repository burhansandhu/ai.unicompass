import { ApiClient } from "@/lib/api-client";
import { StudentProfile, StudentProfileUpdatePayload } from "./types";

export async function getMyProfile(): Promise<StudentProfile> {
  return ApiClient.get<StudentProfile>("/profile/me");
}

export async function updateMyProfile(
  payload: StudentProfileUpdatePayload
): Promise<StudentProfile> {
  return ApiClient.put<StudentProfile>("/profile/me", payload);
}

export async function getStudentProfileByUserId(
  userId: number
): Promise<StudentProfile> {
  return ApiClient.get<StudentProfile>(`/profile/users/${userId}`);
}
