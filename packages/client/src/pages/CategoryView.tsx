import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchArticles } from "@/api/articles.api";
import { fetchCategory } from "@/api/categories.api";
import { Layout } from "@/components/layout/Layout";
import { ArticleCard } from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export function CategoryViewPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: category } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => fetchCategory(slug!),
    enabled: !!slug,
  });

  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles", "category", slug],
    queryFn: () => fetchArticles({ category: slug, status: "PUBLISHED" }),
    enabled: !!slug,
  });

  return (
    <Layout>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to all articles
      </Link>

      {category && (
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">{category.name}</h1>
          {category.description && (
            <p className="text-sm text-muted-foreground">{category.description}</p>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border p-5">
              <Skeleton className="h-4 w-16 mb-3" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-1" />
            </div>
          ))}
        </div>
      ) : articles?.articles.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <p className="text-lg">No articles in this category yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles?.articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </Layout>
  );
}
