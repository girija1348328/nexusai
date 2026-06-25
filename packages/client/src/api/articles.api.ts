import api from "./client";

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  aiSummary: string | null;
  aiKeyTakeaways: string | null;
  aiTags: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  coverImage: string | null;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: { id: string; name: string; avatar: string | null };
  category: { id: string; name: string; slug: string } | null;
  tags: Array<{ id: string; name: string; slug: string }>;
}

export interface ArticleListResponse {
  articles: Article[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ArticleParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  status?: string;
}

export async function fetchArticles(params?: ArticleParams): Promise<ArticleListResponse> {
  const { data } = await api.get("/articles", { params });
  return data;
}

export async function fetchArticle(slug: string): Promise<Article> {
  const { data } = await api.get(`/articles/${slug}`);
  return data;
}

export async function createArticle(body: {
  title: string;
  content: string;
  excerpt?: string;
  categoryId?: string;
  coverImage?: string;
  status?: string;
}): Promise<Article> {
  const { data } = await api.post("/articles", body);
  return data;
}

export async function updateArticle(
  id: string,
  body: Partial<{ title: string; content: string; excerpt: string; categoryId: string; coverImage: string; status: string }>
): Promise<Article> {
  const { data } = await api.put(`/articles/${id}`, body);
  return data;
}

export async function generateAIMetadata(id: string): Promise<Article & { aiKeyTakeaways: string[] }> {
  const { data } = await api.post(`/articles/${id}/generate-ai`);
  return data;
}

export async function deleteArticle(id: string): Promise<void> {
  await api.delete(`/articles/${id}`);
}
