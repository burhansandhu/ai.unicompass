import { ApiClient } from "@/lib/api-client";
import { ChatRequestPayload, ChatResponsePayload } from "./types";

export async function sendChatMessage(payload: ChatRequestPayload): Promise<ChatResponsePayload> {
  return ApiClient.post<ChatResponsePayload>("/chat", payload);
}
