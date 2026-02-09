export const processSteps = [
  {
    number: "01",
    title: "상담 & 견적",
    description: "카카오톡/신청서로 프로젝트를 공유해 주세요. 전문 컨설턴트가 꼼꼼하게 분석해 드립니다.",
    checklist: ["무료 상담", "24시간 내 견적", "투명한 가격"],
    detail:
      "프로젝트 규모와 요구사항을 파악하고, 최적의 솔루션을 제안합니다. 숨은 비용 없이 투명한 견적을 제공합니다.",
  },
  {
    number: "02",
    title: "기획 & 설계",
    description: "와이어프레임, 기획서를 함께 확인하며 방향을 잡습니다.",
    checklist: ["사용자 흐름 설계", "기능 명세서", "피드백 반영"],
    detail:
      "사용자의 행동을 예측한 UX 설계와 비즈니스 목표에 맞는 기능을 기획합니다. 단계별로 확인하며 진행합니다.",
  },
  {
    number: "03",
    title: "디자인",
    description: "시안 제작, 수정 무제한. 만족할 때까지.",
    checklist: ["반응형 디자인", "브랜드 가이드", "프로토타입"],
    detail:
      "트렌디한 해외급 디자인을 제공합니다. 브랜드 아이덴티티를 반영한 UI로 차별화된 첫인상을 만듭니다.",
  },
  {
    number: "04",
    title: "개발 & 테스트",
    description: "견고한 코드, 철저한 QA. 완성도에 타협 없어.",
    checklist: ["모바일 최적화", "성능 최적화", "보안 점검"],
    detail:
      "최신 기술 스택으로 빠르고 안정적인 서비스를 구축합니다. 크로스 브라우저, 디바이스별 꼼꼼한 테스트.",
  },
  {
    number: "05",
    title: "런칭 & 유지보수",
    description: "배포 후에도 함께. 1년 무상 유지보수.",
    checklist: ["도메인/호스팅 세팅", "SEO 기본 셋업", "1년 무상 유지보수"],
    detail:
      "배포, 도메인 연결, SEO 기본 설정까지 모두 포함. 런칭 후에도 안정적인 운영을 보장합니다.",
  },
] as const;

export type ProcessStep = (typeof processSteps)[number];
