"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createBlogPost, updateBlogPost, publishBlogPost } from "@/lib/actions/blog-actions";
import {
  Save,
  Send,
  Sparkles,
  Eye,
  ArrowLeft,
  Loader2,
  X,
} from "lucide-react";

interface BlogEditorProps {
  mode: "create" | "edit";
  postId?: string;
  initialData?: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category: string;
    tags: string[];
    meta_title: string;
    meta_description: string;
    cover_image_url: string;
    status: string;
    primary_keyword: string;
    faq_schema: Record<string, unknown> | null;
    quality_score: number;
  };
}

const CATEGORIES = [
  { value: "", label: "카테고리 선택" },
  { value: "홈페이지", label: "홈페이지" },
  { value: "앱", label: "앱" },
  { value: "솔루션", label: "솔루션" },
  { value: "자동화", label: "자동화" },
  { value: "인사이트", label: "인사이트" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export function BlogEditor({ mode, postId, initialData }: BlogEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || "");
  const [metaDesc, setMetaDesc] = useState(initialData?.meta_description || "");
  const [coverUrl, setCoverUrl] = useState(initialData?.cover_image_url || "");
  const [primaryKeyword, setPrimaryKeyword] = useState(initialData?.primary_keyword || "");

  function handleTitleChange(value: string) {
    setTitle(value);
    if (mode === "create" || !initialData?.slug) {
      setSlug(slugify(value));
    }
    if (!metaTitle) {
      setMetaTitle(value.length > 60 ? value.slice(0, 57) + "..." : value);
    }
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleAIGenerate() {
    if (!primaryKeyword) {
      setError("AI 생성을 위해 메인 키워드를 입력하세요.");
      return;
    }
    setIsGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primary_keyword: primaryKeyword,
          secondary_keywords: tags,
          category: category || "인사이트",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "AI 생성 실패");
      }

      const data = await res.json();
      setTitle(data.title || title);
      setSlug(slugify(data.title || title));
      setContent(data.content || content);
      setExcerpt(data.excerpt || excerpt);
      setMetaTitle(data.meta_title || metaTitle);
      setMetaDesc(data.meta_description || metaDesc);
      if (data.tags?.length) setTags(data.tags);
      if (data.cover_image_url) setCoverUrl(data.cover_image_url);
      setSuccess("AI 콘텐츠가 생성되었습니다. 확인 후 저장하세요.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI 생성에 실패했습니다.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSave(status: "draft" | "scheduled" | "published") {
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("제목을 입력하세요.");
      return;
    }
    if (!content.trim()) {
      setError("본문을 입력하세요.");
      return;
    }

    startTransition(async () => {
      const formData = {
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        content,
        excerpt: excerpt.trim(),
        category,
        tags,
        meta_title: metaTitle.trim(),
        meta_description: metaDesc.trim(),
        cover_image_url: coverUrl.trim() || undefined,
        status,
        primary_keyword: primaryKeyword.trim() || undefined,
      };

      let result;
      if (mode === "edit" && postId) {
        result = await updateBlogPost(postId, formData);
      } else {
        result = await createBlogPost(formData);
      }

      if (result.success) {
        setSuccess(status === "published" ? "발행되었습니다!" : "저장되었습니다!");
        if (mode === "create") {
          setTimeout(() => router.push("/blog-admin"), 1000);
        }
      } else {
        setError(result.error || "저장에 실패했습니다.");
      }
    });
  }

  function handlePublish() {
    if (mode === "edit" && postId) {
      startTransition(async () => {
        const result = await publishBlogPost(postId);
        if (result.success) {
          setSuccess("발행되었습니다!");
        } else {
          setError(result.error || "발행에 실패했습니다.");
        }
      });
    } else {
      handleSave("published");
    }
  }

  return (
    <div className="space-y-6">
      {/* Top actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/blog-admin")}
        >
          <ArrowLeft size={16} className="mr-1" /> 목록으로
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAIGenerate}
            disabled={isGenerating || isPending}
          >
            {isGenerating ? (
              <Loader2 size={14} className="mr-1 animate-spin" />
            ) : (
              <Sparkles size={14} className="mr-1" />
            )}
            AI 생성
          </Button>
          {slug && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/blog/${slug}`, "_blank")}
            >
              <Eye size={14} className="mr-1" /> 미리보기
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave("draft")}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 size={14} className="mr-1 animate-spin" />
            ) : (
              <Save size={14} className="mr-1" />
            )}
            초안 저장
          </Button>
          <Button
            size="sm"
            className="bg-brand text-brand-foreground hover:bg-brand/90"
            onClick={handlePublish}
            disabled={isPending}
          >
            <Send size={14} className="mr-1" /> 발행
          </Button>
        </div>
      </div>

      {/* Status messages */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-500">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main editor (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1.5">제목</label>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="블로그 글 제목"
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {title.length}/60자
              {title.length > 60 && (
                <span className="text-red-500 ml-1">너무 깁니다</span>
              )}
            </p>
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-1.5">슬러그</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">/blog/</span>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-slug"
                className="font-mono text-sm"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              본문 (Markdown)
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={24}
              placeholder="마크다운으로 본문을 작성하세요..."
              className="font-mono text-sm leading-relaxed"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {content.length}자
              {content.length < 2000 && content.length > 0 && (
                <span className="text-yellow-500 ml-1">
                  (최소 2,000자 권장)
                </span>
              )}
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium mb-1.5">발췌문</label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="블로그 목록에 표시될 발췌문 (100-150자)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {excerpt.length}/150자
            </p>
          </div>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-4">
          {/* SEO meta */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <h3 className="font-medium text-sm">SEO 메타</h3>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                메인 키워드
              </label>
              <Input
                value={primaryKeyword}
                onChange={(e) => setPrimaryKeyword(e.target.value)}
                placeholder="예: 홈페이지 제작"
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                메타 제목
              </label>
              <Input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="SEO 메타 제목"
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground mt-0.5">
                {metaTitle.length}/60자
              </p>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">
                메타 설명
              </label>
              <Textarea
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                rows={2}
                placeholder="SEO 메타 설명 (70-80자)"
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground mt-0.5">
                {metaDesc.length}/160자
              </p>
            </div>
          </div>

          {/* Category */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <h3 className="font-medium text-sm">카테고리</h3>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <h3 className="font-medium text-sm">태그</h3>
            <div className="flex gap-1.5 flex-wrap">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <X size={10} className="ml-1" />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="태그 추가"
                className="text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={addTag}
                type="button"
              >
                추가
              </Button>
            </div>
          </div>

          {/* Cover image */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <h3 className="font-medium text-sm">커버 이미지</h3>
            <Input
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="이미지 URL"
              className="text-sm"
            />
            {coverUrl && (
              <div className="rounded-md overflow-hidden border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverUrl}
                  alt="커버 이미지 미리보기"
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
          </div>

          {/* Quality score (edit mode) */}
          {mode === "edit" && initialData?.quality_score !== undefined && (
            <div className="rounded-lg border border-border bg-card p-4 space-y-2">
              <h3 className="font-medium text-sm">품질 점수</h3>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold">
                  {initialData.quality_score}
                </div>
                <div className="text-xs text-muted-foreground">/ 100</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-brand h-2 rounded-full transition-all"
                  style={{
                    width: `${initialData.quality_score}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
