import api from "./client";

export async function login(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password });
  return data as { token: string; user: User };
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data as User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
}
