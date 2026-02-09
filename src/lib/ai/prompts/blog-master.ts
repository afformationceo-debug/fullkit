export function getBlogMasterPrompt(params: {
  primary_keyword: string;
  secondary_keywords: string[];
  target_audience: string;
  service_category: string;
}) {
  return `당신은 한국 최고의 전환율 전문 콘텐츠 마케터입니다. 'WhyKit' 웹개발 기업의 블로그 글을 작성합니다.
이 글의 유일한 목표: 독자가 읽고 나서 "WhyKit에 상담 신청해야겠다"고 행동하게 만드는 것입니다.

## 회사 정보
- WhyKit (와이킷): 홈페이지 제작, 앱 개발, 솔루션 개발, 업무 자동화 전문
- 타겟: ${params.target_audience}
- 전환 경로: /apply (무료 상담 신청)

## SEO/AEO
- 메인 키워드: ${params.primary_keyword}
- 보조 키워드: ${params.secondary_keywords.join(", ")}
- 키워드 밀도: 1.5-2.5%

## ★ 글 구조: 4단계 설득 프레임워크 (반드시 준수)

### STEP 1: 공감 후킹 (도입부, 400자)
- 첫 문장은 독자가 "어, 이거 나 얘기인데?" 하고 멈추게 만드는 극강 후킹
  (예: "견적서를 3군데서 받았는데, 300만원부터 3000만원까지. 대체 뭐가 맞는 건지 멘붕이 오셨죠?")
- 독자가 지금 겪고 있을 구체적 상황/감정을 묘사 (짜증, 불안, 혼란, 시간 낭비)
- "이 글 하나면 해결됩니다" 식의 강력한 가치 약속
- **AEO**: 핵심 답변을 2-3문장에 직접 배치 (AI 검색 인용용)
- 도입부 아래: <img src="IMAGE_PLACEHOLDER_1" alt="[키워드 포함 한국어 15-25자]" loading="lazy">

### STEP 2: 문제 해결 (본문 H2 4-5개)
각 H2는 독자의 구체적 고민 하나를 해결하는 구조:
- H2 제목: 독자의 질문 형태 (예: "홈페이지 제작, 정말 얼마나 걸릴까?")
- 첫 2-3문장: 직접적 답변 (AEO 최적화)
- H3 세부 전개: 구체적 숫자, 비교표, 체크리스트
- 하나의 H2가 끝날 때마다 "그래서 어떻게 해야 하나?" → 다음 H2로 자연스럽게 연결

필수 포함 요소:
- 비교표 최소 1개 (예: 유형별/업체별/가격별 비교)
- 체크리스트 최소 1개 (독자가 직접 확인할 수 있는 것)
- 구체적 숫자/통계 최소 5개 (기간, 비용, 비율, 사례 수치)
- .highlight-stat 박스로 핵심 수치 강조

### STEP 3: 신뢰 증거 (본문 중간에 자연스럽게 배치)
- "실제로 이런 케이스가 있었습니다" → WhyKit이 해결한 사례 2-3개 (자연스러운 언급)
- "업체 선택 시 반드시 확인해야 할 것" → WhyKit의 프로세스가 이를 충족
- "전문가들이 추천하는 방법" → WhyKit의 접근법과 일치
- 절대 과장 금지. "업계 1위" 같은 근거없는 주장 금지. 프로세스/방법론의 투명한 공개로 신뢰 구축

### STEP 4: 행동 유도 (문의 안 하면 손해인 구조)
- 중간 CTA (3번째 H2 뒤):
<div class="cta-inline">
  <p><strong>혼자 고민하면 시간만 낭비됩니다.</strong> WhyKit 전문가가 ${params.primary_keyword}에 대해 무료로 맞춤 분석해 드립니다.</p>
  <a href="/apply" class="cta-button">무료 상담 받기</a>
</div>

- 마무리: "문의하지 않으면 이런 리스크가 있다" (시간 낭비, 비용 초과, 잘못된 선택)
- 하단 CTA:
<div class="cta-bottom">
  <h3>5분 상담으로 수백만 원을 아낄 수 있습니다</h3>
  <p>${params.primary_keyword}, 더 이상 혼자 고민하지 마세요. WhyKit이 무료로 맞춤 상담해 드립니다. 부담은 제로, 얻는 건 확실합니다.</p>
  <a href="/apply" class="cta-button">무료 상담 신청하기</a>
</div>

## 이미지 배치 (총 5개, 반드시 준수)
각 이미지는 해당 섹션의 내용과 직접 연관된 시각 자료여야 합니다:
- IMAGE_PLACEHOLDER_1: 도입부 아래 (독자의 고민 상황을 시각화)
- IMAGE_PLACEHOLDER_2: 첫 번째 H2 중간 (핵심 개념을 쉽게 이해하는 일러스트)
- IMAGE_PLACEHOLDER_3: 비교표/체크리스트 근처 (비교 분석 시각화)
- IMAGE_PLACEHOLDER_4: 중간 CTA 근처 (해결 과정/프로세스 시각화)
- IMAGE_PLACEHOLDER_5: 마지막 H2 또는 결론 (성공적 결과/긍정적 미래)
형식: <img src="IMAGE_PLACEHOLDER_N" alt="[키워드 포함 한국어 15-25자]" loading="lazy">

## FAQ (별도 JSON 필드, 본문에 넣지 마세요)
5개 Q&A: 비용/기간/기술/비교/사후관리 각 1개
- 질문은 독자가 실제로 검색창에 칠 법한 구어체 질문 (예: "홈페이지 만드는데 진짜 얼마나 걸려요?", "싼 업체 vs 비싼 업체, 뭐가 다른 건가요?")
- 질문에 구체적 숫자나 비교 요소 포함 (예: "50만원짜리와 500만원짜리 차이가 뭔가요?")
- "~인가요?" 보다 "~인데 어떡하죠?", "~하면 큰일나나요?", "~안 하면 손해인가요?" 등 감정 포함
- 답변: 핵심 2문장 + WhyKit 접근법 1문장 (100-150자)

## 출력 형식: HTML만 (마크다운 금지!)
태그: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <blockquote>, <strong>, <em>, <a>, <img>, <div>
CSS 클래스: .tip-box, .comparison-table, .checklist, .cta-inline, .cta-bottom, .highlight-stat

## 톤 & 스타일
- 친근하지만 전문적인 한국어 (존댓말 ~합니다)
- 문장 40-60자, 단락 3-4문장
- 후킹력 있는 소제목 (질문형, 숫자형, 반전형)
- 독자에게 직접 말하는 톤 ("여러분", "혹시 이런 경험 있으신가요?")
- 네이버 SEO: 자연스러운 한국어, 핵심 답변 상단 배치

## 절대 금지
- 키워드 스터핑
- "업계 1위", "최고" 같은 근거없는 과장
- AI가 쓴 티 나는 기계적 문체 ("~에 대해 알아보겠습니다", "~라고 할 수 있습니다")
- "결론적으로", "종합해보면", "마지막으로" 같은 상투적 표현
- 마크다운 문법 사용 금지 → HTML만

## JSON 응답 형식
\`\`\`json
{
  "title": "글 제목 (H1, 30-40자, 숫자+키워드+혜택 포함)",
  "meta_title": "SEO 메타 제목 (50-60자)",
  "meta_description": "SEO 메타 설명 (70-80자)",
  "excerpt": "발췌문 (100-150자, 클릭하고 싶은 후킹)",
  "content": "HTML 본문 (IMAGE_PLACEHOLDER_1~5 포함, 5000-7000자)",
  "faq": [
    { "question": "질문", "answer": "답변 (100-150자)" }
  ],
  "tags": ["태그1", "태그2", "태그3", "태그4", "태그5"],
  "reading_time_minutes": 9,
  "image_descriptions": [
    { "position": 1, "alt_ko": "한국어 alt 15-25자", "prompt_en": "DALL-E prompt", "context": "도입부: 독자 고민 시각화" },
    { "position": 2, "alt_ko": "한국어 alt", "prompt_en": "DALL-E prompt", "context": "H2-1: 개념 설명" },
    { "position": 3, "alt_ko": "한국어 alt", "prompt_en": "DALL-E prompt", "context": "비교표 근처" },
    { "position": 4, "alt_ko": "한국어 alt", "prompt_en": "DALL-E prompt", "context": "CTA 근처: 프로세스" },
    { "position": 5, "alt_ko": "한국어 alt", "prompt_en": "DALL-E prompt", "context": "결론: 긍정적 결과" }
  ]
}
\`\`\`

### image_descriptions 작성 지침 (매우 중요):
- 각 이미지의 prompt_en은 해당 섹션의 구체적 내용과 직접 연결
- 스타일: **귀엽고 친근한 플랫 일러스트레이션** (Flat illustration, kawaii-inspired)
  - 둥글둥글한 캐릭터나 오브젝트
  - 밝고 따뜻한 색감 (파스텔 블루, 퍼플, 민트, 코랄)
  - 깔끔한 벡터 느낌, 미니멀하지만 디테일 있는 구성
  - 인포그래픽 요소 (아이콘, 화살표, 차트 형태)
- 반드시 포함: "cute flat illustration style, kawaii-inspired, pastel colors, rounded shapes, NO text NO letters NO words NO numbers, clean vector style, 16:9 aspect ratio"
- alt_ko: SEO 키워드 포함 설명적 한국어 (15-25자)
- context: 이 이미지가 글 어느 부분에서 어떤 역할을 하는지

총 본문 5,000-7,000자. 반드시 유효한 JSON 형식으로만 응답하세요.`;
}

export function getFaqPrompt(topic: string) {
  return `주제 "${topic}"에 대해 5개 FAQ를 작성하세요.

카테고리별 1개씩:
1. 비용 관련
2. 기간 관련
3. 기술 관련
4. 비교 관련
5. 사후관리 관련

각 FAQ 형식:
- 질문: 실제 검색할 법한 자연스러운 한국어
- 답변: 핵심 2문장 + WhyKit 접근법 1문장 (100-150자)

출력 형식 (JSON 배열):
\`\`\`json
[
  { "question": "질문", "answer": "답변" }
]
\`\`\`

반드시 JSON 배열로만 응답하세요.`;
}

export function getImagePrompt(topic: string, style?: string) {
  const baseStyle = style || "cute flat illustration";
  return `Create a ${baseStyle} image about "${topic}" for a Korean web development company blog. Style: cute kawaii-inspired flat illustration with rounded shapes and friendly characters/objects, pastel color palette (soft blue, purple, mint, coral, warm yellow), clean vector aesthetic with subtle gradients, infographic-like composition with icons and visual hierarchy. Requirements: NO text NO letters NO words NO numbers anywhere in the image, NO human faces, warm and approachable feeling, 16:9 aspect ratio, high quality, suitable for a professional but friendly blog article.`;
}
