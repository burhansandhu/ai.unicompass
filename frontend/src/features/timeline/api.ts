import { ApiClient } from "@/lib/api-client";
import { TimelineSummary, MilestoneUpdatePayload } from "./types";

export async function getTimelineSummary(): Promise<TimelineSummary> {
  return ApiClient.get<TimelineSummary>("/timeline/summary");
}

export async function updateMilestone(
  milestoneKey: string,
  payload: MilestoneUpdatePayload
): Promise<{ success: boolean; is_completed: boolean }> {
  return ApiClient.put(`/timeline/milestones/${milestoneKey}`, payload);
}

export async function downloadCalendarIcs(): Promise<void> {
  const token = typeof window !== "undefined" ? localStorage.getItem("unicompass_token") : null;
  let baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").trim().replace(/\/+$/, "");
  if (!baseUrl.endsWith("/api")) {
    baseUrl = `${baseUrl}/api`;
  }

  const response = await fetch(`${baseUrl}/timeline/export.ics`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to export calendar");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "unicompass_intake_timeline.ics";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
