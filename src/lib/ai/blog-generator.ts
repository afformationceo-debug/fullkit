import { callClaude, parseJsonResponse } from "./claude";
import { generateImage } from "./openai";
import { getBlogMasterPrompt, getImagePrompt } from "./prompts/blog-master";
import { slugify } from "@/lib/utils/slugify";

interface BlogGenerationInput {
  primary_keyword: string;
  secondary_keywords: string[];
  target_audience: string;
  service_category: string;
  category: string;
}

interface GeneratedBlogPost {
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  excerpt: string;
  content: string;
  faq: Array<{ question: string; answer: string }>;
  tags: string[];
  reading_time_minutes: number;
  cover_image_url?: string;
  category: string;
  primary_keyword: string;
  secondary_keywords: string[];
}

export async function generateBlogPost(
  input: BlogGenerationInput
): Promise<GeneratedBlogPost> {
  // Step 1: Generate content via Claude
  const prompt = getBlogMasterPrompt({
    primary_keyword: input.primary_keyword,
    secondary_keywords: input.secondary_keywords,
    target_audience: input.target_audience,
    service_category: input.service_category,
  });

  const response = await callClaude(prompt, {
    maxTokens: 4096,
    temperature: 0.7,
  });

  const parsed = parseJsonResponse<{
    title: string;
    meta_title: string;
    meta_description: string;
    excerpt: string;
    content: string;
    faq: Array<{ question: string; answer: string }>;
    tags: string[];
    reading_time_minutes: number;
  }>(response);

  // Step 2: Generate cover image via DALL-E (if API key available)
  let coverImageUrl: string | undefined;
  try {
    if (process.env.OPENAI_API_KEY) {
      const imagePrompt = getImagePrompt(input.primary_keyword);
      coverImageUrl = await generateImage(imagePrompt);
    }
  } catch (err) {
    console.error("Image generation failed:", err);
    // Continue without image
  }

  // Step 3: Build the FAQ HTML section
  const faqHtml = parsed.faq
    .map(
      (faq) => `### ${faq.question}\n\n${faq.answer}`
    )
    .join("\n\n");

  // Append FAQ section to content if not already included
  const fullContent = parsed.content.includes("## FAQ")
    ? parsed.content
    : `${parsed.content}\n\n## 자주 묻는 질문 (FAQ)\n\n${faqHtml}`;

  return {
    title: parsed.title,
    slug: slugify(parsed.title),
    meta_title: parsed.meta_title,
    meta_description: parsed.meta_description,
    excerpt: parsed.excerpt,
    content: fullContent,
    faq: parsed.faq,
    tags: parsed.tags,
    reading_time_minutes: parsed.reading_time_minutes || 7,
    cover_image_url: coverImageUrl,
    category: input.category,
    primary_keyword: input.primary_keyword,
    secondary_keywords: input.secondary_keywords,
  };
}

export function validateBlogPost(post: GeneratedBlogPost): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Title check
  if (!post.title || post.title.length < 10) issues.push("제목이 너무 짧습니다.");
  if (post.title.length > 60) issues.push("제목이 너무 깁니다.");

  // Content length check (approximate character count)
  const contentLength = post.content.length;
  if (contentLength < 2000) issues.push(`본문이 짧습니다 (${contentLength}자, 최소 2000자).`);
  if (contentLength > 5000) issues.push(`본문이 깁니다 (${contentLength}자, 최대 5000자).`);

  // H2 check
  const h2Count = (post.content.match(/^## /gm) || []).length;
  if (h2Count < 3) issues.push(`H2가 부족합니다 (${h2Count}개, 최소 3개).`);

  // FAQ check
  if (!post.faq || post.faq.length < 3) issues.push("FAQ가 3개 미만입니다.");

  // Meta description check
  if (post.meta_description.length < 50) issues.push("메타 설명이 짧습니다.");
  if (post.meta_description.length > 160) issues.push("메타 설명이 깁니다.");

  // CTA check
  if (!post.content.includes("/apply")) issues.push("CTA 링크(/apply)가 없습니다.");

  // Keyword density check (basic)
  if (post.primary_keyword) {
    const keywordCount = (
      post.content.match(new RegExp(post.primary_keyword, "gi")) || []
    ).length;
    const wordCount = post.content.length / 3; // rough Korean char-to-word
    const density = (keywordCount / wordCount) * 100;
    if (density < 0.5) issues.push(`키워드 밀도가 낮습니다 (${density.toFixed(1)}%).`);
    if (density > 4) issues.push(`키워드 밀도가 높습니다 (${density.toFixed(1)}%).`);
  }

  return { valid: issues.length === 0, issues };
}

export function generateFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBlogPostSchema(post: {
  title: string;
  excerpt: string;
  content: string;
  cover_image_url?: string;
  published_at?: string;
  tags: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image_url,
    datePublished: post.published_at,
    dateModified: post.published_at,
    author: {
      "@type": "Organization",
      name: "Full Kit",
      url: "https://fullkit.kr",
    },
    publisher: {
      "@type": "Organization",
      name: "Full Kit",
      logo: {
        "@type": "ImageObject",
        url: "https://fullkit.kr/logo.png",
      },
    },
    keywords: post.tags.join(", "),
  };
}
