import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Full Kit | 홈페이지 · 앱 · 솔루션 · 자동화 제작",
    template: "%s | Full Kit",
  },
  description:
    "홈페이지, 앱, 솔루션, 자동화까지. 상담 한 번이면 됩니다. 해외급 디자인, 투명한 가격, 1년 무상 유지보수.",
  keywords: [
    "홈페이지 제작",
    "앱 개발",
    "웹사이트 제작",
    "홈페이지 제작 업체",
    "앱 제작 업체",
    "솔루션 개발",
    "업무 자동화",
    "Full Kit",
    "풀킷",
  ],
  authors: [{ name: "Full Kit" }],
  creator: "Full Kit",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://fullkit.kr"
  ),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Full Kit",
    title: "Full Kit | 홈페이지 · 앱 · 솔루션 · 자동화 제작",
    description:
      "홈페이지, 앱, 솔루션, 자동화까지. 상담 한 번이면 됩니다. 해외급 디자인, 투명한 가격, 1년 무상 유지보수.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Full Kit | 홈페이지 · 앱 · 솔루션 · 자동화 제작",
    description:
      "홈페이지, 앱, 솔루션, 자동화까지. 상담 한 번이면 됩니다.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fullkit.kr";

  // Organization and Service JSON-LD schemas (static, no user input - safe for inline script)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Full Kit",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "홈페이지, 앱, 솔루션, 자동화까지. 상담 한 번이면 됩니다.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Korean"],
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: { "@type": "Organization", name: "Full Kit" },
    serviceType: "Web Development",
    areaServed: { "@type": "Country", name: "KR" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Full Kit 서비스",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "홈페이지 제작" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "앱 개발" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "솔루션 개발" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "업무 자동화" } },
      ],
    },
  };

  return (
    <html lang="ko" className="dark">
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Full Kit 블로그"
          href="/api/blog/rss"
        />
        {/* JSON-LD structured data - static content only, no user input */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
