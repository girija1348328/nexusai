import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchArticles } from "@/api/articles.api";
import { fetchCategories as fetchCategoriesData, fetchTags } from "@/api/categories.api";
import { Layout } from "@/components/layout/Layout";
import { ArticleCard } from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const activeTag = searchParams.get("tag") || "";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles", page, activeCategory, activeTag, search],
    queryFn: () => fetchArticles({ page, limit: 18, category: activeCategory, tag: activeTag, search, status: "PUBLISHED" }),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategoriesData(),
  });

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchTags(),
  });

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    setSearchParams(params);
  };

  return (
    <Layout onSearch={(q) => setParam("search", q)}>
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setParam("category", "")}
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
            !activeCategory
              ? "bg-accent text-accent-foreground"
              : "bg-muted/50 text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {categories?.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setParam("category", cat.slug)}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              activeCategory === cat.slug
                ? "bg-accent text-accent-foreground"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {tags && tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-1.5">
          {tags.slice(0, 20).map((tag) => (
            <button
              key={tag.slug}
              onClick={() => setParam("tag", activeTag === tag.slug ? "" : tag.slug)}
            >
              <Badge variant={activeTag === tag.slug ? "accent" : "default"}>
                {tag.name}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {search && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Results for <span className="text-foreground font-medium">"{search}"</span>
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border p-5">
              <Skeleton className="h-4 w-16 mb-3" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2 mt-4" />
            </div>
          ))}
        </div>
      ) : articles?.articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p className="text-lg">No articles yet</p>
          <p className="text-sm mt-1">Check back soon for new content</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles?.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {articles && articles.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("page", String(page - 1));
                  setSearchParams(params);
                }}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {articles.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= articles.totalPages}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("page", String(page + 1));
                  setSearchParams(params);
                }}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
