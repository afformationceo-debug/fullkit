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
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error) return null;
  return data;
}

export async function getPublishedBlogPosts(filters?: {
  category?: string;
  page?: number;
  perPage?: number;
}) {
  const supabase = await createClient();
  const page = filters?.page || 1;
  const perPage = filters?.perPage || 9;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, category, cover_image_url, published_at, reading_time_minutes, tags", { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(from, to);

  if (filters?.category && filters.category !== "전체") {
    query = query.eq("category", filters.category);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data || [], count: count || 0, page, perPage };
}

export async function getRelatedPosts(currentSlug: string, category: string, limit = 3) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, category, cover_image_url, published_at, reading_time_minutes")
    .eq("status", "published")
    .eq("category", category)
    .neq("slug", currentSlug)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data || [];
}

export async function incrementViewCount(id: string) {
  try {
    const supabase = await createClient();
    // Try RPC first, fall back to raw SQL via rpc
    const { error } = await supabase.rpc("increment_view_count", { post_id: id });
    if (error) {
      // Fallback: manually increment if RPC doesn't exist
      const { data } = await supabase
        .from("blog_posts")
        .select("view_count")
        .eq("id", id)
        .single();
      if (data) {
        await supabase
          .from("blog_posts")
          .update({ view_count: ((data.view_count as number) || 0) + 1 })
          .eq("id", id);
      }
    }
  } catch {
    // View count is non-critical, silently fail
  }
}

export async function getBlogCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("category")
    .eq("status", "published");

  const cats = new Set<string>();
  (data || []).forEach((row) => {
    if (row.category) cats.add(String(row.category));
  });
  return ["전체", ...Array.from(cats)];
}
