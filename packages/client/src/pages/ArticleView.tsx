import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchArticle } from "@/api/articles.api";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Sparkles } from "lucide-react";

export function ArticleViewPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticle(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-6 w-24 mb-6" />
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-5 w-48 mb-8" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto text-center py-20">
          <p className="text-muted-foreground text-lg">Article not found</p>
          <Link to="/" className="text-muted-foreground hover:text-foreground text-sm mt-2 inline-block">
            ← Back to home
          </Link>
        </div>
      </Layout>
    );
  }

  const published = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  let keyTakeaways: string[] = [];
  if (article.aiKeyTakeaways) {
    try {
      keyTakeaways = JSON.parse(article.aiKeyTakeaways);
    } catch {
      keyTakeaways = [];
    }
  }

  return (
    <Layout>
      <article className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to articles
        </Link>

        <div className="flex items-center gap-2 mb-4">
          {article.category && (
            <Link to={`/?category=${article.category.slug}`}>
              <Badge variant="outline">{article.category.name}</Badge>
            </Link>
          )}
          {article.aiSummary && (
            <Badge variant="default">AI</Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold leading-tight mb-3">
          {article.title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          {article.author && <span>{article.author.name}</span>}
          {published && (
            <>
              <span>·</span>
              <span>{published}</span>
            </>
          )}
        </div>

        {article.coverImage && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {article.aiSummary && (
          <div className="mb-8 rounded-lg border border-border bg-card/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">AI Summary</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{article.aiSummary}</p>
          </div>
        )}

        {keyTakeaways.length > 0 && (
          <div className="mb-8 rounded-lg border border-border p-5">
            <h3 className="text-sm font-medium text-foreground mb-3">Key Takeaways</h3>
            <ul className="space-y-2">
              {keyTakeaways.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground/50" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          className="text-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link key={tag.id} to={`/?tag=${tag.slug}`}>
                  <Badge variant="outline">{tag.name}</Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </Layout>
  );
}
