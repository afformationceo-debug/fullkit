import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import { ShareButton } from "@/components/blog/ShareButton";
import { getBlogPostBySlug, getRelatedPosts, incrementViewCount } from "@/lib/dal/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "글을 찾을 수 없습니다" };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://whykit.io";
  const title = String(post.meta_title || post.title);
  const description = String(post.meta_description || post.excerpt);
  const coverImage = post.cover_image_url ? String(post.cover_image_url) : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.published_at ? String(post.published_at) : undefined,
      url: `${baseUrl}/blog/${slug}`,
      images: coverImage ? [{ url: coverImage, width: 1792, height: 1024 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverImage ? [coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Increment view count (fire-and-forget)
  incrementViewCount(String(post.id));

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://whykit.io";
  // Content is sanitized using DOMPurify via sanitizeHtml() to prevent XSS
  const sanitizedContent = sanitizeHtml(String(post.content));
  const category = String(post.category || "인사이트");
  const title = String(post.title);
  const excerpt = String(post.excerpt || "");
  const publishedAt = post.published_at ? String(post.published_at) : "";
  const readingTime = post.reading_time_minutes as number || 7;
  const coverImageUrl = post.cover_image_url ? String(post.cover_image_url) : null;
  const tags = (post.tags as string[]) || [];

  // Parse FAQ from faq_schema
  const faqSchema = post.faq_schema as { mainEntity?: Array<{ name: string; acceptedAnswer: { text: string } }> } | Array<{ question: string; answer: string }> | null;
  let faqItems: Array<{ question: string; answer: string }> = [];
  if (faqSchema) {
    if (Array.isArray(faqSchema)) {
      faqItems = faqSchema.filter((f) => f.question && f.answer);
    } else if (faqSchema.mainEntity) {
      faqItems = faqSchema.mainEntity
        .map((item) => ({
          question: item.name,
          answer: item.acceptedAnswer.text,
        }))
        .filter((f) => f.question && f.answer);
    }
  }

  // Related posts
  const relatedPosts = await getRelatedPosts(slug, category, 3);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    image: coverImageUrl,
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: {
      "@type": "Organization",
      name: "WhyKit",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "WhyKit",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    keywords: tags.join(", "),
  };

  const faqJsonLd = faqItems.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  // JSON-LD is safe structured data, not user content
  const jsonLdHtml = JSON.stringify(jsonLd);
  const faqJsonLdHtml = faqJsonLd ? JSON.stringify(faqJsonLd) : null;

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml }}
        />
        {faqJsonLdHtml && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: faqJsonLdHtml }}
          />
        )}

        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft size={14} /> 블로그로 돌아가기
          </Link>

          {/* Article Header */}
          <header className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs px-2.5 py-1 rounded-full bg-brand/10 text-brand font-medium">
                {category}
              </span>
              <span className="text-xs text-muted-foreground">
                {readingTime}분 읽기
              </span>
              {publishedAt && (
                <span className="text-xs text-muted-foreground">
                  {new Date(publishedAt).toLocaleDateString("ko-KR")}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              {title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{excerpt}</p>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Cover Image */}
          {coverImageUrl ? (
            <div className="aspect-[16/9] rounded-2xl mb-10 relative overflow-hidden">
              <Image
                src={coverImageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          ) : (
            <div className="aspect-[16/9] bg-muted rounded-2xl mb-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent" />
            </div>
          )}

          {/* Article Content - sanitized via DOMPurify (isomorphic-dompurify) */}
          <div
            className="blog-content prose prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-brand prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:my-6"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {/* FAQ Section */}
          {faqItems.length > 0 && (
            <section className="faq-section">
              <h2 className="text-2xl font-extrabold flex items-center gap-2 mb-6">
                자주 묻는 질문
              </h2>
              <div className="space-y-3">
                {faqItems.map((item, idx) => (
                  <div key={idx} className="faq-item">
                    <div className="faq-question">{item.question}</div>
                    <div className="faq-answer">{item.answer}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Bottom CTA */}
          <div className="mt-12 rounded-2xl border-2 border-brand/30 bg-gradient-to-br from-brand/10 to-brand/5 p-10 text-center">
            <h3 className="text-2xl font-extrabold mb-3">지금 바로 전문가와 상담하세요</h3>
            <p className="text-muted-foreground mb-2 text-lg">
              더 이상 혼자 고민하지 마세요.
            </p>
            <p className="text-muted-foreground mb-8">
              WhyKit이 <strong className="text-foreground">무료로 맞춤 상담</strong>해 드립니다. 부담 없이 문의해 주세요.
            </p>
            <Button size="lg" asChild>
              <Link href="/apply" className="text-base px-8 py-3">무료 상담 신청하기</Link>
            </Button>
          </div>

          {/* Share buttons */}
          <div className="mt-10 flex items-center gap-3">
            <span className="text-sm text-muted-foreground">공유하기:</span>
            <ShareButton url={`${baseUrl}/blog/${slug}`} />
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16 border-t border-border pt-10">
              <h2 className="text-2xl font-bold mb-6">관련 글</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map((related) => (
                  <Link
                    key={String(related.id)}
                    href={`/blog/${String(related.slug)}`}
                    className="group block rounded-xl border border-border bg-card overflow-hidden hover:border-brand/30 transition-colors"
                  >
                    <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                      {related.cover_image_url ? (
                        <Image
                          src={String(related.cover_image_url)}
                          alt={String(related.title)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm leading-snug group-hover:text-brand transition-colors line-clamp-2">
                        {String(related.title)}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
