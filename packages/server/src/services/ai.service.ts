import OpenAI from "openai";
import { config } from "../config";

const openai = new OpenAI({
  apiKey: config.deepseek.apiKey,
  baseURL: config.deepseek.baseUrl,
});

export async function generateArticleMetadata(
  title: string,
  content: string,
  existingTags: string[]
): Promise<{
  summary: string;
  keyTakeaways: string[];
  tags: string[];
  seoTitle: string;
  seoDescription: string;
}> {
  const tagList = existingTags.length > 0 ? existingTags.join(", ") : "AI, Development, Technology, Startup, Software";

  const prompt = `You are an AI content editor for a tech publication called NexusAI.

Given the article title and content below, generate the following metadata:

1. A 2-3 sentence summary of the article.
2. 3-5 key takeaways as bullet points.
3. 3-5 relevant tags from or similar to: ${tagList}
4. SEO title (max 60 characters).
5. SEO description (max 160 characters).

Return your answer as valid JSON in this exact format:
{
  "summary": "...",
  "keyTakeaways": ["...", "..."],
  "tags": ["...", "..."],
  "seoTitle": "...",
  "seoDescription": "..."
}

Title: ${title}

Content: ${content.substring(0, 4000)}`;

  const response = await openai.chat.completions.create({
    model: config.deepseek.model,
    messages: [
      {
        role: "system",
        content: "You are an AI content editor. Always respond with valid JSON only, no markdown.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const raw = response.choices[0]?.message?.content || "{}";
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  return {
    summary: parsed.summary || "",
    keyTakeaways: parsed.keyTakeaways || [],
    tags: parsed.tags || [],
    seoTitle: parsed.seoTitle || title.substring(0, 60),
    seoDescription: parsed.seoDescription || "",
  };
}
