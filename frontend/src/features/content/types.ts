export interface Country {
  id: number;
  name: string;
  code: string;
  slug: string;
  flag_emoji: string;
  overview: string;
  currency: string;
  avg_cost_pkr?: string;
  hero_image_url?: string;
  popular_tag?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthorSummary {
  id: number;
  full_name: string;
  email: string;
}

export interface Post {
  id: number;
  country_id?: number | null;
  author_id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featured_image_url?: string | null;
  read_time: string;
  is_published: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  country?: Country | null;
  author?: AuthorSummary | null;
}

export interface CountryDetail extends Country {
  posts: Post[];
}

export interface PostCreatePayload {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: string;
  country_id?: number | null;
  featured_image_url?: string | null;
  read_time?: string;
  is_published?: boolean;
}

export interface PostUpdatePayload {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  country_id?: number | null;
  featured_image_url?: string | null;
  read_time?: string;
  is_published?: boolean;
}
