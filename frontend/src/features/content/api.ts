import { ApiClient } from "@/lib/api-client";
import {
  Country,
  CountryDetail,
  Post,
  PostCreatePayload,
  PostUpdatePayload,
} from "./types";

export async function getCountries(): Promise<Country[]> {
  return ApiClient.get<Country[]>("/content/countries");
}

export async function getCountryBySlug(slug: string): Promise<CountryDetail> {
  return ApiClient.get<CountryDetail>(`/content/countries/${slug}`);
}

export async function getPosts(params?: {
  country?: string;
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<Post[]> {
  const query = new URLSearchParams();
  if (params?.country) query.append("country", params.country);
  if (params?.category) query.append("category", params.category);
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.offset) query.append("offset", params.offset.toString());

  const queryString = query.toString();
  const endpoint = queryString ? `/content/posts?${queryString}` : "/content/posts";
  return ApiClient.get<Post[]>(endpoint);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  return ApiClient.get<Post>(`/content/posts/${slug}`);
}

export async function getAdminPosts(): Promise<Post[]> {
  return ApiClient.get<Post[]>("/content/admin/posts");
}

export async function createPost(payload: PostCreatePayload): Promise<Post> {
  return ApiClient.post<Post>("/content/posts", payload);
}

export async function updatePost(id: number, payload: PostUpdatePayload): Promise<Post> {
  return ApiClient.put<Post>(`/content/posts/${id}`, payload);
}

export async function deletePost(id: number): Promise<{ message: string; id: number }> {
  return ApiClient.delete<{ message: string; id: number }>(`/content/posts/${id}`);
}
