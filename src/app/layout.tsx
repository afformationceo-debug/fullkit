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
    default: "WhyKit | 홈페이지 · 앱 · 솔루션 · 자동화 제작",
    template: "%s | WhyKit",
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
    "WhyKit",
    "와이킷",
  ],
  authors: [{ name: "WhyKit" }],
  creator: "WhyKit",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://whykit.io"
  ),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "WhyKit",
    title: "WhyKit | 홈페이지 · 앱 · 솔루션 · 자동화 제작",
    description:
      "홈페이지, 앱, 솔루션, 자동화까지. 상담 한 번이면 됩니다. 해외급 디자인, 투명한 가격, 1년 무상 유지보수.",
  },
  twitter: {
    card: "summary_large_image",
    title: "WhyKit | 홈페이지 · 앱 · 솔루션 · 자동화 제작",
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://whykit.io";

  // Organization and Service JSON-LD schemas (static, no user input - safe for inline script)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WhyKit",
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
    provider: { "@type": "Organization", name: "WhyKit" },
    serviceType: "Web Development",
    areaServed: { "@type": "Country", name: "KR" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "WhyKit 서비스",
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
        <meta name="google-site-verification" content="J-WiKZMUl14pTkZn67v3FEUy5thprMbfqGD72xyUk6c" />
        <meta name="naver-site-verification" content="865107f975a926160f13926929ce6545d9f64736" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="WhyKit 블로그"
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
