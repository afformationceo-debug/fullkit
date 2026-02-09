"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { fadeInUp, staggerContainer } from "@/lib/animations/variants";
import { submitApplyForm } from "@/lib/actions/apply-actions";
import { budgetRanges, referralSources } from "@/lib/validators/apply";
import type { ApplyFormValues } from "@/lib/validators/apply";

const serviceOptions = [
  { value: "homepage" as const, emoji: "🌐", label: "홈페이지", desc: "웹사이트 제작" },
  { value: "app" as const, emoji: "📱", label: "앱", desc: "iOS/Android 앱 개발" },
  { value: "solution" as const, emoji: "⚙️", label: "솔루션", desc: "맞춤형 시스템 개발" },
  { value: "automation" as const, emoji: "⚡", label: "자동화", desc: "업무 자동화 시스템" },
];

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>}>
      <ApplyForm />
    </Suspense>
  );
}

function ApplyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<Partial<ApplyFormValues>>({
    service_type: (preselectedService as ApplyFormValues["service_type"]) || undefined,
    name: "",
    phone: "",
    email: "",
    company: "",
    budget_range: "",
    description: "",
    referral_source: "",
  });

  const totalSteps = 4;

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!form.service_type;
      case 2:
        return !!form.name && !!form.phone && form.phone.length >= 10;
      case 3:
        return !!form.description && form.description.length >= 10;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const result = await submitApplyForm(form as ApplyFormValues);

    if (result.success) {
      router.push("/apply/success");
    } else {
      alert(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-2xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft size={16} /> 돌아가기
          </Link>
          <span className="text-xl font-bold">Full Kit</span>
          <div className="w-20" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mx-auto max-w-2xl px-4 pt-8">
        <div className="flex items-center gap-2 mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < step ? "bg-brand" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{step} / {totalSteps}</p>
      </div>

      {/* Form Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mx-auto max-w-2xl px-4 py-12"
      >
        {step === 1 && (
          <motion.div variants={fadeInUp}>
            <h1 className="text-2xl font-bold mb-2">어떤 서비스가 필요하세요?</h1>
            <p className="text-muted-foreground mb-8">하나를 선택해 주세요.</p>
            <div className="grid grid-cols-2 gap-3">
              {serviceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateForm("service_type", option.value)}
                  className={`rounded-xl border p-5 text-left transition-all ${
                    form.service_type === option.value
                      ? "border-brand bg-brand/5 ring-1 ring-brand"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <h3 className="font-semibold mt-2">{option.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{option.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div variants={fadeInUp}>
            <h1 className="text-2xl font-bold mb-2">연락처를 알려 주세요</h1>
            <p className="text-muted-foreground mb-8">빠르게 연락드릴게요.</p>
            <div className="space-y-5">
              <div>
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="홍길동"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="phone">연락처 *</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  placeholder="010-1234-5678"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="email">이메일 (선택)</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="example@email.com"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="company">회사/브랜드명 (선택)</Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) => updateForm("company", e.target.value)}
                  placeholder="Full Kit"
                  className="mt-1.5"
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div variants={fadeInUp}>
            <h1 className="text-2xl font-bold mb-2">프로젝트에 대해 알려 주세요</h1>
            <p className="text-muted-foreground mb-8">자유롭게 작성해 주세요.</p>
            <div className="space-y-5">
              <div>
                <Label htmlFor="description">프로젝트 설명 *</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  placeholder="만들고 싶은 서비스에 대해 자유롭게 설명해 주세요. 참고 사이트, 필요 기능, 일정 등 어떤 내용이든 좋습니다."
                  className="mt-1.5 min-h-[160px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {form.description?.length || 0}자 (최소 10자)
                </p>
              </div>
              <div>
                <Label>예산 범위 (선택)</Label>
                <RadioGroup
                  value={form.budget_range}
                  onValueChange={(v) => updateForm("budget_range", v)}
                  className="mt-2 grid grid-cols-2 gap-2"
                >
                  {budgetRanges.map((range) => (
                    <Label
                      key={range.value}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                        form.budget_range === range.value
                          ? "border-brand bg-brand/5"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <RadioGroupItem value={range.value} />
                      <span className="text-sm">{range.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div variants={fadeInUp}>
            <h1 className="text-2xl font-bold mb-2">거의 다 됐어요!</h1>
            <p className="text-muted-foreground mb-8">마지막으로 하나만 더.</p>
            <div className="space-y-5">
              <div>
                <Label>Full Kit을 어떻게 알게 되셨나요? (선택)</Label>
                <RadioGroup
                  value={form.referral_source}
                  onValueChange={(v) => updateForm("referral_source", v)}
                  className="mt-2 grid grid-cols-2 gap-2"
                >
                  {referralSources.map((src) => (
                    <Label
                      key={src.value}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                        form.referral_source === src.value
                          ? "border-brand bg-brand/5"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <RadioGroupItem value={src.value} />
                      <span className="text-sm">{src.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-border bg-card p-5 mt-8">
                <h3 className="font-semibold mb-3">신청 내용 확인</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">서비스</span>
                    <span>{serviceOptions.find((s) => s.value === form.service_type)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">이름</span>
                    <span>{form.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">연락처</span>
                    <span>{form.phone}</span>
                  </div>
                  {form.budget_range && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">예산</span>
                      <span>{budgetRanges.find((b) => b.value === form.budget_range)?.label}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={16} className="mr-1" /> 이전
            </Button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              다음 <ArrowRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting || !canProceed()}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-1 animate-spin" /> 접수 중...
                </>
              ) : (
                <>
                  <Check size={16} className="mr-1" /> 신청 완료
                </>
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
