import { Router, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res: Response) => {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });
  res.json(tags);
});

export default router;
