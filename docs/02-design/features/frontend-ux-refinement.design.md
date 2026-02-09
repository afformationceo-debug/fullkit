# Design: Frontend UX/UI Refinement

## 1. 기술 스택 및 라이브러리
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 2. 디자인 상세 가이드

### 2.1 Header & Mobile Menu
- **Nav Item Animation**: `initial: { x: -20, opacity: 0 }, animate: { x: 0, opacity: 1 }`
- **Stagger Delay**: 각 항목당 `0.1s` 간격 부여.
- **Glassmorphism**: `backdrop-blur-2xl`, `bg-background/70`, `border-b border-border/40`.

### 2.2 HeroSection Typography
- **Desktop H1**: `text-8xl` or `text-9xl`.
- **Tablet H1**: `text-7xl`.
- **Mobile H1**: `text-5xl` (가독성 최우선, 줄바꿈 고려).
- **Gradient**: `from-brand via-brand/80 to-brand/50` 배경 텍스트.

### 2.3 Interactive Elements
- **Mouse Light**: `framer-motion`의 `useMotionValue`를 사용하여 커서 좌표 추적, 배경 `Radial Gradient` 위치 업데이트.
- **Magnetic Button**: `hover` 상태에서 `x, y` 값을 커서 방향으로 미세하게(약 5-10px) 이동.

### 2.4 Layout & Spacing
- **Section Padding**: 
  - Desktop: `py-32`
  - Tablet: `py-24`
  - Mobile: `py-16`

## 3. 컴포넌트 구조 변경
- `src/components/layout/Header.tsx`: 모바일 메뉴 애니메이션 로직 분리/강화.
- `src/components/landing/HeroSection.tsx`: 반응형 폰트 사이즈 및 마우스 인터랙션 레이어 추가.
- `src/components/landing/ServiceShowcase.tsx`: 탭 네비게이션 가로 스크롤 및 마스크 효과 추가.
