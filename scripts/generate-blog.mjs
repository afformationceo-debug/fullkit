// Local blog generation script - 5 images per post
// Usage: node scripts/generate-blog.mjs
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Load .env.local manually
const __dirname = dirname(fileURLToPath(import.meta.url));
const envFile = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf8');
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const OPENAI_API_URL = "https://api.openai.com/v1";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ---- Claude ----
async function callClaude(prompt) {
  const res = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 8192,
      temperature: 0.7,
      system: "You are a helpful assistant that responds in valid JSON format when asked. Ensure all JSON is properly escaped.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content[0]?.text || "";
}

function extractBracketBlock(str, startIdx) {
  // Extract a [...] or {...} block with proper bracket matching
  const open = str[startIdx];
  const close = open === '[' ? ']' : '}';
  let depth = 1;
  let pos = startIdx + 1;
  let inString = false;
  while (pos < str.length && depth > 0) {
    const ch = str[pos];
    if (inString) {
      if (ch === '\\') { pos += 2; continue; }
      if (ch === '"') inString = false;
    } else {
      if (ch === '"') inString = true;
      else if (ch === open) depth++;
      else if (ch === close) depth--;
    }
    pos++;
  }
  return str.substring(startIdx, pos);
}

function parseJson(text) {
  // Try 1: Extract from code fence
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  let jsonStr = fenceMatch ? fenceMatch[1].trim() : text.trim();

  // Try 2: Find outermost { } if not starting with {
  if (!jsonStr.startsWith('{')) {
    const braceIdx = jsonStr.indexOf('{');
    if (braceIdx >= 0) {
      jsonStr = extractBracketBlock(jsonStr, braceIdx);
    }
  }

  // Try 3: Direct parse
  try {
    return JSON.parse(jsonStr);
  } catch (e1) {
    // Try 4: Fix common issues and re-parse
    try {
      const fixed = jsonStr
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
        .replace(/\n/g, '\\n')
        .replace(/\t/g, '\\t');
      return JSON.parse(fixed);
    } catch (e2) {
      // Noop
    }
  }

  console.log("   ⚠️ JSON 직접 파싱 실패, 필드별 추출 시도...");

  const extract = (field) => {
    const re = new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
    const m = jsonStr.match(re);
    return m ? m[1].replace(/\\"/g, '"').replace(/\\n/g, '\n') : "";
  };

  // Extract content - find "content": " then match until the closing pattern
  let content = "";
  const contentIdx = jsonStr.indexOf('"content"');
  if (contentIdx >= 0) {
    const colonIdx = jsonStr.indexOf(':', contentIdx + 9);
    const quoteIdx = jsonStr.indexOf('"', colonIdx + 1);
    if (quoteIdx >= 0) {
      let pos = quoteIdx + 1;
      let result = "";
      while (pos < jsonStr.length) {
        if (jsonStr[pos] === '\\') {
          result += jsonStr[pos] + jsonStr[pos + 1];
          pos += 2;
          continue;
        }
        if (jsonStr[pos] === '"') break;
        result += jsonStr[pos];
        pos++;
      }
      content = result.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    }
  }

  // Extract FAQ array with bracket matching
  let faq = [];
  const faqIdx = jsonStr.indexOf('"faq"');
  if (faqIdx >= 0) {
    const bracketIdx = jsonStr.indexOf('[', faqIdx);
    if (bracketIdx >= 0) {
      const faqArrayStr = extractBracketBlock(jsonStr, bracketIdx);
      try {
        faq = JSON.parse(faqArrayStr);
      } catch {
        const questions = [...faqArrayStr.matchAll(/"question"\s*:\s*"((?:[^"\\\\]|\\\\.)*)"/g)].map(m => m[1]);
        const answers = [...faqArrayStr.matchAll(/"answer"\s*:\s*"((?:[^"\\\\]|\\\\.)*)"/g)].map(m => m[1]);
        faq = questions.map((q, i) => ({ question: q, answer: answers[i] || "" }));
      }
    }
  }

  // Extract tags array
  let tags = [];
  const tagsIdx = jsonStr.indexOf('"tags"');
  if (tagsIdx >= 0) {
    const bracketIdx = jsonStr.indexOf('[', tagsIdx);
    if (bracketIdx >= 0) {
      const tagsArrayStr = extractBracketBlock(jsonStr, bracketIdx);
      try {
        tags = JSON.parse(tagsArrayStr);
      } catch {
        tags = tagsArrayStr.match(/"((?:[^"\\\\]|\\\\.)*)"/g)?.map(s => s.replace(/^"|"$/g, '')) || [];
      }
    }
  }

  // Extract image_descriptions array
  let image_descriptions = [];
  const imgIdx = jsonStr.indexOf('"image_descriptions"');
  if (imgIdx >= 0) {
    const bracketIdx = jsonStr.indexOf('[', imgIdx);
    if (bracketIdx >= 0) {
      const imgArrayStr = extractBracketBlock(jsonStr, bracketIdx);
      try {
        image_descriptions = JSON.parse(imgArrayStr);
      } catch {
        const positions = [...imgArrayStr.matchAll(/"position"\s*:\s*(\d+)/g)].map(m => parseInt(m[1]));
        const alts = [...imgArrayStr.matchAll(/"alt_ko"\s*:\s*"((?:[^"\\\\]|\\\\.)*)"/g)].map(m => m[1]);
        const prompts = [...imgArrayStr.matchAll(/"prompt_en"\s*:\s*"((?:[^"\\\\]|\\\\.)*)"/g)].map(m => m[1]);
        image_descriptions = positions.map((p, i) => ({
          position: p, alt_ko: alts[i] || "", prompt_en: prompts[i] || ""
        }));
      }
    }
  }

  return {
    title: extract("title"),
    meta_title: extract("meta_title"),
    meta_description: extract("meta_description"),
    excerpt: extract("excerpt"),
    content,
    faq,
    tags,
    reading_time_minutes: parseInt(jsonStr.match(/"reading_time_minutes"\s*:\s*(\d+)/)?.[1] || "9"),
    image_descriptions,
  };
}

// ---- DALL-E ----
async function generateImage(prompt) {
  const res = await fetch(`${OPENAI_API_URL}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1792x1024",
      quality: "standard",
      response_format: "url",
    }),
  });
  if (!res.ok) throw new Error(`DALL-E ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.data[0]?.url || "";
}

async function uploadImage(url, path) {
  const imgRes = await fetch(url);
  const buffer = Buffer.from(await imgRes.arrayBuffer());
  const { error } = await supabase.storage
    .from("blog-images")
    .upload(path, buffer, { contentType: "image/png", upsert: true });
  if (error) throw new Error(`Upload: ${error.message}`);
  const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
  return data.publicUrl;
}

// ---- Utils ----
function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s가-힣-]/g, "").replace(/\s+/g, "-").replace(/--+/g, "-").trim();
}

function safeStorageName(text) {
  return text.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/--+/g, "-").substring(0, 50);
}

// ---- Prompt ----
function getPrompt(kw, secondary, audience, svc) {
  return `당신은 한국 최고의 전환율 전문 콘텐츠 마케터입니다. 'WhyKit' 웹개발 기업의 블로그 글을 작성합니다.
이 글의 유일한 목표: 독자가 읽고 나서 "WhyKit에 상담 신청해야겠다"고 행동하게 만드는 것입니다.

## 회사 정보
- WhyKit (와이킷): 홈페이지 제작, 앱 개발, 솔루션 개발, 업무 자동화 전문
- 타겟: ${audience}
- 전환 경로: /apply (무료 상담 신청)

## SEO/AEO
- 메인 키워드: ${kw}
- 보조 키워드: ${secondary}
- 키워드 밀도: 1.5-2.5%

## ★ 글 구조: 4단계 설득 프레임워크 (반드시 준수)

### STEP 1: 공감 후킹 (도입부, 400자)
- 첫 문장은 독자가 "어, 이거 나 얘기인데?" 하고 멈추게 만드는 극강 후킹
- 독자가 지금 겪고 있을 구체적 상황/감정을 묘사
- "이 글 하나면 해결됩니다" 식의 강력한 가치 약속
- AEO: 핵심 답변을 2-3문장에 직접 배치
- 도입부 아래: <img src="IMAGE_PLACEHOLDER_1" alt="[키워드 포함 한국어 15-25자]" loading="lazy">

### STEP 2: 문제 해결 (본문 H2 4-5개)
각 H2는 독자의 구체적 고민 하나를 해결:
- H2 제목: 독자의 질문 형태
- 첫 2-3문장: 직접적 답변 (AEO)
- H3 세부 전개: 구체적 숫자, 비교표, 체크리스트
- 필수: 비교표 1개+, 체크리스트 1개+, 구체적 숫자 5개+, .highlight-stat 강조

### STEP 3: 신뢰 증거 (자연스러운 WhyKit 언급 2-3회)
- WhyKit이 해결한 사례, 프로세스 투명 공개, 과장 금지

### STEP 4: 행동 유도 (문의 안 하면 손해)
- 중간 CTA (3번째 H2 뒤):
<div class="cta-inline"><p><strong>혼자 고민하면 시간만 낭비됩니다.</strong> WhyKit 전문가가 ${kw}에 대해 무료로 맞춤 분석해 드립니다.</p><a href="/apply" class="cta-button">무료 상담 받기</a></div>
- 하단 CTA:
<div class="cta-bottom"><h3>5분 상담으로 수백만 원을 아낄 수 있습니다</h3><p>${kw}, 더 이상 혼자 고민하지 마세요. WhyKit이 무료로 맞춤 상담해 드립니다.</p><a href="/apply" class="cta-button">무료 상담 신청하기</a></div>

## 이미지 배치 (총 5개): 각 이미지는 해당 섹션 내용과 직접 연관!
- IMAGE_PLACEHOLDER_1: 도입부 (독자 고민 시각화)
- IMAGE_PLACEHOLDER_2: H2-1 중간 (개념 이해 일러스트)
- IMAGE_PLACEHOLDER_3: 비교표 근처 (비교 분석 시각화)
- IMAGE_PLACEHOLDER_4: CTA 근처 (프로세스 시각화)
- IMAGE_PLACEHOLDER_5: 마지막 H2 (긍정적 결과)
형식: <img src="IMAGE_PLACEHOLDER_N" alt="[키워드 포함 한국어 15-25자]" loading="lazy">

## FAQ: 별도 JSON 필드 (본문에 넣지 마세요), 5개 Q&A
## 출력: HTML만 (마크다운 금지!)
태그: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <blockquote>, <strong>, <em>, <a>, <img>, <div>
CSS: .tip-box, .comparison-table, .checklist, .cta-inline, .cta-bottom, .highlight-stat
## 톤: 친근+전문 한국어, 존댓말, 후킹 소제목, 독자에게 직접 말하기
## 금지: 키워드 스터핑, 근거없는 과장, AI 문체, 상투적 표현, 마크다운

## JSON 응답:
\`\`\`json
{
  "title": "글 제목 30-40자 (숫자+키워드+혜택)",
  "meta_title": "SEO 메타 제목 50-60자",
  "meta_description": "SEO 메타 설명 70-80자",
  "excerpt": "발췌문 100-150자 (후킹)",
  "content": "HTML 본문 (IMAGE_PLACEHOLDER_1~5 포함, 5000-7000자)",
  "faq": [{"question":"질문","answer":"답변 100-150자"}],
  "tags": ["태그1","태그2","태그3","태그4","태그5"],
  "reading_time_minutes": 9,
  "image_descriptions": [
    {"position":1,"alt_ko":"한국어 alt","prompt_en":"DALL-E prompt with cute flat illustration style","context":"도입부"},
    {"position":2,"alt_ko":"한국어 alt","prompt_en":"DALL-E prompt","context":"H2-1"},
    {"position":3,"alt_ko":"한국어 alt","prompt_en":"DALL-E prompt","context":"비교표"},
    {"position":4,"alt_ko":"한국어 alt","prompt_en":"DALL-E prompt","context":"CTA"},
    {"position":5,"alt_ko":"한국어 alt","prompt_en":"DALL-E prompt","context":"결론"}
  ]
}
\`\`\`

image_descriptions 지침:
- prompt_en: 해당 섹션 내용과 직접 연결된 구체적 DALL-E 프롬프트
- 스타일: 귀엽고 친근한 플랫 일러스트레이션 (kawaii-inspired, pastel colors, rounded shapes)
- 필수 문구: "cute flat illustration style, kawaii-inspired, pastel colors, rounded shapes, NO text NO letters NO words NO numbers, clean vector style, 16:9 aspect ratio"
- alt_ko: SEO 키워드 포함 한국어 15-25자

총 5,000-7,000자. JSON만 응답.`;
}

function getDefaultImagePrompt(topic, position) {
  const styles = [
    `cute flat illustration of a person confused while looking at multiple computer screens, representing the challenge of "${topic}"`,
    `cute flat illustration explaining the concept of "${topic}" with icons and visual diagrams, educational infographic style`,
    `cute flat illustration showing a comparison chart or checklist for "${topic}", with balanced scales or side-by-side elements`,
    `cute flat illustration of a friendly professional guiding someone through a step-by-step process for "${topic}"`,
    `cute flat illustration showing a happy successful outcome after completing "${topic}", celebration and achievement theme`
  ];
  const style = styles[position - 1] || styles[0];
  return `${style}. Style: kawaii-inspired flat vector illustration, pastel color palette (soft blue, purple, mint, coral, warm yellow), rounded friendly shapes, clean composition with subtle gradients. Requirements: NO text NO letters NO words NO numbers anywhere, NO human faces, warm approachable feeling, 16:9 aspect ratio, high quality.`;
}

// ---- Main ----
async function main() {
  console.log("🔍 미사용 키워드 조회 중...");

  const { data: keywords } = await supabase
    .from("blog_keywords")
    .select("*")
    .eq("used", false)
    .order("priority", { ascending: false })
    .limit(1);

  if (!keywords?.length) {
    console.log("❌ 미사용 키워드가 없습니다.");
    return;
  }

  const kw = keywords[0];
  console.log(`\n📝 키워드: "${kw.keyword}" (priority: ${kw.priority})`);

  // Step 1: Claude - Generate article
  console.log("\n🤖 Claude로 글 생성 중...");
  const t1 = Date.now();
  const prompt = getPrompt(
    kw.keyword,
    (kw.secondary_keywords || []).join(", "),
    kw.target_audience || "홈페이지/앱 제작을 고려하는 사업주",
    kw.service_category || "homepage"
  );
  const response = await callClaude(prompt);
  const parsed = parseJson(response);
  console.log(`   ✅ 완료 (${((Date.now() - t1) / 1000).toFixed(1)}초)`);
  console.log(`   제목: ${parsed.title}`);
  console.log(`   본문: ${parsed.content.length}자`);
  console.log(`   FAQ: ${parsed.faq?.length || 0}개`);
  console.log(`   이미지 설명: ${parsed.image_descriptions?.length || 0}개`);

  const slug = slugify(parsed.title);
  const safeName = safeStorageName(slug);

  // Step 2: Generate 5 DALL-E images in parallel
  console.log("\n🎨 DALL-E 이미지 5개 병렬 생성 중...");
  const t2 = Date.now();
  const imageUrls = {};

  const imagePromises = [];
  for (let i = 1; i <= 5; i++) {
    const imgDesc = (parsed.image_descriptions || []).find(d => d.position === i);
    const dallePrompt = imgDesc?.prompt_en || getDefaultImagePrompt(kw.keyword, i);

    imagePromises.push(
      (async () => {
        try {
          console.log(`   🖼️  이미지 ${i} 생성 시작...`);
          const tempUrl = await generateImage(dallePrompt);
          const storagePath = `content/${Date.now()}-${safeName}-${i}.png`;
          const publicUrl = await uploadImage(tempUrl, storagePath);
          imageUrls[i] = publicUrl;
          console.log(`   ✅ 이미지 ${i} 완료`);
        } catch (err) {
          console.log(`   ⚠️ 이미지 ${i} 실패: ${err.message}`);
        }
      })()
    );

    // Stagger by 2 seconds to avoid rate limits
    if (i < 5) await new Promise(r => setTimeout(r, 2000));
  }
  await Promise.all(imagePromises);
  console.log(`   ✅ 총 ${Object.keys(imageUrls).length}/5개 이미지 완료 (${((Date.now() - t2) / 1000).toFixed(1)}초)`);

  // Step 3: Replace image placeholders with actual URLs + alt tags
  let content = parsed.content;
  for (let i = 1; i <= 5; i++) {
    if (imageUrls[i]) {
      // Replace placeholder, preserving existing alt text
      content = content.replace(
        new RegExp(`<img[^>]*src=["']IMAGE_PLACEHOLDER_${i}["'][^>]*>`, 'g'),
        (match) => {
          const altMatch = match.match(/alt=["']([^"']*)["']/);
          const alt = altMatch ? altMatch[1] : (parsed.image_descriptions?.find(d => d.position === i)?.alt_ko || kw.keyword);
          return `<img src="${imageUrls[i]}" alt="${alt}" loading="lazy">`;
        }
      );
      // Also handle plain placeholder text
      content = content.replace(new RegExp(`IMAGE_PLACEHOLDER_${i}`, 'g'), imageUrls[i]);
    }
  }
  // Remove any unreplaced placeholders
  content = content.replace(/<img[^>]*IMAGE_PLACEHOLDER_\d+[^>]*>/g, "");

  // Cover image = first image
  const coverImageUrl = imageUrls[1] || null;

  // FAQ is rendered by the frontend component, not embedded in content

  // Step 5: FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (parsed.faq || []).map(f => ({
      "@type": "Question", name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer }
    }))
  };

  // Step 6: Compute quality score
  const plainText = content.replace(/<[^>]*>/g, "");
  const h2Count = (content.match(/<h2/gi) || []).length;
  const ctaCount = (content.match(/\/apply/g) || []).length;
  const imgCount = (content.match(/<img/gi) || []).length;
  let score = 0;
  if (parsed.title.length >= 15 && parsed.title.length <= 45) score += 10;
  if (parsed.meta_description?.length >= 50 && parsed.meta_description?.length <= 160) score += 10;
  if (plainText.length >= 2000 && plainText.length <= 8000) score += 15;
  if (h2Count >= 3 && h2Count <= 7) score += 15;
  if ((parsed.faq || []).length >= 5) score += 10;
  if (ctaCount >= 2) score += 10;
  if (parsed.title.includes(kw.keyword)) score += 10;
  if ((parsed.tags || []).length >= 3) score += 10;
  if (/<table/i.test(content) || /<ul|<ol/i.test(content)) score += 5;
  if (imgCount >= 3) score += 5; // Bonus for images

  const scheduledFor = new Date();
  scheduledFor.setHours(scheduledFor.getHours() + 24);
  const isValid = score >= 50;

  console.log(`\n📊 품질 점수: ${score}/100`);
  console.log(`   이미지: ${imgCount}개`);
  console.log(`   H2: ${h2Count}개, CTA: ${ctaCount}개`);
  console.log(`   본문: ${plainText.length}자`);

  // Step 7: Insert
  console.log("\n💾 DB 저장 중...");
  const { data: insertedPost, error: insertError } = await supabase
    .from("blog_posts")
    .insert({
      title: parsed.title,
      slug,
      content,
      excerpt: parsed.excerpt,
      category: kw.category || "인사이트",
      tags: parsed.tags || [],
      meta_title: parsed.meta_title,
      meta_description: parsed.meta_description,
      cover_image_url: coverImageUrl,
      faq_schema: faqSchema,
      reading_time_minutes: parsed.reading_time_minutes || 8,
      status: isValid ? "scheduled" : "draft",
      scheduled_for: isValid ? scheduledFor.toISOString() : null,
      primary_keyword: kw.keyword,
      quality_score: score,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error(`❌ DB 저장 실패: ${insertError.message}`);
    return;
  }

  // Step 8: Mark keyword as used
  await supabase
    .from("blog_keywords")
    .update({ used: true, blog_post_id: insertedPost.id })
    .eq("id", kw.id);

  console.log(`✅ 블로그 글 생성 완료!`);
  console.log(`   ID: ${insertedPost.id}`);
  console.log(`   제목: ${parsed.title}`);
  console.log(`   슬러그: ${slug}`);
  console.log(`   이미지: ${Object.keys(imageUrls).length}개`);
  console.log(`   품질: ${score}/100`);

  // Step 9: 즉시 발행
  console.log("\n🚀 즉시 발행 중...");
  const { error: publishError } = await supabase
    .from("blog_posts")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", insertedPost.id);

  if (publishError) {
    console.error(`❌ 발행 실패: ${publishError.message}`);
  } else {
    console.log(`✅ 발행 완료!`);
    console.log(`\n🌐 확인 URL:`);
    console.log(`   블로그: https://whykit.io/blog/${slug}`);
    console.log(`   블로그 목록: https://whykit.io/blog`);
  }
}

main().catch(console.error);
