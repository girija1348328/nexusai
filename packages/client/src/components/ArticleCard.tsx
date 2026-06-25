import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Article } from "@/api/articles.api";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const published = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Link to={`/article/${article.slug}`}>
      <Card className="group h-full flex flex-col overflow-hidden transition-all duration-200 hover:bg-card-hover">
        {article.coverImage && (
          <div className="aspect-[2/1] overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 mb-3">
          {article.category && (
            <Badge variant="outline">{article.category.name}</Badge>
          )}
          {article.aiSummary && (
            <Badge variant="default">AI</Badge>
          )}
        </div>

        <h2 className="text-base font-semibold leading-snug mb-2 text-foreground group-hover:text-foreground transition-colors">
          {article.title}
        </h2>

        {(article.aiSummary || article.excerpt) && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {article.aiSummary || article.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground/70">
          {article.author && (
            <span>{article.author.name}</span>
          )}
          {published && (
            <>
              <span>·</span>
              <span>{published}</span>
            </>
          )}
        </div>
      </div>
      </Card>
    </Link>
  );
}
