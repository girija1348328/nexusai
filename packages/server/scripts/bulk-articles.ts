import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

interface GeneratedArticle {
  title: string;
  content: string;
  excerpt: string;
  categorySlug: string;
}

const ARTICLES_BY_CATEGORY: Record<string, GeneratedArticle[]> = {
  "ai": [
    { title: "OpenAI Announces GPT-5 with Multimodal Capabilities", content: "OpenAI has unveiled GPT-5, featuring enhanced multimodal understanding and reasoning capabilities. The new model can process images, audio, and text simultaneously, marking a significant advancement in AI technology. Analysts predict this could revolutionize content creation, customer service, and data analysis across industries.", excerpt: "Revolutionary AI model combines text, image, and audio processing" },
    { title: "Google DeepMind's AlphaFold 3 Solves Protein-Ligand Binding", content: "Google DeepMind has released AlphaFold 3, a groundbreaking model that predicts protein-ligand binding with unprecedented accuracy. This breakthrough could accelerate drug discovery, materials science, and our understanding of biological processes at the molecular level.", excerpt: "New AI model transforms drug discovery and pharmaceutical research" },
    { title: "Microsoft-Tencent Partnership Expands AI Research in China", content: "Microsoft and Tencent announced a strategic partnership to advance AI research and development in China. The collaboration focuses on building foundation models for healthcare, education, and scientific research, aiming to make cutting-edge AI more accessible globally.", excerpt: "Tech giants join forces to advance AI research accessibility" },
    { title: "AI Climate Models Predict Accelerated Global Warming", content: "Climate science researchers are increasingly relying on AI to predict climate change patterns. Latest AI-driven models indicate that global temperatures could rise 2.5°C above pre-industrial levels by 2050, emphasizing the urgent need for mitigation strategies.", excerpt: "Artificial intelligence models suggest worsening climate outlook" },
    { title: "AI-Powered Diagnostic Tools revolutionize Healthcare", content: "Hospitals worldwide are adopting AI diagnostic tools that can detect diseases earlier and more accurately than human doctors. From cancer screening to rare disease diagnosis, AI is proving to be a valuable assistant in medical decision-making.", excerpt: "Machine learning transforms medical diagnosis and patient care" },
    { title: "Tesla's Autonomous Driving AI Faces Regulatory Hurdles", content: "Tesla's Full Self-Driving beta program encounters new regulatory challenges as transportation authorities demand stricter safety validation. The company's AI approach continues to spark debate in the autonomous vehicle industry.", excerpt: "Regulatory scrutiny intensifies on Tesla's autonomous driving AI" },
    { title: "Stability AI Launches Open-Source Model Competition", content: "Stability AI has announced a global competition to develop the most capable open-source AI model. The initiative aims to democratize AI access and foster innovation outside of major tech company monopolies.", excerpt: "Free AI model competition seeks to democratize technology access" },
    { title: "Neuralink Demonstrates Brain-Computer Interface Progress", content": "Neuralink has shown promising progress in its brain-computer interface technology, enabling paralysed patients to control devices with thought alone. While still in experimental stages, the technology represents a major leap in neurotechnology.", excerpt: "Revolutionary brain-computer interface restores patient independence" },
    { title: "AI Ethics Council Recommendations Rejected by Tech Giants", content: "Major AI companies have rejected key recommendations from the global AI ethics council, particularly around transparency, accountability, and bias mitigation. The decision has sparked renewed debate about AI governance and regulation.", excerpt: "Industry pushback against AI ethics guidelines raises concerns" },
    { title: "Quantum Computing Advances Accelerate AI Capabilities", content: "Scientists announce quantum computing breakthroughs that could dramatically accelerate AI training and inference. The new quantum-inspired algorithms promise to make current AI models exponentially more powerful and efficient.", excerpt: "Quantum computing could revolutionize artificial intelligence processing" }
  ],
  "development": [
    { title: "React 19 Introduces Concurrent Rendering Improvements", content: "Facebook's React team has released React 19 with significant performance improvements in concurrent rendering. The update features automatic prioritization, better memory management, and enhanced server-side rendering capabilities for complex applications.", excerpt: "New React version delivers major performance improvements" },
    { title: "Rust Language Surges in Popularity Among Developers", content: "The Rust programming language continues its upward trajectory, climbing to new highs in developer satisfaction surveys. Its memory safety guarantees and performance characteristics make it increasingly popular for systems programming and web assembly.", excerpt: "Memory-safe language becomes developer favorite" },
    { title: "Microsoft Extends VS Code with AI-Powered Features", content: "Microsoft has integrated advanced AI capabilities directly into VS Code, including code completion, bug detection, and automated refactoring suggestions. The updates aim to boost developer productivity and reduce cognitive load.", excerpt: "Intelligent coding assistant becomes standard in popular IDE" },
    { title: "Node.js 22 Brings Worker Threads Performance Boost", content: "The Node.js foundation has released version 22 with significant improvements to worker thread performance and module loading. These enhancements make Node.js more suitable for CPU-intensive applications and microservices architectures.", excerpt: "JavaScript runtime gets performance overhaul" },
    { title: "Next.js 14 Optimizes Web Application Performance", content: "Vercel has launched Next.js 14 with groundbreaking optimizations for web application performance. The framework now supports edge computing, improved bundle sizes, and automatic image optimization across global CDNs.", excerpt: "Web framework supercharges application speed and efficiency" },
    { title: "TypeScript 5.2 Adds Better Control Flow Analysis", content: "The TypeScript team has released version 5.2 with enhanced control flow analysis and improved type inference. These updates help developers write more robust code with fewer type-related errors and better autocompletion.", excerpt: "JavaScript type system gets smarter and more precise" },
    { title: "Docker Desktop Integrates Development Environment", content: "Docker has transformed Desktop into a comprehensive development environment, integrating container management, resource monitoring, and workflow automation. The update aims to streamline developer productivity across different platforms.", excerpt: "Container platform evolves into full development suite" },
    { title: "GraphQL Federation 2.0 Promises Better API Composition", content: "The GraphQL Foundation has released Federation 2.0 with improved service composition, better error handling, and enhanced developer experience. The new standard aims to simplify complex microservice architectures.", excerpt: "API composition standard reaches new maturity" },
    { title: "Go 1.22 Completes Benchmarking with Performance Targets", content: "The Go team has delivered Go 1.22, achieving ambitious performance targets for compilation times and runtime efficiency. The update focuses on making Go even faster for high-performance applications.", excerpt: "Go language reaches new performance milestones" },
    { title: "Cloud Native Computing Foundation Expands Project Portfolio", content: "The CNCF has welcomed four new projects to its cloud native ecosystem, reflecting the rapid evolution of container orchestration and serverless computing. The additions span observability, service mesh, and edge computing domains.", excerpt: "Cloud computing foundation grows with new technologies" }
  ],
  "startup": [
    { title: "San Francisco AI Startup Raises $100M Series A", content: "ScalerAI, a San Francisco-based artificial intelligence startup, has secured $100 million in Series A funding. Led by Andreessen Horowitz, the round aims to accelerate product development and global expansion in enterprise AI solutions.", excerpt: "AI platform startup closes major funding round" },
    { title: "B2B SaaS Platform Secures $50M to Expand Market Reach", content: "Productivity Hub, a B2B SaaS platform, announced a $50 million funding round to expand its operations into European markets. The platform combines project management, collaboration tools, and analytics in one unified interface.", excerpt: "Productivity platform eyes international expansion" },
    { title: "Healthcare Tech Startup Launches Telemedicine Revolution", content: "WellnessConnect has debuted its comprehensive telemedicine platform, connecting patients with healthcare providers through AI-powered triage and virtual consultations. The startup aims to make quality healthcare accessible to millions.", excerpt: "New telehealth platform promises accessible healthcare" },
    { title: "FinTech Startup Introduces AI-Based Trading Bot", content: "QuantifyAI has launched an AI-powered trading bot that uses machine learning to predict stock market movements. The platform claims to deliver consistent returns while minimizing risk through advanced algorithmic strategies.", excerpt: "AI trading platform enters competitive financial market" },
    { title: "Education Technology Startup Secures Series Seed", content: "LearnSphere, an educational technology startup, has completed a Series Seed round to expand its AI-powered learning platform. The platform personalizes educational content based on individual learning styles and pace.", excerpt: "AI learning platform attracts early-stage investment" },
    { title: "Real Estate Tech Startup Revolutionizes Property Searches", content: "HomeFinder AI has developed a machine learning platform that predicts property values and matches buyers with suitable homes based on preferences and budget. The startup aims to transform real estate industry efficiency.", excerpt: "AI transforms real estate property matching" },
    { title: "Cybersecurity Startup Launches Threat Intelligence Platform", content: "SecurePredict has introduced a comprehensive threat intelligence platform that uses AI to predict and prevent cyberattacks before they occur. The startup's technology analyzes patterns across global networks to identify emerging threats.", excerpt: "Predictive cybersecurity platform launches to market" },
    { title: "Green Tech Startup Secures Funding for Climate Solutions", content: "CarbonZero Technologies has raised venture capital to scale its carbon capture and storage solutions. The startup's technology removes CO2 from the atmosphere and converts it into sustainable building materials.", excerpt: "Climate tech startup attracts environmental investment" },
    { title: "Logistics Startup Introduces AI Route Optimization", content: "RouteSmart Logistics has developed an AI-powered route optimization platform that reduces delivery times and fuel consumption by up to 40%. The startup is already partnering with major delivery companies globally.", excerpt: "AI transforms logistics with route optimization" },
    { title: "Media Tech Startup Launches Personalized Content Platform", content: "StoryAI has introduced a platform that creates personalized news and content recommendations using artificial intelligence. The startup aims to replace traditional news feeds with truly individualized storytelling experiences.", excerpt: "AI-powered content personalization platform launches" }
  ],
  "education": [
    { title: "EdTech Platform Announces Free University Courses", content: "CourseraX has partnered with leading universities to offer free AI and machine learning courses to students worldwide. The initiative aims to democratize access to quality education and bridge the skills gap in technology.", excerpt: "Top universities offer free AI and ML courses globally" },
    { title: "AI tutor Startup Transforms Personalized Learning", content: "LearnAI has developed an artificial intelligence tutor that adapts curriculum to individual student needs and learning styles. The platform shows promise in improving educational outcomes and reducing achievement gaps.", excerpt: "AI tutor personalizes learning for every student" },
    { title: "Virtual Reality Classroom Gains Academic Adoption", content: "University of Stanford has integrated VR classrooms into its computer science curriculum, allowing students to experience virtual labs and interactive learning environments. The technology bridges physical and digital learning barriers.", excerpt: "Stanford adopts VR technology for computer science education" },
    { title: "Coding Bootcamp Launches AI Developer Training Program", content: "TechBridge Academy has announced an accelerated AI developer training program covering machine learning, deep learning, and neural networks. The course prepares students for high-demand AI engineering positions.", excerpt: "Accelerated AI developer training launches" },
    { title: "Open Source Educational Resources Surge in Popularity", content: "Open Educational Resources (OER) have seen record adoption as students seek alternatives to expensive textbooks. AI-powered personalization tools are making these resources increasingly effective and engaging.", excerpt: "Free educational resources gain mainstream acceptance" },
    { title: "Micro-learning Platform Targets Professional Development", content: "SkillStack has launched a micro-learning platform focusing on bite-sized AI and technology skills. The platform enables professionals to quickly upskill in emerging technologies without time commitment.", excerpt: "Micro-learning platform disrupts professional education" },
    { title: "AI Assessment Tools Transform Grading and Evaluation", content: "GradesAI has introduced automated grading tools that use machine learning to assess student work with human-like accuracy. The platform handles complex subjective evaluations and provides actionable feedback.", excerpt: "AI-powered assessment tools revolutionize grading" },
    { title: "Educational Gaming Platforms See Record Growth", content: "GameLearn has reported significant growth as educational gaming platforms become mainstream in K-12 and higher education. Gamified learning experiences improve engagement and knowledge retention.", excerpt: "Educational gaming platforms transform learning engagement" },
    { title: "AI Research Internships Expand Industry-Academic Links", content: "Major tech companies have increased AI research internship programs, providing students with hands-on experience in cutting-edge projects. These programs bridge academic research and practical applications.", excerpt: "Industry-academic AI internships expand opportunities" },
    { title: "Data Science Education Gets Real-World Project Integration", content: "DataScience University has restructured its curriculum to include real-world AI projects from industry partners. Students gain practical experience while solving actual business challenges.", excerpt: "Real-world AI projects transform data science education" }
  ],
  "defense-drones": [
    { title: "DoD Announces $50B Investment in AI-Powered Defense Systems", content: "The Department of Defense has unveiled a $50 billion investment plan for advanced artificial intelligence systems in military applications. The focus areas include autonomous weapons, surveillance drones, and battlefield decision support tools.", excerpt: "Massive defense budget allocates AI automation funding" },
    { title: "Tesla Semi Truck Fleet Orders Reach 150,000 Units", content: "Tesla's innovative electric semi-truck has attracted unprecedented interest from major logistics companies, with over 150,000 units ordered globally. The vehicles promise to revolutionize freight transportation with lower emissions and operating costs.", excerpt: "Revolutionary electric truck seeks 150,000 customer orders" },
    { title: "Autonomous Drone Fleet Operates Off-Grid with AI Support", content: "A new class of autonomous delivery drones has successfully operated for 72 hours without human intervention or ground support, powered by advanced AI navigation and energy management systems.", excerpt: "Drones achieve new operational endurance with AI intelligence" },
    { title: "SpaceX Launches First Military Satellite Constellations", content: "SpaceX has deployed its first specialized military satellite constellation, providing secure communications and surveillance capabilities to defense agencies. The system integrates AI for real-time threat detection and analysis.", excerpt: "Space-based surveillance system enhances defense capabilities" },
    { title: "AI-Powered Underwater Drones Transform Naval Operations", content: "Naval forces are deploying AI-powered underwater drones capable of autonomous underwater vehicle operations, mine detection, and underwater infrastructure maintenance. The technology promises to enhance maritime security.", excerpt: "Undersea drones revolutionize naval autonomous operations" },
    { title: "Next-Generation Surveillance Drones Achieve Stealth Operations", content: "A new drone platform has been developed with advanced stealth capabilities and AI-powered surveillance systems, allowing for extended reconnaissance missions without detection by enemy radar systems.", excerpt: "Stealth surveillance drone expands operational intelligence" },
    { title: "Military Training AI Simulators Reach New Realism", content: "Advanced AI-driven military training simulators have achieved unprecedented realism, allowing soldiers to practice complex tactical scenarios against AI opponents with adaptive learning and decision-making capabilities.", excerpt: "AI training simulators enhance military preparedness" },
    { title: "Armored Vehicle AI Systems Enhance Battlefield Awareness", content: "Next-generation armored vehicles are being equipped with comprehensive AI systems that provide 360-degree situational awareness, predictive threat analysis, and autonomous defensive capabilities.", excerpt: "Intelligent armor enhances soldier safety and effectiveness" },
    { title: "Border Security AI Networks Expand Global Presence", content: "Artificial intelligence systems designed for border security and immigration control are being deployed across multiple continents, combining surveillance drones, facial recognition, and predictive analytics to enhance homeland security.", excerpt: "Global border security networks adopt AI intelligence" },
    { title: "Warfare Drone AI Evolution Threatens Traditional Air Forces", content: "Advances in AI warfare drone technology are challenging traditional air force doctrines, as autonomous systems demonstrate superior speed, coordination, and lethality compared to manned aircraft in simulated combat scenarios.", excerpt: "AI drones challenge traditional military aviation paradigms" }
  ]
};

async function getAdminUserId(): Promise<string> {
  const adminEmail = "admin@nexusai.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    console.log("Admin user not found. Please create the admin user first.");
    process.exit(1);
  }

  return existingAdmin.id;
}

async function getCategoryId(slug: string): Promise<string> {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    console.log(`Category with slug '${slug}' not found. Please seed categories first.`);
    process.exit(1);
  }

  return category.id;
}

async function generateSlug(title: string): Promise<string> {
  return slugify(title, { lower: true, strict: true });
}

async function getUniqueSlug(title: string, excludeId?: string): Promise<string> {
  let slug = await generateSlug(title);
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

async function generateAiMetadata(title: string, content: string, existingTags: string[]): Promise<any> {
  const tagList = existingTags.length > 0 ? existingTags.join(", ") : "AI, Development, Technology, Startup, Software";

  const prompt = `You are an AI content editor for a tech publication called NexusAI.

Given the article title and content below, generate the following metadata:

1. A 2-3 sentence summary of the article.
2. 3-5 key takeaways as bullet points.
3. 3-5 relevant tags from or similar to: ${tagList}
4. SEO title (max 60 characters).
5. SEO description (max 160 characters).

Return your answer as valid JSON in this exact format:
{
  "summary": "...",
  "keyTakeaways": ["...", "..."],
  "tags": ["...", "..."],
  "seoTitle": "...",
  "seoDescription": "..."
}

Title: ${title}

Content: ${content.substring(0, 4000)}`;

  try {
    const { OpenAI } = await import("openai");
    const openai = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || "test-key",
      baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1",
    });

    const response = await openai.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are an AI content editor. Always respond with valid JSON only, no markdown.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const raw = response.choices[0]?.message?.content || "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      summary: parsed.summary || "",
      keyTakeaways: parsed.keyTakeaways || [],
      tags: parsed.tags || [],
      seoTitle: parsed.seoTitle || title.substring(0, 60),
      seoDescription: parsed.seoDescription || "",
    };
  } catch (error) {
    console.log("AI metadata generation failed, using defaults:", error);
    return {
      summary: "",
      keyTakeaways: [],
      tags: [],
      seoTitle: title.substring(0, 60),
      seoDescription: "",
    };
  }
}

async function main() {
  try {
    console.log("Starting bulk article creation...");

    const adminUserId = await getAdminUserId();
    console.log(`Admin user ID: ${adminUserId}`);

    const categorySlugs = Object.keys(ARTICLES_BY_CATEGORY);
    const existingTags = await prisma.tag.findMany({ select: { name: true } });
    const existingTagNames = existingTags.map((tag) => tag.name);

    let totalCreated = 0;

    for (const categorySlug of categorySlugs) {
      const articles = ARTICLES_BY_CATEGORY[categorySlug];
      console.log(`\nProcessing ${categorySlug} category (${articles.length} articles)...`);

      const categoryId = await getCategoryId(categorySlug);

      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        console.log(`  Creating article ${i + 1}/${articles.length}: "${article.title}" (Category: ${categorySlug})`);

        const slug = await getUniqueSlug(article.title);
        const isPublished = true;

        const createdArticle = await prisma.article.create({
          data: {
            title: article.title,
            slug,
            content: article.content,
            excerpt: article.excerpt,
            categoryId,
            status: "PUBLISHED",
            publishedAt: isPublished ? new Date() : null,
            authorId: adminUserId,
          },
          include: {
            author: { select: { id: true, name: true, avatar: true } },
            category: { select: { id: true, name: true, slug: true } },
            tags: { include: { tag: true } },
          },
        });

        console.log(`    ✓ Created article ID: ${createdArticle.id}`);

        try {
          const metadata = await generateAiMetadata(
            article.title,
            article.content,
            existingTagNames
          );

          await prisma.article.update({
            where: { id: createdArticle.id },
            data: {
              aiSummary: metadata.summary,
              aiKeyTakeaways: JSON.stringify(metadata.keyTakeaways),
              aiTags: metadata.tags.join(", "),
              seoTitle: metadata.seoTitle,
              seoDescription: metadata.seoDescription,
            },
          });

          console.log(`    ✓ AI metadata generated and saved`);
        } catch (error) {
          console.log(`    ⚠ AI metadata generation failed: ${error}`);
        }

        totalCreated++;
      }
    }

    console.log(`\n✅ Bulk article creation complete! Total articles created: ${totalCreated}`);

  } catch (error) {
    console.error("Error during bulk article creation:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();