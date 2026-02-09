"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createBlogPost(formData: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  cover_image_url?: string;
  meta_title?: string;
  meta_description?: string;
  status?: string;
  scheduled_for?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("blog_posts").insert({
    ...formData,
    author_id: user?.id,
    published_at: formData.status === "published" ? new Date().toISOString() : null,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/blog-admin");
  revalidatePath("/blog");
  return { success: true };
}

export async function updateBlogPost(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();

  if (data.status === "published" && !data.published_at) {
    data.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from("blog_posts").update(data).eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/blog-admin");
  revalidatePath("/blog");
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();
  await supabase.from("blog_keywords").delete().eq("blog_post_id", id);
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/blog-admin");
  revalidatePath("/blog");
  return { success: true };
}

export async function publishBlogPost(id: string) {
  return updateBlogPost(id, { status: "published", published_at: new Date().toISOString() });
}
