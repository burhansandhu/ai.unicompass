import { ApiClient } from "@/lib/api-client";
import { AdminStudentLead, AdminPlatformStats } from "./types";

export async function getAdminStudents(): Promise<AdminStudentLead[]> {
  return ApiClient.get<AdminStudentLead[]>("/admin/students");
}

export async function getAdminStats(): Promise<AdminPlatformStats> {
  return ApiClient.get<AdminPlatformStats>("/admin/stats");
}
