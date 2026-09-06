import { ApiClient } from "@/lib/api-client";
import { RegisterResponse, LoginResponse, LoginCredentials, RegisterCredentials, User } from "./types";

export async function registerUser(credentials: RegisterCredentials): Promise<RegisterResponse> {
  return ApiClient.post<RegisterResponse>("/auth/register", credentials);
}

export async function loginUser(credentials: LoginCredentials): Promise<User> {
  const response = await ApiClient.post<LoginResponse>("/auth/login", credentials);
  if (response.access_token) {
    ApiClient.setToken(response.access_token);
  }
  // Retrieve the full user profile with the newly acquired token
  const user = await getCurrentUser();
  if (typeof window !== "undefined") {
    localStorage.setItem("unicompass_user", JSON.stringify(user));
  }
  return user;
}

export async function getCurrentUser(): Promise<User> {
  return ApiClient.get<User>("/auth/me");
}

export async function logoutUser(): Promise<{ message: string }> {
  try {
    const res = await ApiClient.post<{ message: string }>("/auth/logout");
    ApiClient.removeToken();
    return res;
  } catch {
    ApiClient.removeToken();
    return { message: "Logged out locally." };
  }
}
