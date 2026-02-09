export interface SeoMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[];
  published_at: string | null;
  reading_time: number;
  view_count: number;
  meta_title: string | null;
  meta_description: string | null;
  faq_schema: FaqItem[] | null;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ApplyFormData {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  service_type: "homepage" | "app" | "solution" | "automation";
  budget_range?: string;
  description: string;
  referral_source?: string;
}
