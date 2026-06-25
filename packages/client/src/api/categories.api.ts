import api from "./client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get("/categories");
  return data;
}

export async function fetchCategory(slug: string): Promise<Category> {
  const { data } = await api.get(`/categories/${slug}`);
  return data;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export async function fetchTags(): Promise<Tag[]> {
  const { data } = await api.get("/tags");
  return data;
}
