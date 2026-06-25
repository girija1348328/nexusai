import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createArticle, updateArticle, fetchArticle, generateAIMetadata } from "@/api/articles.api";
import { fetchCategories } from "@/api/categories.api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

function RichEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const handleFormat = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
  };

  return (
    <div className="rounded-md border border-border bg-card/50">
      <div className="flex flex-wrap gap-0.5 border-b border-border px-2 py-1.5">
        {[
          { cmd: "bold", label: "B" },
          { cmd: "italic", label: "I" },
          { cmd: "underline", label: "U" },
          { cmd: "formatBlock", label: "H1", val: "h1" },
          { cmd: "formatBlock", label: "H2", val: "h2" },
          { cmd: "formatBlock", label: "H3", val: "h3" },
          { cmd: "insertUnorderedList", label: "UL" },
          { cmd: "insertOrderedList", label: "OL" },
          { cmd: "formatBlock", label: "Quote", val: "blockquote" },
          { cmd: "formatBlock", label: "Code", val: "pre" },
        ].map(({ cmd, label, val }) => (
          <button
            key={label}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleFormat(cmd, val);
              setTimeout(() => onChange(editorRef.innerHTML), 0);
            }}
            className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
      <div
        ref={(el) => {
          if (el && el.innerHTML !== value && value) {
            el.innerHTML = value;
          }
          editorRef = el;
        }}
        contentEditable
        onInput={() => {
          if (editorRef) onChange(editorRef.innerHTML);
        }}
        className="min-h-[300px] px-4 py-3 text-sm text-foreground focus:outline-none"
        style={{ whiteSpace: "pre-wrap" }}
      />
    </div>
  );
}

let editorRef: HTMLDivElement | null = null;

export function ArticleEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [aiPreview, setAiPreview] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
  });

  const { data: existingArticle, isLoading: loadingArticle } = useQuery({
    queryKey: ["article", id],
    queryFn: () => fetchArticle(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existingArticle && isEdit) {
      setTitle(existingArticle.title);
      setContent(existingArticle.content);
      setExcerpt(existingArticle.excerpt || "");
      setCategoryId(existingArticle.category?.id || "");
      setStatus(existingArticle.status as "DRAFT" | "PUBLISHED");
      if (existingArticle.aiSummary) {
        let takeaways: string[] = [];
        try {
          takeaways = JSON.parse(existingArticle.aiKeyTakeaways || "[]");
        } catch {}
        setAiPreview({
          summary: existingArticle.aiSummary,
          keyTakeaways: takeaways,
          tags: existingArticle.aiTags?.split(", ") || [],
          seoTitle: existingArticle.seoTitle,
          seoDescription: existingArticle.seoDescription,
        });
      }
    }
  }, [existingArticle, isEdit]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = { title, content, excerpt, categoryId: categoryId || undefined, status };
      if (isEdit) {
        return updateArticle(id!, body);
      }
      return createArticle(body);
    },
    onSuccess: (article) => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success(isEdit ? "Article saved" : "Article created");
      if (!isEdit) navigate(`/admin/articles/${article.id}/edit`);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "Save failed"),
  });

  const generateAIMutation = useMutation({
    mutationFn: async () => {
      let articleId = id;
      if (!articleId) {
        const created = await createArticle({ title, content, excerpt, categoryId: categoryId || undefined, status: "DRAFT" });
        articleId = created.id;
        queryClient.invalidateQueries({ queryKey: ["articles"] });
        navigate(`/admin/articles/${articleId}/edit`);
      }
      const result = await generateAIMetadata(articleId!);
      return result;
    },
    onSuccess: (data) => {
      let takeaways: string[] = [];
      if (typeof data.aiKeyTakeaways === "string") {
        try { takeaways = JSON.parse(data.aiKeyTakeaways); } catch {}
      } else if (Array.isArray(data.aiKeyTakeaways)) {
        takeaways = data.aiKeyTakeaways;
      }
      setAiPreview({
        summary: data.aiSummary,
        keyTakeaways: takeaways,
        tags: data.aiTags?.split(", ") || [],
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
      });
      toast.success("AI metadata generated");
    },
    onError: (err: any) => toast.error(err.response?.data?.error || "AI generation failed"),
  });

  if (isEdit && loadingArticle) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground">
              ← Dashboard
            </Link>
            <span className="text-sm font-medium">
              {isEdit ? "Edit Article" : "New Article"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{user?.name}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <Input
              placeholder="Article title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold h-12"
            />

            <div className="flex items-center gap-2">
              <Button
                variant={status === "PUBLISHED" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatus("PUBLISHED")}
              >
                Published
              </Button>
              <Button
                variant={status === "DRAFT" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatus("DRAFT")}
              >
                Draft
              </Button>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Excerpt</label>
              <Textarea
                placeholder="Brief excerpt for the article card..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Content</label>
              <RichEditor value={content} onChange={setContent} />
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button
                  className="w-full"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending || !title}
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-1.5 h-4 w-4" />
                  )}
                  {saveMutation.isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Article"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => generateAIMutation.mutate()}
                  disabled={generateAIMutation.isPending || !title}
                >
                  {generateAIMutation.isPending ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-1.5 h-4 w-4" />
                  )}
                  Generate AI Metadata
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-md border border-border bg-card/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">Uncategorized</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>

            {aiPreview && (
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">AI Generated</span>
                  </div>

                  {aiPreview.summary && (
                    <div>
                      <label className="text-xs text-muted-foreground">Summary</label>
                      <p className="text-xs text-muted-foreground mt-0.5">{aiPreview.summary}</p>
                    </div>
                  )}

                  {aiPreview.keyTakeaways?.length > 0 && (
                    <div>
                      <label className="text-xs text-muted-foreground">Key Takeaways</label>
                      <ul className="mt-0.5 space-y-0.5">
                        {aiPreview.keyTakeaways.map((t: string, i: number) => (
                          <li key={i} className="text-xs text-muted-foreground">• {t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiPreview.tags?.length > 0 && (
                    <div>
                      <label className="text-xs text-muted-foreground">Tags</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {aiPreview.tags.map((t: string) => (
                          <Badge key={t} variant="outline">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {aiPreview.seoTitle && (
                    <div>
                      <label className="text-xs text-muted-foreground">SEO Title</label>
                      <p className="text-xs text-muted-foreground mt-0.5">{aiPreview.seoTitle}</p>
                    </div>
                  )}

                  {aiPreview.seoDescription && (
                    <div>
                      <label className="text-xs text-muted-foreground">SEO Description</label>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {aiPreview.seoDescription}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
