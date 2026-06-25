import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const articles = await prisma.article.findMany({
  select: { title: true, slug: true, coverImage: true, category: { select: { name: true } } },
  orderBy: { createdAt: "asc" },
});

let nullCount = 0;
let defenseCount = 0;
let uniqueDefenseImages = new Set();
let defenseWithUnsplash = 0;

for (const a of articles) {
  if (!a.coverImage) {
    console.log("NULL: " + a.title.substring(0, 60));
    nullCount++;
  }
  if (a.category.name === "Defense & Drones") {
    defenseCount++;
    if (a.coverImage) {
      uniqueDefenseImages.add(a.coverImage);
      if (a.coverImage.includes("unsplash")) defenseWithUnsplash++;
    }
  }
}

console.log("\nTotal articles: " + articles.length);
console.log("Null coverImage: " + nullCount);
console.log("Defense & Drones articles: " + defenseCount);
console.log("Defense with Unsplash images: " + defenseWithUnsplash);
console.log("Unique Unsplash images used for defense: " + uniqueDefenseImages.size);
console.log("\nDefense cover images:");
for (const img of uniqueDefenseImages) {
  console.log("  " + img);
}

await prisma.$disconnect();
