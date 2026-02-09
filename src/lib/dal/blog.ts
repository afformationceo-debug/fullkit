import { createClient } from "@/lib/supabase/server";

export async function getBlogPosts(filters?: {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  perPage?: number;
}) {
  const supabase = await createClient();
  const page = filters?.page || 1;
  const perPage = filters?.perPage || 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], count: count || 0, page, perPage };
}

export async function getBlogPostById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, blog_keywords(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, blog_keywords(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error) throw error;
  return data;
}

export async function getPublishedBlogPosts(limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, category, cover_image_url, published_at, reading_time_minutes")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}
