import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPublishedBlogPosts, getBlogCategories } from "@/lib/dal/blog";

export const metadata: Metadata = {
  title: "블로그 | 홈페이지 제작, 앱 개발, SEO 인사이트",
  description:
    "홈페이지 제작, 앱 개발, 솔루션, 자동화에 대한 유용한 정보와 인사이트를 공유합니다. WhyKit 블로그.",
};

interface BlogPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const category = params.category || "전체";
  const page = parseInt(params.page || "1", 10);

  const [{ data: posts, count, perPage }, categories] = await Promise.all([
    getPublishedBlogPosts({ category, page }),
    getBlogCategories(),
  ]);

  const totalPages = Math.ceil(count / perPage);

  // Hero post: first post (most recent) when on first page with no filter
  const heroPost = page === 1 && category === "전체" && posts.length > 0 ? posts[0] : null;
  const gridPosts = heroPost ? posts.slice(1) : posts;

  return (
    <>
      <Header />
      <main className="pt-20 pb-16">
        {/* Hero Section with Featured Post */}
        {heroPost && heroPost.cover_image_url ? (
          <section className="relative h-[420px] md:h-[520px] mb-12 overflow-hidden">
            <Image
              src={String(heroPost.cover_image_url)}
              alt={String(heroPost.title)}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-10">
              <div className="mx-auto max-w-7xl">
                <span className="inline-block text-xs px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white font-medium mb-3">
                  {String(heroPost.category)}
                </span>
                <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-3xl mb-3">
                  <Link href={`/blog/${String(heroPost.slug)}`} className="hover:underline underline-offset-4">
                    {String(heroPost.title)}
                  </Link>
                </h2>
                <p className="text-white/80 text-sm md:text-base max-w-2xl line-clamp-2 mb-4">
                  {String(heroPost.excerpt)}
                </p>
                <div className="flex items-center gap-3 text-white/60 text-xs">
                  {heroPost.reading_time_minutes && (
                    <span>{heroPost.reading_time_minutes as number}분 읽기</span>
                  )}
                  {heroPost.published_at && (
                    <span>{new Date(String(heroPost.published_at)).toLocaleDateString("ko-KR")}</span>
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12 pt-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">블로그</h1>
            <p className="mt-3 text-muted-foreground text-lg">
              홈페이지, 앱, 솔루션, 자동화에 대한 유용한 인사이트
            </p>
          </div>
        )}

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Title (shown when hero exists) */}
          {heroPost && (
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">블로그</h1>
              <p className="mt-2 text-muted-foreground">
                홈페이지, 앱, 솔루션, 자동화에 대한 유용한 인사이트
              </p>
            </div>
          )}

          {/* Category Filter */}
          <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={cat === "전체" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  cat === category
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Blog Grid */}
          {gridPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post) => (
                <article key={String(post.id)}>
                  <Link
                    href={`/blog/${String(post.slug)}`}
                    className="group block rounded-2xl border border-border bg-card overflow-hidden hover:border-brand/30 transition-colors"
                  >
                    <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                      {post.cover_image_url ? (
                        <Image
                          src={String(post.cover_image_url)}
                          alt={String(post.title)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent" />
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-brand/10 text-brand font-medium">
                          {String(post.category)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {post.reading_time_minutes ? `${post.reading_time_minutes as number}분 읽기` : ""}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {post.published_at
                            ? new Date(String(post.published_at)).toLocaleDateString("ko-KR")
                            : ""}
                        </span>
                      </div>
                      <h2 className="font-semibold leading-snug group-hover:text-brand transition-colors line-clamp-2">
                        {String(post.title)}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {String(post.excerpt)}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : !heroPost ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">아직 게시된 글이 없습니다.</p>
              <p className="text-muted-foreground text-sm mt-2">곧 유용한 콘텐츠가 올라올 예정입니다.</p>
            </div>
          ) : null}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {page > 1 && (
                <Link
                  href={`/blog?${category !== "전체" ? `category=${encodeURIComponent(category)}&` : ""}page=${page - 1}`}
                  className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
                >
                  이전
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/blog?${category !== "전체" ? `category=${encodeURIComponent(category)}&` : ""}page=${p}`}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    p === page
                      ? "bg-foreground text-background"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  {p}
                </Link>
              ))}
              {page < totalPages && (
                <Link
                  href={`/blog?${category !== "전체" ? `category=${encodeURIComponent(category)}&` : ""}page=${page + 1}`}
                  className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors"
                >
                  다음
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
