import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
(async () => {
  const arts = await p.article.findMany({
    where: { category: { slug: "defense-drones" } },
    select: { title: true, coverImage: true },
    orderBy: { publishedAt: "desc" },
  });
  console.log("Defense & Drones articles (" + arts.length + "):");
  for (const a of arts) {
    console.log("  " + a.title.substring(0, 50) + "...");
    console.log("    " + a.coverImage);
    const isDrone = a.coverImage.includes("images.unsplash.com");
    console.log("    " + (isDrone ? "REAL DRONE IMAGE" : "PICSUM"));
  }
  await p.$disconnect();
})();
