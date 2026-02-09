export const industries = [
  {
    id: "medical",
    emoji: "🏥",
    title: "병원/의료",
    description: "예약 시스템, 진료 안내, 의료진 소개",
    keywords: ["병원 홈페이지 제작", "의료 앱 개발", "진료 예약 시스템"],
  },
  {
    id: "corporate",
    emoji: "🏢",
    title: "기업/스타트업",
    description: "회사소개, 채용, 제품 소개",
    keywords: ["기업 홈페이지 제작", "스타트업 앱 개발", "회사소개 사이트"],
  },
  {
    id: "fashion",
    emoji: "👗",
    title: "브랜드/패션",
    description: "브랜딩, 쇼핑몰, 룩북",
    keywords: ["패션 쇼핑몰 제작", "브랜드 사이트", "룩북 홈페이지"],
  },
  {
    id: "fnb",
    emoji: "🍳",
    title: "F&B",
    description: "메뉴, 예약, 배달 연동",
    keywords: ["레스토랑 홈페이지", "카페 앱 개발", "배달 시스템"],
  },
  {
    id: "education",
    emoji: "📚",
    title: "교육",
    description: "LMS, 수강 신청, 온라인 강의",
    keywords: ["교육 플랫폼 개발", "LMS 제작", "온라인 강의 사이트"],
  },
  {
    id: "realestate",
    emoji: "🏗️",
    title: "부동산/건설",
    description: "매물 관리, 3D 투어, 중개",
    keywords: ["부동산 홈페이지", "매물 관리 시스템", "건설사 사이트"],
  },
] as const;

export type IndustryId = (typeof industries)[number]["id"];
