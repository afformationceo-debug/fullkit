import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Skip if SendGrid API key not configured
    if (!process.env.SENDGRID_API_KEY) {
      return NextResponse.json({
        success: true,
        message: "SendGrid not configured, skipping",
        sent: 0,
      });
    }

    const supabase = createAdminClient();

    // 1. Fetch recently published blog posts (last 7 days) not yet emailed
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data: recentPosts } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, category, cover_image_url")
      .eq("status", "published")
      .gte("published_at", weekAgo.toISOString())
      .order("published_at", { ascending: false })
      .limit(3);

    if (!recentPosts || recentPosts.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No recent posts to promote",
        sent: 0,
      });
    }

    // 2. Fetch subscriber list (leads with email who opted in)
    const { data: subscribers } = await supabase
      .from("leads")
      .select("email, name")
      .not("email", "is", null)
      .eq("email_opt_in", true);

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No subscribers found",
        sent: 0,
      });
    }

    // 3. Build email content
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://whykit.io";
    const postListHtml = recentPosts
      .map(
        (p) =>
          `<tr><td style="padding:16px 0;border-bottom:1px solid #eee;">
            <a href="${siteUrl}/blog/${p.slug}" style="color:#6366f1;text-decoration:none;font-weight:600;font-size:16px;">
              ${p.title}
            </a>
            <p style="color:#666;margin:4px 0 0;font-size:14px;">${p.excerpt || ""}</p>
          </td></tr>`
      )
      .join("");

    const htmlContent = `
      <div style="max-width:600px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="padding:32px 24px;background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:12px 12px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:24px;">WhyKit 인사이트</h1>
          <p style="color:#94a3b8;margin:8px 0 0;font-size:14px;">이번 주 새로운 블로그 글을 확인하세요</p>
        </div>
        <div style="padding:24px;background:#fff;border:1px solid #e2e8f0;border-top:none;">
          <table style="width:100%;border-collapse:collapse;">${postListHtml}</table>
          <div style="text-align:center;margin:32px 0 16px;">
            <a href="${siteUrl}/blog" style="display:inline-block;padding:12px 32px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
              블로그 전체 보기
            </a>
          </div>
        </div>
        <div style="padding:16px 24px;text-align:center;color:#94a3b8;font-size:12px;">
          <p>WhyKit | 홈페이지, 앱, 솔루션, 자동화</p>
          <p><a href="${siteUrl}/unsubscribe" style="color:#94a3b8;">수신거부</a></p>
        </div>
      </div>
    `;

    // 4. Send via SendGrid
    const emails = subscribers.map((s) => String(s.email));
    let sent = 0;

    // Batch send (max 1000 per API call)
    const batchSize = 1000;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const personalizations = batch.map((email) => ({
        to: [{ email }],
      }));

      const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        },
        body: JSON.stringify({
          personalizations,
          from: {
            email: process.env.SENDGRID_FROM_EMAIL || "hello@whykit.io",
            name: "WhyKit",
          },
          subject: `[WhyKit] ${recentPosts[0].title}`,
          content: [{ type: "text/html", value: htmlContent }],
        }),
      });

      if (res.ok || res.status === 202) {
        sent += batch.length;
      } else {
        const errText = await res.text();
        console.error("SendGrid error:", errText);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sent campaign to ${sent} subscribers`,
      sent,
      posts: recentPosts.map((p) => p.title),
    });
  } catch (e) {
    console.error("Email campaign error:", e);
    return NextResponse.json(
      { error: "Email campaign failed", details: e instanceof Error ? e.message : "" },
      { status: 500 }
    );
  }
}
