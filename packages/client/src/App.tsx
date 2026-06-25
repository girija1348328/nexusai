import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { Toaster } from "react-hot-toast";
import { HomePage } from "@/pages/Home";
import { ArticleViewPage } from "@/pages/ArticleView";
import { CategoryViewPage } from "@/pages/CategoryView";
import { LoginPage } from "@/pages/admin/Login";
import { DashboardPage } from "@/pages/admin/Dashboard";
import { ArticleEditorPage } from "@/pages/admin/ArticleEditor";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/article/:slug" element={<ArticleViewPage />} />
              <Route path="/category/:slug" element={<CategoryViewPage />} />
              <Route path="/admin/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/articles/new"
                element={
                  <ProtectedRoute>
                    <ArticleEditorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/articles/:id/edit"
                element={
                  <ProtectedRoute>
                    <ArticleEditorPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "var(--color-card)",
                  color: "var(--color-foreground)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
