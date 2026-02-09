import Link from "next/link";

const footerLinks = {
  서비스: [
    { label: "홈페이지 제작", href: "/apply?service=homepage" },
    { label: "앱 개발", href: "/apply?service=app" },
    { label: "솔루션 개발", href: "/apply?service=solution" },
    { label: "업무 자동화", href: "/apply?service=automation" },
  ],
  회사: [
    { label: "블로그", href: "/blog" },
    { label: "포트폴리오", href: "#portfolio" },
    { label: "프로세스", href: "#process" },
    { label: "후기", href: "#testimonials" },
  ],
  지원: [
    { label: "프로젝트 신청", href: "/apply" },
    { label: "카카오톡 상담", href: process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || "#" },
    { label: "개인정보처리방침", href: "/privacy" },
    { label: "이용약관", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight">
              WhyKit
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              홈페이지 · 앱 · 솔루션 · 자동화
              <br />
              상담 한 번이면 됩니다.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} WhyKit. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            사업자등록번호: 000-00-00000 | 대표: WhyKit
          </p>
        </div>
      </div>
    </footer>
  );
}
