import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>

          <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground">
            <p>Full Kit (이하 &quot;회사&quot;)은 개인정보보호법에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.</p>

            <h2 className="text-xl font-bold mt-8 mb-4">1. 수집하는 개인정보</h2>
            <p>회사는 프로젝트 상담 및 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>필수항목: 이름, 연락처</li>
              <li>선택항목: 이메일, 회사명, 예산 범위</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">2. 개인정보의 이용 목적</h2>
            <p>수집된 개인정보는 다음의 목적으로 이용됩니다.</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>프로젝트 상담 및 견적 제공</li>
              <li>서비스 안내 및 마케팅 정보 전달</li>
              <li>고객 문의 응대</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">3. 개인정보의 보유 및 이용 기간</h2>
            <p>회사는 개인정보 수집·이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관련 법령에 의한 보존 의무가 있는 경우 해당 기간 동안 보관합니다.</p>

            <h2 className="text-xl font-bold mt-8 mb-4">4. 개인정보의 제3자 제공</h2>
            <p>회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.</p>

            <h2 className="text-xl font-bold mt-8 mb-4">5. 문의처</h2>
            <p>개인정보 관련 문의: info@fullkit.kr</p>

            <p className="mt-8 text-sm text-muted-foreground">시행일: 2026년 1월 1일</p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
