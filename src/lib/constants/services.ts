import { Globe, Smartphone, Settings, Zap } from "lucide-react";

export const services = [
  {
    id: "homepage",
    icon: Globe,
    emoji: "🌐",
    title: "홈페이지",
    tagline: "첫인상이 곧 매출",
    description: "브랜드의 얼굴이 되는 홈페이지. 디자인부터 개발, SEO까지 한 번에.",
    features: [
      "반응형 디자인 (모바일/태블릿/데스크톱)",
      "SEO 최적화 (구글+네이버 상위노출)",
      "빠른 로딩 속도 (Core Web Vitals 최적화)",
      "관리자 페이지 제공",
      "1년 무상 유지보수",
    ],
    targets: ["병원/의료", "기업", "브랜드", "스타트업", "교육기관"],
    href: "/apply?service=homepage",
  },
  {
    id: "app",
    icon: Smartphone,
    emoji: "📱",
    title: "앱",
    tagline: "아이디어를 현실로",
    description: "iOS, Android 네이티브 앱부터 크로스플랫폼까지. 아이디어만 있으면 돼.",
    features: [
      "iOS / Android 크로스플랫폼",
      "UI/UX 설계 포함",
      "푸시 알림 / 결제 연동",
      "앱스토어 등록 대행",
      "지속적 업데이트 지원",
    ],
    targets: ["스타트업", "쇼핑몰", "F&B", "헬스케어", "교육"],
    href: "/apply?service=app",
  },
  {
    id: "solution",
    icon: Settings,
    emoji: "⚙️",
    title: "솔루션",
    tagline: "비즈니스에 맞춘 맞춤 시스템",
    description: "ERP, CRM, 예약 시스템 등 비즈니스 맞춤형 솔루션을 만들어.",
    features: [
      "맞춤형 기능 설계",
      "기존 시스템 연동",
      "데이터 마이그레이션",
      "관리자 대시보드",
      "확장 가능한 아키텍처",
    ],
    targets: ["기업", "병원", "교육기관", "부동산", "물류"],
    href: "/apply?service=solution",
  },
  {
    id: "automation",
    icon: Zap,
    emoji: "⚡",
    title: "자동화",
    tagline: "반복 업무, 이제 그만",
    description: "반복되는 업무를 AI와 자동화로 해결. 시간과 비용을 아껴줄게.",
    features: [
      "업무 프로세스 자동화",
      "AI 챗봇 / 고객 응대",
      "데이터 수집 및 분석",
      "마케팅 자동화",
      "API 연동 자동화",
    ],
    targets: ["전 업종", "마케팅팀", "영업팀", "고객센터", "경영지원"],
    href: "/apply?service=automation",
  },
] as const;

export type ServiceId = (typeof services)[number]["id"];
