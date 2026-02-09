import { callClaude, parseJsonResponse } from "./claude";
import { generateImage, downloadAndUploadImage } from "./openai";
import { getBlogMasterPrompt, getImagePrompt } from "./prompts/blog-master";
import { createAdminClient } from "@/lib/supabase/admin";
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
  quality_score: number;
  keyword_density: number;
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: Error | null = null;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (i < maxRetries) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        console.warn(`Retry ${i + 1}/${maxRetries} after error: ${lastError.message}`);
      }
    }
  }
  throw lastError;
}

export async function generateBlogPost(
  input: BlogGenerationInput
): Promise<GeneratedBlogPost> {
  // Step 1: Generate content via Claude (with retry)
  const prompt = getBlogMasterPrompt({
    primary_keyword: input.primary_keyword,
    secondary_keywords: input.secondary_keywords,
    target_audience: input.target_audience,
    service_category: input.service_category,
  });

  const parsed = await withRetry(async () => {
    const response = await callClaude(prompt, {
      maxTokens: 8192,
      temperature: 0.7,
    });
    return parseJsonResponse<{
      title: string;
      meta_title: string;
      meta_description: string;
      excerpt: string;
      content: string;
      faq: Array<{ question: string; answer: string }>;
      tags: string[];
      reading_time_minutes: number;
    }>(response);
  });

  const slug = slugify(parsed.title);

  // Step 2: Generate cover image via DALL-E → upload to Supabase Storage
  let coverImageUrl: string | undefined;
  const imageUrls: string[] = [];
  try {
    if (process.env.OPENAI_API_KEY) {
      const supabaseAdmin = createAdminClient();
      const imagePrompt = getImagePrompt(input.primary_keyword);
      const tempUrl = await generateImage(imagePrompt);
      const safeName = slug.replace(/[^a-z0-9-]/g, "").substring(0, 50);
      const storagePath = `covers/${Date.now()}-${safeName}.png`;
      coverImageUrl = await downloadAndUploadImage(tempUrl, supabaseAdmin, storagePath);
      imageUrls.push(coverImageUrl);
    }
  } catch (err) {
    console.error("Image generation/upload failed:", err);
  }

  // Step 3: Replace image placeholders with actual URLs
  let content = parsed.content;
  if (imageUrls.length > 0) {
    content = content.replace(/IMAGE_PLACEHOLDER_1/g, imageUrls[0]);
  }
  if (imageUrls.length > 1) {
    content = content.replace(/IMAGE_PLACEHOLDER_2/g, imageUrls[1]);
  }
  // Remove any unreplaced placeholders
  content = content.replace(/<img[^>]*IMAGE_PLACEHOLDER_\d+[^>]*>/g, "");

  // Step 4: Build FAQ HTML section and append
  const faqHtml = parsed.faq
    .map(
      (faq) =>
        `<h3>Q. ${faq.question}</h3>\n<p>${faq.answer}</p>`
    )
    .join("\n");

  const hasFaqInContent = /<h2[^>]*>.*FAQ|자주 묻는 질문/i.test(content);
  if (!hasFaqInContent && parsed.faq.length > 0) {
    content = `${content}\n<h2>자주 묻는 질문 (FAQ)</h2>\n${faqHtml}`;
  }

  // Step 5: Compute quality score and keyword density
  const { score, density } = computeQualityScore(content, parsed, input.primary_keyword);

  return {
    title: parsed.title,
    slug,
    meta_title: parsed.meta_title,
    meta_description: parsed.meta_description,
    excerpt: parsed.excerpt,
    content,
    faq: parsed.faq,
    tags: parsed.tags,
    reading_time_minutes: parsed.reading_time_minutes || 7,
    cover_image_url: coverImageUrl,
    category: input.category,
    primary_keyword: input.primary_keyword,
    secondary_keywords: input.secondary_keywords,
    quality_score: score,
    keyword_density: density,
  };
}

export function computeQualityScore(
  content: string,
  parsed: {
    title: string;
    meta_description: string;
    excerpt: string;
    faq: Array<{ question: string; answer: string }>;
    tags: string[];
  },
  primaryKeyword: string
): { score: number; density: number; issues: string[] } {
  let score = 0;
  const issues: string[] = [];

  // 1. Title length (max 10)
  if (parsed.title.length >= 15 && parsed.title.length <= 40) score += 10;
  else issues.push("제목 길이 부적절");

  // 2. Meta description length (max 10)
  if (parsed.meta_description.length >= 50 && parsed.meta_description.length <= 160) score += 10;
  else issues.push("메타 설명 길이 부적절");

  // 3. Content length (max 15)
  const contentLength = content.replace(/<[^>]*>/g, "").length;
  if (contentLength >= 2000 && contentLength <= 6000) score += 15;
  else if (contentLength >= 1500) score += 8;
  else issues.push(`본문 ${contentLength}자 (2000-6000자 권장)`);

  // 4. H2 count (max 15)
  const h2Count = (content.match(/<h2/gi) || []).length;
  if (h2Count >= 3 && h2Count <= 6) score += 15;
  else if (h2Count >= 2) score += 8;
  else issues.push(`H2 ${h2Count}개 (3-6개 권장)`);

  // 5. FAQ count (max 10)
  if (parsed.faq.length >= 5) score += 10;
  else if (parsed.faq.length >= 3) score += 5;
  else issues.push(`FAQ ${parsed.faq.length}개 (5개 권장)`);

  // 6. CTA presence (max 10)
  const ctaCount = (content.match(/\/apply/g) || []).length;
  if (ctaCount >= 2) score += 10;
  else if (ctaCount >= 1) score += 5;
  else issues.push("CTA(/apply) 미포함");

  // 7. Keyword in title (max 10)
  if (parsed.title.includes(primaryKeyword)) score += 10;
  else issues.push("제목에 키워드 미포함");

  // 8. Tags (max 10)
  if (parsed.tags.length >= 3) score += 10;
  else issues.push("태그 부족");

  // 9. Table or list presence (max 10)
  const hasTable = /<table/i.test(content);
  const hasList = /<ul|<ol/i.test(content);
  if (hasTable && hasList) score += 10;
  else if (hasTable || hasList) score += 5;
  else issues.push("표/목록 미포함");

  // Keyword density calculation
  const plainText = content.replace(/<[^>]*>/g, "");
  const keywordRegex = new RegExp(primaryKeyword, "gi");
  const keywordCount = (plainText.match(keywordRegex) || []).length;
  const charCount = plainText.length;
  const density = charCount > 0 ? (keywordCount * primaryKeyword.length / charCount) * 100 : 0;

  return { score: Math.min(score, 100), density: Math.round(density * 100) / 100, issues };
}

export function validateBlogPost(post: GeneratedBlogPost): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!post.title || post.title.length < 10) issues.push("제목이 너무 짧습니다.");
  if (post.title.length > 60) issues.push("제목이 너무 깁니다.");

  const plainText = post.content.replace(/<[^>]*>/g, "");
  if (plainText.length < 1500) issues.push(`본문이 짧습니다 (${plainText.length}자, 최소 1500자).`);

  const h2Count = (post.content.match(/<h2/gi) || []).length;
  if (h2Count < 3) issues.push(`H2가 부족합니다 (${h2Count}개, 최소 3개).`);

  if (!post.faq || post.faq.length < 3) issues.push("FAQ가 3개 미만입니다.");

  if (post.meta_description.length < 50) issues.push("메타 설명이 짧습니다.");
  if (post.meta_description.length > 160) issues.push("메타 설명이 깁니다.");

  if (!post.content.includes("/apply")) issues.push("CTA 링크(/apply)가 없습니다.");

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
      name: "WhyKit",
      url: "https://whykit.io",
    },
    publisher: {
      "@type": "Organization",
      name: "WhyKit",
      logo: {
        "@type": "ImageObject",
        url: "https://whykit.io/logo.png",
      },
    },
    keywords: post.tags.join(", "),
  };
}
