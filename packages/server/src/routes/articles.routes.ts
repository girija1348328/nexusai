import { Router, Response } from "express";
import { z } from "zod";
import slugify from "slugify";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { generateArticleMetadata } from "../services/ai.service";

const router = Router();

const createArticleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  categoryId: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

const updateArticleSchema = createArticleSchema.partial();

function makeSlug(title: string): string {
  return slugify(title, { lower: true, strict: true });
}

async function getUniqueSlug(title: string, excludeId?: string): Promise<string> {
  let slug = makeSlug(title);
  let exists = await prisma.article.findFirst({
    where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
  });
  if (!exists) return slug;
  slug = `${slug}-${Date.now()}`;
  exists = await prisma.article.findFirst({
    where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
  });
  if (!exists) return slug;
  return `${slug}-${Math.random().toString(36).substring(2, 8)}`;
}

// Get all articles (public)
router.get("/", async (req, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const category = req.query.category as string;
  const tag = req.query.tag as string;
  const search = req.query.search as string;
  const status = req.query.status as string || "PUBLISHED";

  const where: any = { status };
  if (category) where.category = { slug: category };
  if (tag) where.tags = { some: { tag: { slug: tag } } };
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
    ];
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { include: { tag: true } },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  res.json({
    articles: articles.map((a) => ({
      ...a,
      tags: a.tags.map((t) => t.tag),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

// Get single article by slug (public)
router.get("/:slug", async (req, res: Response) => {
  const article = await prisma.article.findUnique({
    where: { slug: req.params.slug },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
      category: { select: { id: true, name: true, slug: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  res.json({
    ...article,
    tags: article.tags.map((t) => t.tag),
  });
});

// Create article (auth required)
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsed = createArticleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors });
    return;
  }

  const slug = await getUniqueSlug(parsed.data.title);
  const isPublished = parsed.data.status === "PUBLISHED";

  const article = await prisma.article.create({
    data: {
      title: parsed.data.title,
      slug,
      content: parsed.data.content,
      excerpt: parsed.data.excerpt,
      categoryId: parsed.data.categoryId || null,
      coverImage: parsed.data.coverImage,
      status: parsed.data.status || "DRAFT",
      publishedAt: isPublished ? new Date() : null,
      authorId: req.userId!,
    },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
      category: { select: { id: true, name: true, slug: true } },
      tags: { include: { tag: true } },
    },
  });

  res.status(201).json({
    ...article,
    tags: article.tags.map((t) => t.tag),
  });
});

// Update article (auth required)
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsed = updateArticleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors });
    return;
  }

  const existing = await prisma.article.findUnique({
    where: { id: req.params.id },
  });
  if (!existing) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  let slug = existing.slug;
  if (parsed.data.title && parsed.data.title !== existing.title) {
    slug = await getUniqueSlug(parsed.data.title, existing.id);
  }

  const isPublished =
    parsed.data.status === "PUBLISHED" ||
    (parsed.data.status === undefined && existing.status === "PUBLISHED");

  const article = await prisma.article.update({
    where: { id: req.params.id },
    data: {
      title: parsed.data.title ?? existing.title,
      slug,
      content: parsed.data.content ?? existing.content,
      excerpt: parsed.data.excerpt ?? existing.excerpt,
      categoryId: parsed.data.categoryId ?? existing.categoryId,
      coverImage: parsed.data.coverImage ?? existing.coverImage,
      status: parsed.data.status ?? existing.status,
      publishedAt: isPublished
        ? existing.publishedAt || new Date()
        : existing.status === "PUBLISHED" && parsed.data.status === "DRAFT"
        ? null
        : existing.publishedAt,
    },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
      category: { select: { id: true, name: true, slug: true } },
      tags: { include: { tag: true } },
    },
  });

  res.json({
    ...article,
    tags: article.tags.map((t) => t.tag),
  });
});

// Generate AI metadata for an article (auth required)
router.post("/:id/generate-ai", authMiddleware, async (req: AuthRequest, res: Response) => {
  const article = await prisma.article.findUnique({
    where: { id: req.params.id },
  });
  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  try {
    const existingTags = await prisma.tag.findMany({ select: { name: true } });
    const metadata = await generateArticleMetadata(
      article.title,
      article.content,
      existingTags.map((t) => t.name)
    );

    // Upsert tags
    const tagRecords = await Promise.all(
      metadata.tags.map(async (tagName) => {
        const tagSlug = makeSlug(tagName);
        return prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: tagName, slug: tagSlug },
        });
      })
    );

    // Clear existing tags and set new ones
    await prisma.articleTag.deleteMany({ where: { articleId: article.id } });
    await prisma.articleTag.createMany({
      data: tagRecords.map((t) => ({ articleId: article.id, tagId: t.id })),
    });

    // Update article with AI metadata
    const updated = await prisma.article.update({
      where: { id: article.id },
      data: {
        aiSummary: metadata.summary,
        aiKeyTakeaways: JSON.stringify(metadata.keyTakeaways),
        aiTags: metadata.tags.join(", "),
        seoTitle: metadata.seoTitle,
        seoDescription: metadata.seoDescription,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { include: { tag: true } },
      },
    });

    res.json({
      ...updated,
      tags: updated.tags.map((t) => t.tag),
      aiKeyTakeaways: metadata.keyTakeaways,
    });
  } catch (err: any) {
    console.error("AI generation error:", err);
    res.status(500).json({ error: "AI generation failed", message: err.message });
  }
});

// Delete article (auth required)
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const article = await prisma.article.findUnique({
    where: { id: req.params.id },
  });
  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  await prisma.article.delete({ where: { id: req.params.id } });
  res.json({ message: "Article deleted" });
});

export default router;
