import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlogEditor } from "../blog-editor";

export const metadata = { title: "글 수정 | WhyKit Admin" };

export default async function BlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">글 수정</h1>
      <BlogEditor
        mode="edit"
        postId={id}
        initialData={{
          title: (post.title as string) || "",
          slug: (post.slug as string) || "",
          content: (post.content as string) || "",
          excerpt: (post.excerpt as string) || "",
          category: (post.category as string) || "",
          tags: (post.tags as string[]) || [],
          meta_title: (post.meta_title as string) || "",
          meta_description: (post.meta_description as string) || "",
          cover_image_url: (post.cover_image_url as string) || "",
          status: (post.status as string) || "draft",
          primary_keyword: (post.primary_keyword as string) || "",
          faq_schema: post.faq_schema as Record<string, unknown> | null,
          quality_score: (post.quality_score as number) || 0,
        }}
      />
    </div>
  );
}
