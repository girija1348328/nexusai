import { Router, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res: Response) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  res.json(categories);
});

router.get("/:slug", async (req, res: Response) => {
  const category = await prisma.category.findUnique({
    where: { slug: req.params.slug },
  });
  if (!category) {
    res.status(404).json({ error: "Category not found" });
    return;
  }
  res.json(category);
});

export default router;
