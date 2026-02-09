const OPENAI_API_URL = "https://api.openai.com/v1";

export async function generateImage(
  prompt: string,
  options?: {
    model?: string;
    size?: string;
    quality?: string;
  }
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const response = await fetch(`${OPENAI_API_URL}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options?.model || "dall-e-3",
      prompt,
      n: 1,
      size: options?.size || "1792x1024",
      quality: options?.quality || "standard",
      response_format: "url",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.data[0]?.url || "";
}

export async function downloadAndUploadImage(
  imageUrl: string,
  supabaseClient: ReturnType<typeof import("@supabase/supabase-js").createClient>,
  path: string
): Promise<string> {
  // Download image from DALL-E URL
  const imageResponse = await fetch(imageUrl);
  const imageBlob = await imageResponse.blob();
  const buffer = Buffer.from(await imageBlob.arrayBuffer());

  // Upload to Supabase Storage
  const { error } = await supabaseClient.storage
    .from("blog-images")
    .upload(path, buffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) throw new Error(`Storage upload error: ${error.message}`);

  // Get public URL
  const { data } = supabaseClient.storage.from("blog-images").getPublicUrl(path);
  return data.publicUrl;
}
