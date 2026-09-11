import { ApiClient } from "@/lib/api-client";
import {
  AttestationSummary,
  AttestationStep,
  AttestationStepUpdatePayload,
  AttestationGuideItem,
} from "./types";

export async function getMyAttestationSteps(): Promise<AttestationSummary> {
  return ApiClient.get<AttestationSummary>("/attestation/steps");
}

export async function updateAttestationStep(
  stepKey: string,
  payload: AttestationStepUpdatePayload
): Promise<AttestationStep> {
  return ApiClient.put<AttestationStep>(`/attestation/steps/${stepKey}`, payload);
}

export async function getAttestationGuidelines(): Promise<AttestationGuideItem[]> {
  return ApiClient.get<AttestationGuideItem[]>("/attestation/guidelines");
}
