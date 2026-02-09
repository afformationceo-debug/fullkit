import Link from "next/link";
import { CheckCircle, MessageCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "신청 완료",
};

export default function ApplySuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold mb-3">신청이 완료되었습니다!</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          24시간 내에 전문 컨설턴트가 연락드리겠습니다.
          <br />
          빠른 상담을 원하시면 카카오톡으로 문의해 주세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            asChild
            className="bg-kakao text-kakao-foreground border-kakao hover:bg-kakao/90"
          >
            <Link
              href={process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={16} className="mr-2" />
              카카오톡 상담
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home size={16} className="mr-2" />
              홈으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
