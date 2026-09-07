function getApiBaseUrl(): string {
  let base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").trim();
  base = base.replace(/\/+$/, "");
  if (!base.endsWith("/api")) {
    base = `${base}/api`;
  }
  return base;
}

export class ApiClient {
  private static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("unicompass_token");
    }
    return null;
  }

  public static setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("unicompass_token", token);
    }
  }

  public static removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("unicompass_token");
      localStorage.removeItem("unicompass_user");
    }
  }

  public static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${getApiBaseUrl()}${cleanEndpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = "An unexpected error occurred.";
        try {
          const errorData = await response.json();
          if (typeof errorData.detail === "string") {
            errorMessage = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((e: any) => e.msg).join(", ");
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      if (err.name === "TypeError" && err.message === "Failed to fetch") {
        throw new Error("Unable to connect to backend server. Please make sure the API is running.");
      }
      throw err;
    }
  }

  public static get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public static post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public static put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public static delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}
