import { z } from "zod";

export const applyFormSchema = z.object({
  name: z.string().min(2, "이름을 입력해 주세요."),
  phone: z
    .string()
    .min(10, "연락처를 정확히 입력해 주세요.")
    .regex(/^[\d-]+$/, "올바른 연락처 형식이 아닙니다."),
  email: z.string().email("올바른 이메일 주소를 입력해 주세요.").optional().or(z.literal("")),
  company: z.string().optional(),
  service_type: z.enum(["homepage", "app", "solution", "automation"], {
    message: "서비스를 선택해 주세요.",
  }),
  budget_range: z.string().optional(),
  description: z.string().min(10, "프로젝트에 대해 10자 이상 설명해 주세요."),
  referral_source: z.string().optional(),
});

export type ApplyFormValues = z.infer<typeof applyFormSchema>;

export const budgetRanges = [
  { value: "under-300", label: "300만원 미만" },
  { value: "300-500", label: "300만원 ~ 500만원" },
  { value: "500-1000", label: "500만원 ~ 1,000만원" },
  { value: "1000-3000", label: "1,000만원 ~ 3,000만원" },
  { value: "3000-5000", label: "3,000만원 ~ 5,000만원" },
  { value: "over-5000", label: "5,000만원 이상" },
  { value: "undecided", label: "미정 / 상담 후 결정" },
] as const;

export const referralSources = [
  { value: "google", label: "구글 검색" },
  { value: "naver", label: "네이버 검색" },
  { value: "referral", label: "지인 추천" },
  { value: "kmong", label: "크몽" },
  { value: "youtube", label: "유튜브" },
  { value: "instagram", label: "인스타그램" },
  { value: "other", label: "기타" },
] as const;
