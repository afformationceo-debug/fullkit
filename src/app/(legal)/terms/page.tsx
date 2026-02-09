import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "이용약관",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold mb-8">이용약관</h1>

          <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground">
            <h2 className="text-xl font-bold mt-8 mb-4">제1조 (목적)</h2>
            <p>이 약관은 WhyKit (이하 &quot;회사&quot;)이 제공하는 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>

            <h2 className="text-xl font-bold mt-8 mb-4">제2조 (서비스의 내용)</h2>
            <p>회사가 제공하는 서비스는 다음과 같습니다.</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>홈페이지 기획, 디자인, 개발</li>
              <li>모바일 앱 기획, 디자인, 개발</li>
              <li>맞춤형 솔루션 개발</li>
              <li>업무 자동화 시스템 구축</li>
              <li>유지보수 및 기술 지원</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">제3조 (계약의 성립)</h2>
            <p>서비스 이용 계약은 이용자의 프로젝트 신청과 회사의 승낙으로 성립됩니다.</p>

            <h2 className="text-xl font-bold mt-8 mb-4">제4조 (책임 제한)</h2>
            <p>회사는 천재지변 등 불가항력적인 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</p>

            <p className="mt-8 text-sm text-muted-foreground">시행일: 2026년 1월 1일</p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
