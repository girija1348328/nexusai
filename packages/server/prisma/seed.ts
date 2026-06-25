import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

interface ArticleData {
  title: string;
  content: string;
  excerpt: string;
  categorySlug: string;
  publishedAt: string;
  tags: string[];
}

const realArticles: ArticleData[] = [
  // ======== AI (12 articles) ========
  {
    title: "Anthropic accuses Alibaba of largest known distillation attack on Claude AI",
    content: "US artificial intelligence giant Anthropic has accused Chinese e-commerce and technology firm Alibaba of 'brazenly' and 'illicitly' extracting its Claude AI model's capabilities. In a letter sent to two members of the US Congress, the San Francisco-based company said operators linked to Alibaba carried out almost 29 million exchanges with Claude using thousands of fraudulent accounts in what it called the largest extraction campaign of its kind. Anthropic urged Congress to penalise the companies behind attacks like this and to ramp up measures to prevent US tech from being stolen. According to Anthropic, the campaign was carried out through what are known as 'distillation attacks', which extracted answers from a stronger AI model to train a weaker one. Alibaba-linked operators targeted Claude's most valuable capabilities, including its ability to tackle longer and more complex tasks and its approach to decision-making.",
    excerpt: "Anthropic accuses Alibaba of 'brazenly' extracting Claude AI capabilities via 29 million exchanges in largest known distillation attack",
    categorySlug: "ai",
    publishedAt: "2026-06-25T03:12:17.000Z",
    tags: ["AI", "LLM", "Anthropic", "Alibaba", "Cybersecurity"]
  },
  {
    title: "Google Gemini 3.5 Flash can now see and control your screen with built-in computer use",
    content: "Google has made computer use a built-in tool inside Gemini 3.5 Flash, the model it launched at I/O 2026 as its fastest agentic AI model. The capability, which lets AI agents see screens, click, type, and scroll across browsers, mobile devices, and desktops, previously required a separate standalone model and is now available as a native tool through the Gemini API and the Gemini Enterprise Agent Platform. Google is offering two optional enterprise safeguards: explicit user confirmation before sensitive actions, and automatic halting if indirect prompt injection is detected. The enterprise pitch centers on automation including continuous software testing, multi-step browser tasks, and internal tool navigation.",
    excerpt: "Google integrates computer use as native tool in Gemini 3.5 Flash with enterprise-grade safety guardrails",
    categorySlug: "ai",
    publishedAt: "2026-06-24T18:46:18.000Z",
    tags: ["AI", "Google", "Gemini", "Enterprise", "Agent"]
  },
  {
    title: "IBM unveils nanostack chip technology that could extend Moore's Law another decade",
    content: "IBM has built a new prototype chip with around 100 billion transistors on an area the size of a fingernail, which is twice the density of the company's previous state-of-the-art technology announced in 2021. The new architecture, known as a nanostack, vertically stacks transistors in two layers on a silicon chip. 'It's not just an incremental step,' said Jay Gambetta, the director of IBM Research. 'It's a meaningful leap forward.' Compared with IBM's previous state-of-the-art architecture, chips built with this new approach can do as much as 50% more work in the same amount of time and be up to 70% more energy efficient. Within a decade, nanostacking chips will be widely used in data centers, helping facilities better manage their energy consumption.",
    excerpt: "IBM's revolutionary nanostack architecture doubles transistor density, promising 70% better energy efficiency",
    categorySlug: "ai",
    publishedAt: "2026-06-25T10:00:00.000Z",
    tags: ["AI", "Hardware", "IBM", "Chips", "Nanotechnology"]
  },
  {
    title: "OpenAI partners with Broadcom to launch Jalapeño custom LLM inference chip",
    content: "OpenAI, in collaboration with Broadcom, has introduced Jalapeño, a purpose-built processor designed for large language model inference. The chip is the first in a planned series of accelerators that the companies are developing jointly. Jalapeño's development cycle took nine months from initial design to manufacturing tape-out, which may be one of the fastest for a high-end ASIC in the sector. This acceleration was supported by close software-hardware co-development and the use of OpenAI's own AI models to assist in chip design and optimisation. The chip is expected to deliver performance per watt substantially above current comparable hardware and is planned for initial deployment by the end of 2026.",
    excerpt: "OpenAI and Broadcom reveal Jalapeño custom ASIC for LLM inference, developed in record nine months",
    categorySlug: "ai",
    publishedAt: "2026-06-25T06:52:19.000Z",
    tags: ["AI", "OpenAI", "Hardware", "Chips", "LLM"]
  },
  {
    title: "Major US local newspaper coalition sues OpenAI and Microsoft over copyright theft for AI training",
    content: "A large coalition of local and regional newspaper publishers across the US has filed a sweeping lawsuit against OpenAI and Microsoft, accusing the tech giants of unlawfully using copyrighted journalism to train generative AI systems such as ChatGPT and Copilot without permission, attribution, or compensation. The lawsuit represents nearly 400 newspapers under a single legal challenge. According to the complaint, OpenAI and Microsoft 'systematically and secretly crawled' publisher websites, copied articles and stored them on their servers for use in training large language models. The filing further alleges that copyright management information was stripped from the content and reproduced in AI tool responses.",
    excerpt: "Nearly 400 US newspapers sue OpenAI and Microsoft for allegedly using copyrighted articles to train AI models",
    categorySlug: "ai",
    publishedAt: "2026-06-25T08:36:41.000Z",
    tags: ["AI", "OpenAI", "Copyright", "Legal", "Journalism"]
  },
  {
    title: "Google set to lose two more top AI researchers to Anthropic amid talent war",
    content: "Google's battle to retain leading AI talent appears to be intensifying, with two more senior researchers reportedly preparing to leave for rival Anthropic. Jonas Adler and Alexander Pritzel, both regarded internally as important members of Google's AI research teams, are expected to join Anthropic. Adler has worked on Google's AI coding initiatives, while Pritzel has specialised in training large language models. The reported moves come after Nobel Prize-winning scientist John Jumper left Google DeepMind for Anthropic, and Noam Shazeer moved to OpenAI. Google DeepMind CEO Demis Hassabis said movement between leading AI labs is common in today's highly competitive market.",
    excerpt: "Two more senior Google AI researchers reportedly headed to Anthropic as talent competition intensifies",
    categorySlug: "ai",
    publishedAt: "2026-06-25T07:09:00.000Z",
    tags: ["AI", "Google", "Anthropic", "Talent", "Research"]
  },
  {
    title: "DeepReinforce releases Ornith-1.0 open-source coding model family that learns its own RL scaffolds",
    content: "DeepReinforce has released Ornith-1.0, an open-source model family built for agentic coding. The lineup spans four sizes from a 9B dense model to a 397B mixture-of-experts flagship, all shipping under the MIT license on Hugging Face. The models are post-trained on top of Gemma 4 and Qwen 3.5. Unlike most coding agents that pair a model with a fixed human-designed harness, Ornith-1.0 learns to write its own scaffold during reinforcement learning, jointly optimizing the harness and the solution. Three layers guard against reward hacking: a fixed trust boundary, a deterministic monitor, and a frozen LLM judge. At flagship scale, Ornith-1.0-397B achieves 82.4 on SWE-Bench Verified.",
    excerpt: "Open-source Ornith-1.0 model family learns its own scaffolding during RL training, achieving state-of-the-art coding results",
    categorySlug: "ai",
    publishedAt: "2026-06-25T17:11:37.000Z",
    tags: ["AI", "Open Source", "Coding", "LLM", "Machine Learning"]
  },
  {
    title: "Unconventional AI releases first oscillator-based model that could cut AI power use by 1000x",
    content: "Unconventional AI, the startup founded by former Databricks AI chief Naveen Rao, has released its first AI model, an image generation system called Un-0 that runs on a completely new kind of computing architecture. The company is building an oscillator-based computer architecture that abandons digital logic, using coupled ring oscillators in a fabric network that encodes and processes information through physics. Rao told TechCrunch this approach could ultimately reduce power consumption by a factor of a thousand compared to conventional chips. The model produces results comparable to state-of-the-art diffusion models like Stable Diffusion, according to an accompanying research paper.",
    excerpt: "Oscillator-based AI computing architecture promises 1000x power reduction while matching Stable Diffusion performance",
    categorySlug: "ai",
    publishedAt: "2026-06-25T17:09:37.000Z",
    tags: ["AI", "Hardware", "Power", "Innovation", "Deep Learning"]
  },
  {
    title: "Claude Fable 5 builds booting Windows NT kernel in Rust in just 38 minutes",
    content: "Anthropic's Claude Fable 5 has generated a functional, bootable NT-compatible Windows kernel written in Rust from an empty directory in just 38 minutes of active model work. The project, called ntoskrnl-rs, produced the trusted computing base of a real x86_64 kernel including scheduler, memory manager, trap and interrupt machinery, object manager, and I/O manager booting on QEMU-emulated hardware. The kernel passed all 14 in-kernel self-tests. Over the following eight days, Claude Opus 4.8 extended it to load unmodified Windows kernel drivers and execute real Windows binaries including sort.exe, choice.exe, and cmd.exe.",
    excerpt: "AI generates functional Windows NT kernel in Rust in 38 minutes, raising questions about AI-authored systems software",
    categorySlug: "ai",
    publishedAt: "2026-06-24T10:31:21.000Z",
    tags: ["AI", "Rust", "Kernel", "Anthropic", "Cybersecurity"]
  },
  {
    title: "Linux Foundation launches Agent Name Service to bring DNS-style trust to AI agents",
    content: "The Linux Foundation has announced plans to launch a new Agent Name Service framework designed to establish identity, ownership, and trust for AI agents. The ANS framework, based on the existing Domain Name System, will allow systems and users to verify who an agent represents, what permissions it has, and whether its code and operational history remain authentic. Just like DNS translates human-readable website names into internet addresses, ANS aims to create a standardized naming and discovery layer for AI agents with federated verification without any reliance on proprietary registries or centralized control.",
    excerpt: "Linux Foundation's Agent Name Service brings DNS-style identity and trust verification to enterprise AI agents",
    categorySlug: "ai",
    publishedAt: "2026-06-25T05:52:33.000Z",
    tags: ["AI", "Linux Foundation", "Security", "Identity", "Enterprise"]
  },
  {
    title: "Gemini Computer Use now baked into Gemini 3.5 Flash pairing screen control with Search and Maps",
    content: "Google announced that computer use is now a built-in tool inside Gemini 3.5 Flash, available to developers through the Gemini API and the Gemini Enterprise Agent Platform. The feature was previously accessible only through a standalone Gemini 2.5 computer use model, but is now a native tool inside the same model developers already use for function calling, Search grounding, and Maps integration. That consolidation means a single Gemini 3.5 Flash agent can now see a screen, look something up on Search, and interact with a map without routing requests between multiple models. On OSWorld-Verified, Gemini 3.5 Flash scores 78.4 compared to GPT-5.5's 78.7.",
    excerpt: "Single Gemini 3.5 Flash agent now combines computer use, Search, and Maps in one unified tool",
    categorySlug: "ai",
    publishedAt: "2026-06-25T14:45:45.000Z",
    tags: ["AI", "Google", "Gemini", "Computer Use", "Enterprise"]
  },
  {
    title: "AI startup funding boom is not a global phenomenon with US capturing 88% of investment",
    content: "The flood of AI-focused funding has pushed global startup investment to record levels in 2026, but the vast majority of countries have not partaken in the gains. US companies have pulled in nearly 80% of global seed-through growth-stage financing, and nearly 88% of AI-related startup funding ($319 billion) went to US-headquartered companies. Most of that went to just two recipients: OpenAI and Anthropic. Both are on track for public market debuts later this year. China's startups have raised over $33 billion, already surpassing 2025 totals. The UK has pulled in $16.5 billion with AI and fintech as leading sectors.",
    excerpt: "US captures 88% of global AI startup funding as OpenAI and Anthropic dominate investment landscape",
    categorySlug: "ai",
    publishedAt: "2026-06-15T11:00:23.000Z",
    tags: ["AI", "Startup", "Funding", "Investment", "Global"]
  },

  // ======== Development (10 articles) ========
  {
    title: "OpenAI unveils Codex cloud coding agent built on o3 reasoning model",
    content: "OpenAI has introduced Codex, a cloud-based coding agent designed to assist with software development workflows. The tool runs on codex-1, a specialized version of the company's o3 model fine-tuned specifically for engineering tasks. The underlying engine was built through reinforcement learning on actual coding challenges across diverse environments. The system has been engineered to follow instructions with precision and includes automated testing capabilities that iterate until results pass. The cloud-native design positions Codex as an accessible tool for teams looking to integrate AI-assisted coding into their development pipelines without managing local infrastructure.",
    excerpt: "OpenAI launches specialized coding agent Codex built on o3 with reinforcement learning across diverse engineering challenges",
    categorySlug: "development",
    publishedAt: "2026-06-25T00:00:00.000Z",
    tags: ["Development", "OpenAI", "Coding", "AI", "Cloud"]
  },
  {
    title: "Capital One open-sources Context Specs a spec-driven development framework for AI-assisted coding",
    content: "Capital One is open-sourcing Context Specs, a framework for spec-driven development that treats context engineering as the primary lever for AI-assisted coding. The framework captures a team's domain-specific knowledge into reusable 'experts' created once and composed across the entire workflow. It uses automated feedback 'signals' to verify the agent's work in three phases. Each slice specifies a signal that runs tests, calls endpoints, and checks build output. After writing code, the implementation agent invokes the signal and iterates until it passes, transforming implementation from a single shot into a closed loop. Context Specs is available on GitHub under Apache 2.0 license.",
    excerpt: "Capital One's open-source Context Specs framework brings spec-driven development with automated verification loops to AI coding",
    categorySlug: "development",
    publishedAt: "2026-06-24T00:00:00.000Z",
    tags: ["Development", "Open Source", "AI", "Testing", "DevOps"]
  },
  {
    title: "GitHub Actions Cordyceps supply chain flaw exposes Microsoft and Google to free-account hijack",
    content: "A free GitHub account is all an attacker needs to steal permanent credentials from Microsoft's security infrastructure, gain owner-level control over a Google Cloud project, or poison software packages. Penetration-testing firm Novee Security disclosed a systemic class of exploitable vulnerabilities named Cordyceps hiding inside GitHub Actions CI/CD pipelines of widely used open-source projects. Confirmed affected organizations include Microsoft, Google, Apache, Cloudflare, and the Python Software Foundation. All identified vulnerabilities were patched before disclosure. GitHub released actions/checkout v7 on June 18 which blocks the most common patterns by refusing to check out unreviewed fork pull requests in pull_request_target workflows.",
    excerpt: "Critical GitHub Actions supply chain vulnerability Cordyceps could compromise Microsoft Google and major open-source projects",
    categorySlug: "development",
    publishedAt: "2026-06-25T14:33:05.000Z",
    tags: ["Development", "Security", "GitHub", "CI/CD", "Open Source"]
  },
  {
    title: "Ponytail AI coding skill takes GitHub by storm with 44k stars in 9 days",
    content: "Ponytail, a plugin/skill for AI coding agents, has taken GitHub by storm reaching approximately 44,000 stars in under 9 days and trending #2 on GitHub. Created by DietrichGebert, the project works by injecting a 'lazy senior developer' ruleset into the agent's context at session start, forcing the agent to stop and think before writing a single line of code. Supporting Claude Code, Codex, GitHub Copilot CLI, Cursor, Windsurf, OpenCode, Gemini CLI and more, the plugin's viral growth stems from naming a frustration every developer recognizes: watching AI agents install packages for things browsers have done natively since 2014.",
    excerpt: "Ponytail AI coding skill goes viral with 44k GitHub stars by teaching agents to think before coding like a senior dev",
    categorySlug: "development",
    publishedAt: "2026-06-25T05:29:08.000Z",
    tags: ["Development", "AI", "GitHub", "Coding", "Productivity"]
  },
  {
    title: "The developer world in June 2026 everything changing in AI agents language wars and Rust",
    content: "The pace of change in software development has never been this relentless. Claude Code awareness among developers jumped from 31% in mid-2025 to 57% by January 2026, with workplace adoption growing roughly 6x. It now accounts for roughly 4% of all public GitHub commits with projections toward 20% by year-end. OpenAI responded with the biggest Codex upgrade since launch, adding background computer use, in-app browser, GitHub pull request reviews, and 90+ new plugins. Cursor shipped a rebuilt interface for orchestrating parallel agents, and developers now run all three together as layers in a composable stack. Rust's TIOBE ranking continues climbing with enterprise adoption at 50%.",
    excerpt: "Claude Code GitHub Copilot and Codex converge into composable AI stacks as Rust adoption hits 50% enterprise",
    categorySlug: "development",
    publishedAt: "2026-06-01T06:48:36.000Z",
    tags: ["Development", "AI", "Rust", "GitHub", "Tools"]
  },
  {
    title: "Claude Fable 5 writes booting NT-shaped kernel in Rust raising security questions about AI-authored code",
    content: "Anthropic's Claude Fable 5 built a bootable NT-shaped kernel in Rust from an empty repository to passing every self-test in 38 uninterrupted minutes. The project produced the trusted computing base of a real x86_64 kernel: scheduler, memory manager, trap and interrupt machinery, object manager, and I/O manager booting on QEMU. Over eight days, Claude Opus 4.8 extended it to load unmodified Windows kernel drivers and run unmodified Microsoft user-mode binaries. Fable 5 identified the risk itself: 'The dispatcher lock hand-off, spinlocks, and DPC queue are where kernels die.' It recommended loom for concurrency exploration and Miri for undefined-behavior detection.",
    excerpt: "AI-authored Rust kernel boots in 38 minutes demonstrating capability outpacing verification in systems software",
    categorySlug: "development",
    publishedAt: "2026-06-24T09:43:39.000Z",
    tags: ["Development", "Rust", "AI", "Kernel", "Security"]
  },
  {
    title: "New Linux Foundation project aims to bring DNS-style trust to AI agents",
    content: "As enterprises deploy increasing numbers of AI agents across applications, the Linux Foundation announced plans to launch the Agent Name Service framework designed to establish identity, ownership, and trust. The ANS framework will be based on the existing DNS system, creating a standardized naming and discovery layer for AI agents. Enterprises can publish agent identities through domains they already control, enabling other agents and systems to verify who an agent represents before interacting. The framework supports Decentralized Identifiers and Legal Entity Identifiers, tying agents to existing digital and organizational identity systems.",
    excerpt: "Linux Foundation's Agent Name Service brings DNS-style identity verification to enterprise AI agent ecosystems",
    categorySlug: "development",
    publishedAt: "2026-06-25T05:52:33.000Z",
    tags: ["Development", "AI", "Linux Foundation", "Security", "DevOps"]
  },
  {
    title: "GitHub actions/checkout v7 backport will block unreviewed fork pull request vulnerabilities in July",
    content: "On June 18, 2026, GitHub released actions/checkout v7 which blocks the most common patterns of pwn-request vulnerabilities by refusing to check out the head of an unreviewed fork pull request inside pull_request_target workflows. On July 16, 2026, GitHub will backport this enforcement logic to all currently supported major versions of the checkout action. GitHub's 2026 security roadmap additionally commits to workflow lockfiles pinning all dependencies to specific commit SHAs, centralized execution policies, scoped secrets binding credentials to their workflows, and a native egress firewall for CI/CD runners, with general availability expected in second half of 2026.",
    excerpt: "GitHub backports critical CI/CD security fix blocking fork pull request vulnerabilities across all checkout action versions",
    categorySlug: "development",
    publishedAt: "2026-06-25T14:30:00.000Z",
    tags: ["Development", "GitHub", "Security", "CI/CD", "DevOps"]
  },
  {
    title: "AI coding tool market defies consolidation as developers compose multi-tool stacks",
    content: "The AI coding tool market was supposed to consolidate around one winner but instead the opposite happened. In early April 2026, Cursor shipped a rebuilt interface for orchestrating parallel agents, OpenAI published an official plugin that runs inside Claude Code, and developers started running all three together not as competitors but as layers in a composable stack nobody designed but everyone is assembling. The April 2026 update to Copilot in Visual Studio centered entirely on agentic workflows with cloud agent sessions launching directly from the IDE, a new Debugger agent, and custom agents supporting user-level definitions that travel across projects.",
    excerpt: "Developers increasingly combine Cursor Claude Code and Codex in composable multi-tool AI coding stacks",
    categorySlug: "development",
    publishedAt: "2026-06-01T07:00:00.000Z",
    tags: ["Development", "AI", "Tools", "Copilot", "Productivity"]
  },
  {
    title: "Ornith-1.0 open-source coding model tops benchmarks among comparable models",
    content: "DeepReinforce's Ornith-1.0 family of reasoning models tuned for coding agents spans 9B Dense, 31B Dense, 35B MoE, and 397B MoE sizes under MIT license. At flagship scale, Ornith-1.0-397B posts 77.5 on Terminal-Bench 2.1 and 82.4 on SWE-Bench Verified, trailing only Claude Opus 4.8 (87.6) among listed models. The 35B model scores 64.2 on Terminal-Bench 2.1, above Qwen 3.5-397B's 53.5. The models target terminal-native coding agents and repository-scale work including multi-file refactors, bug localization, and test-driven patches. FP8 and GGUF builds are published for faster local serving.",
    excerpt: "Ornith-1.0-397B open-source coding model achieves 82.4 on SWE-Bench Verified trailing only Claude Opus 4.8",
    categorySlug: "development",
    publishedAt: "2026-06-25T17:15:00.000Z",
    tags: ["Development", "AI", "Open Source", "Coding", "LLM"]
  },

  // ======== Startup (12 articles) ========
  {
    title: "General Intuition raises $2.3B on bet that video games can train AI agents for the real world",
    content: "General Intuition raised $320 million at a $2.3 billion valuation, confirming TechCrunch's previous reporting. The round brings General Intuition's total disclosed funding to $454 million after the $134 million seed round at launch last October. The company trains AI agents using video game clips to develop spatial reasoning. The round was led by Khosla Ventures with participation from General Catalyst, Jeff Bezos, Eric Schmidt, Nico Rosberg, and researchers at Google DeepMind and MIT. The vast majority of the round will go toward scaling compute capacity through a deal with CoreWeave.",
    excerpt: "AI startup General Intuition raises $2.3B valuation using video games to train real-world AI agents",
    categorySlug: "startup",
    publishedAt: "2026-06-25T16:00:00.000Z",
    tags: ["Startup", "Funding", "AI", "Gaming", "Khosla"]
  },
  {
    title: "Patronus AI lands $50M Series B to build digital worlds that stress-test AI agents",
    content: "Patronus AI, a startup founded in 2023 by former Meta AI researchers Anand Kannappan and Rebecca Qian, has announced a $50 million Series B round led by Greenfield Partners with participation from Notable Capital, Lightspeed, Datadog, and Samsung. The company builds simulated digital environments in which to evaluate AI agents' performance. Patronus' revenue has grown 15-fold over the past year. The funding brings the company's total funding to $70 million as enterprises increasingly demand rigorous AI testing before deployment.",
    excerpt: "AI testing startup Patronus AI raises $50M Series B as demand for agent evaluation platforms surges 15x",
    categorySlug: "startup",
    publishedAt: "2026-06-25T20:19:25.000Z",
    tags: ["Startup", "Funding", "AI", "Testing", "Enterprise"]
  },
  {
    title: "Sail Research emerges from stealth with $80M to make AI agents cheaper to run",
    content: "Sail Research has emerged from stealth with $80 million in combined seed and Series A funding at a $450 million valuation. Sequoia led the seed round and Kleiner Perkins led the Series A. The startup, founded by ex-Apple and ex-NVIDIA engineers, says it can serve the tokens AI agents use at up to 10 times lower cost. The angel list includes John Hennessy, chairman of Alphabet, Lip-Bu Tan, CEO of Intel, and Tri Dao, chief scientist at Together AI. The startup also drew angels from Anthropic, OpenAI, SpaceX, and Thinking Machines.",
    excerpt: "Ex-Apple and ex-NVIDIA engineers raise $80M for Sail Research promising 10x cheaper AI agent inference",
    categorySlug: "startup",
    publishedAt: "2026-06-25T12:00:00.000Z",
    tags: ["Startup", "Funding", "AI", "Infrastructure", "Sequoia"]
  },
  {
    title: "Runpod raises $100M Series A to build leading cloud platform for AI developers",
    content: "AI developer-centric cloud provider Runpod announced it has raised $100 million in early-stage funding, pushing the valuation to $1 billion. The Series A funding was led by Summit Partners, bringing total funding to $122 million across multiple rounds including a seed round in May 2024 co-led by Intel Capital and Dell Technologies Capital. With the funding, the company intends to continue investing in the platform and developer experience, expand its team across engineering and developer relations, and broaden global access for developers worldwide.",
    excerpt: "AI cloud platform Runpod reaches $1B valuation with $100M Series A led by Summit Partners",
    categorySlug: "startup",
    publishedAt: "2026-06-25T17:15:11.000Z",
    tags: ["Startup", "Funding", "AI", "Cloud", "Infrastructure"]
  },
  {
    title: "Stark raises €500M to scale sovereign European defense manufacturing",
    content: "European defense technology company Stark has raised €500 million in financing to scale sovereign European defense manufacturing. The round reflects the growing urgency among European nations to build independent defense capabilities. Stark joins a wave of defense-tech startups attracting significant capital as governments increase military spending in response to geopolitical tensions. The company focuses on advanced manufacturing capabilities for next-generation defense systems.",
    excerpt: "European defense-tech Stark raises €500M to build sovereign military manufacturing capabilities",
    categorySlug: "startup",
    publishedAt: "2026-06-23T21:57:09.000Z",
    tags: ["Startup", "Funding", "Defense", "Europe", "Manufacturing"]
  },
  {
    title: "Taktile raises $110M to put AI in charge of high-stakes bank decisions",
    content: "Taktile has raised $110 million in a Series C led by Goldman Sachs Alternatives. The Berlin-and-New-York startup wants banks and insurers to hand their riskiest decisions to AI agents. Balderton Capital, Index Ventures, Tiger Global, Y Combinator, and Dig Ventures all joined. The deal brings Taktile's total funding to $184 million. The timing reflects a shift in what AI can do. 'AI has been around for a couple of years, but 2026 is the year where AI comes to financial services,' co-founder Wehmeyer told Fortune.",
    excerpt: "Goldman Sachs leads $110M Series C in Taktile's AI-powered banking decision platform",
    categorySlug: "startup",
    publishedAt: "2026-06-25T16:12:36.000Z",
    tags: ["Startup", "Funding", "AI", "FinTech", "Banking"]
  },
  {
    title: "Scaled Cognition raises $100M to build AI that does not hallucinate",
    content: "Scaled Cognition has raised $100 million in a Series A round led by Khosla Ventures. The Mountain View AI lab chases one prize: reliability. Its flagship model APT (Agentic Pretrained Transformer) promises to never give a wrong answer. The Wall Street Journal reported the startup is valued at about $750 million. Early customer Genesys, a cloud contact-centre giant serving over 8,000 organizations in 100+ countries, uses APT for agentic virtual agents. Companies using Scaled Cognition's models are on track to automate more than one billion customer support interactions over the next twelve months.",
    excerpt: "Scaled Cognition raises $100M at $750M valuation for APT model promising zero-hallucination AI",
    categorySlug: "startup",
    publishedAt: "2026-06-25T15:12:40.000Z",
    tags: ["Startup", "Funding", "AI", "Khosla", "Enterprise"]
  },
  {
    title: "Peregrine Technologies raises $250M to push AI deeper into government operations",
    content: "Peregrine Technologies raised $250 million in Series D funding for government and enterprise operations software. The company pushes AI deeper into high-stakes government operations including public safety, emergency response, and critical infrastructure monitoring. The round was part of a broader funding week where capital went to software that sits inside real operating systems and infrastructure that decides who gets served, monitored, dispatched, or protected.",
    excerpt: "Government AI software company Peregrine Technologies raises $250M Series D for public safety operations",
    categorySlug: "startup",
    publishedAt: "2026-06-23T22:00:00.000Z",
    tags: ["Startup", "Funding", "AI", "Government", "Enterprise"]
  },
  {
    title: "The week's 10 biggest funding rounds megarounds proliferate led by enterprise software AI and space",
    content: "Startup investors were in a spendy mood this week backing more than a dozen rounds in the multiple hundreds of millions. The biggest went to spend-management platform Ramp which closed on $750 million. Three $500 million rounds followed for companies in AI and space tech: Impulse Space (spacecraft propulsion), Supabase (open-source AI developer platform), and Flourish (foundational AI inspired by the human brain). Helion raised $465 million for fusion energy at a $15.5 billion valuation. Suno raised $400 million for AI music tools. AlphaSense raised $350 million for AI enterprise software.",
    excerpt: "Record-breaking week sees Ramp Impulse Space and Supabase lead $500M+ funding rounds across AI and space tech",
    categorySlug: "startup",
    publishedAt: "2026-06-05T15:49:12.000Z",
    tags: ["Startup", "Funding", "AI", "Space", "Enterprise"]
  },
  {
    title: "Cadence raises $100M to automate chronic care with regulated AI in partnership with Duke Health",
    content: "Cadence raised $100 million in Series C funding to automate chronic-care with regulated AI. The company partners with Duke Health to deploy AI-powered chronic care management solutions. The round reflects growing investor confidence in healthcare AI applications that operate within regulatory frameworks. Cadence's platform aims to reduce the administrative burden on healthcare providers while improving patient outcomes through continuous monitoring and AI-driven interventions.",
    excerpt: "Healthcare AI startup Cadence raises $100M Series C with Duke Health partnership for chronic care automation",
    categorySlug: "startup",
    publishedAt: "2026-06-23T21:30:00.000Z",
    tags: ["Startup", "Funding", "AI", "Healthcare", "Enterprise"]
  },
  {
    title: "RunPod reaches unicorn status with $100M Series A for AI developer cloud platform",
    content: "AI developer cloud platform RunPod has reached unicorn status with a $100 million Series A funding round led by Summit Partners. The company provides GPU-equipped cloud infrastructure specifically optimized for AI developers, offering on-demand access to high-performance computing resources. RunPod plans to use the funding to expand its global infrastructure footprint, enhance developer tools, and build out its engineering and developer relations teams.",
    excerpt: "AI cloud startup RunPod achieves unicorn status with $100M Series A for developer-focused GPU infrastructure",
    categorySlug: "startup",
    publishedAt: "2026-06-25T17:30:00.000Z",
    tags: ["Startup", "Funding", "AI", "Cloud", "Infrastructure"]
  },
  {
    title: "Venture capital funding roundup reveals defense AI and healthcare dominate June 2026",
    content: "The last 12 hours of startup financing looked like a market making a narrower harder-edged bet. Capital went to software that sits inside real operating systems, to infrastructure that decides who gets served, monitored, dispatched, or protected, and to physical-world technologies tied to defense, energy, and medical supply chains. The clearest signals came from Peregrine's $250 million Series D for government software, Cadence's $100 million Series C for chronic-care automation, Stark's €500 million defense-tech financing, and a cluster of strategic rounds in fusion, semiconductors, and building-efficiency execution.",
    excerpt: "Defense AI and healthcare dominate June 2026 startup funding with Stark Peregrine and Cadence leading",
    categorySlug: "startup",
    publishedAt: "2026-06-23T21:57:09.000Z",
    tags: ["Startup", "Funding", "AI", "Defense", "Healthcare"]
  },

  // ======== Education (11 articles) ========
  {
    title: "Microsoft adds new AI-powered teaching capabilities to Microsoft 365 Education at no extra cost",
    content: "Education has moved past early experimentation into a new phase where institutions are asking for AI that's purpose-built for learning. Microsoft announced several new AI-powered teaching capabilities built with educator feedback. The Study and Learn Agent in Copilot Chat is a learning-science-powered experience built specifically for students age 13 and older at no additional cost with Microsoft 365 Education. It reframes AI from an answer engine into an interactive learning coach with scaffolded questions, flashcards, quizzes, and immediate feedback. Microsoft also introduced Copilot Notebooks as an AI-powered workspace where students can ground answers with their own learning materials.",
    excerpt: "Microsoft launches free AI Study and Learn Agent and Copilot Notebooks for 365 Education subscribers",
    categorySlug: "education",
    publishedAt: "2026-06-24T13:00:00.000Z",
    tags: ["Education", "AI", "Microsoft", "EdTech", "Learning"]
  },
  {
    title: "Alpha School brings $4500-a-week AI summer camp to the Hamptons",
    content: "Alpha School, an experimental private school that swaps teachers for 'guides' and uses AI to pack academics into just two hours, is offering its first summer classes in the Hamptons. For $4,500 a week, kids from pre-K through rising ninth grade learn math and reading in the morning taught by a proprietary AI model and other apps before pivoting to afternoon activities with rotating guests like chefs and athletes. The program represents a luxury-tier experiment in AI-powered education.",
    excerpt: "AI-powered private school Alpha School launches $4,500/week summer camp program in the Hamptons",
    categorySlug: "education",
    publishedAt: "2026-06-25T13:00:00.000Z",
    tags: ["Education", "AI", "EdTech", "Summer Camp", "Innovation"]
  },
  {
    title: "Norway blocks generative AI for elementary students starting August 2026 in landmark policy",
    content: "Norway has announced that generative AI will be blocked for elementary students in grades 1 to 7 (ages 6 to 13) starting August 2026. Kids cannot use ChatGPT, Gemini, or Copilot in school. Prime Minister Støre said ages 6 to 13 are critical for building independent thinking plus reading and math skills. Grades 8 to 13 can use AI under strict rules. University students are unaffected. Teachers can use AI in class to demonstrate how tools work as technology education. Norway is the first country to make age-specific AI policy binding, and its outcomes could influence policy across Europe.",
    excerpt: "Norway becomes first country to ban generative AI for elementary students ages 6-13 starting August 2026",
    categorySlug: "education",
    publishedAt: "2026-06-24T14:20:46.000Z",
    tags: ["Education", "AI", "Policy", "Norway", "Children"]
  },
  {
    title: "Microsoft adds AI teaching tools to 365 Education as 92% of students already use AI",
    content: "Microsoft has announced a series of AI teaching and learning features for Microsoft 365 Education including standards-aligned Unit Plans, assignment-level AI rules, guided student study tools, and educator-led interactive lessons. The product updates arrive alongside Microsoft's 2026 AI in Education Special Report which found that 92 percent of students and education leaders, and 88 percent of educators, had already used AI for school-related purposes. New features include Student AI Guidelines within Assignments allowing educators to set how much AI use is permitted for each piece of work, and Learning Zone introducing educator-paced live classroom experiences.",
    excerpt: "92% of students have used AI as Microsoft rolls out assignment-level AI controls and Unit Plans",
    categorySlug: "education",
    publishedAt: "2026-06-25T08:44:10.000Z",
    tags: ["Education", "AI", "Microsoft", "EdTech", "Policy"]
  },
  {
    title: "EU and OECD set 19 AI literacy competences for schools with curriculum blueprint",
    content: "The European Commission and the OECD published the final version of their AI literacy framework for primary and secondary education titled 'Empowering Learners for the Age of AI.' The document defines 19 competences organized into four domains: engaging with AI, creating with AI, managing AI, and shaping AI. It is the first time two bodies with this much convening power have agreed on a single map of what a student should know. Survey work found that 88 percent of European teenagers aged 13 to 15 use AI tools weekly for learning, climbing to 96 percent for ages 16 to 18. The competences will feed PISA 2029, the first OECD international assessment to measure AI literacy.",
    excerpt: "EU and OECD establish 19 standardized AI literacy competences for European schools feeding into PISA 2029",
    categorySlug: "education",
    publishedAt: "2026-06-24T10:00:00.000Z",
    tags: ["Education", "AI", "EU", "OECD", "Policy"]
  },
  {
    title: "Realbotix to deploy first humanoid robot and AI teacher's assistant in US school district",
    content: "Realbotix has launched Optio, its AI teacher's assistant, in a pilot program at Salamanca City Central School District on the Seneca Nation Reservation in New York. The district is also deploying a Realbotix M-Series humanoid robot to enhance interactive classroom engagement. Optio is an AI-powered teacher's assistant and at-home tutor designed to extend learning beyond school hours. Students interact with personalized avatars trained in district curriculum. The platform provides scalable AI assistance with education-specific safety guardrails including protections against inappropriate responses and unreliable outputs.",
    excerpt: "First humanoid robot teacher's assistant deployed in US school district through Realbotix Optio platform",
    categorySlug: "education",
    publishedAt: "2026-06-24T11:30:00.000Z",
    tags: ["Education", "AI", "Robotics", "EdTech", "Innovation"]
  },
  {
    title: "Microsoft AI in Education Report reveals widespread adoption and increasing support demand",
    content: "Microsoft unveiled the third edition of its annual AI in Education Report revealing that 87% of educators and education leaders and 79% of students agree that knowing how to use AI effectively and responsibly is important for students' futures. The company also announced a new wave of AI-powered teaching and learning experiences available at no additional cost. The Microsoft Elevate for Educators program offers community, credentials, and capacity-building resources. Microsoft also introduced an AI Literacy for Educators credential pathway co-created with ISTE and ASCD grounded in the European Commission and OECD AI Literacy Framework.",
    excerpt: "Microsoft AI in Education Report shows 87% of educators see AI literacy as essential for student futures",
    categorySlug: "education",
    publishedAt: "2026-06-24T13:00:00.000Z",
    tags: ["Education", "AI", "Microsoft", "Research", "Literacy"]
  },
  {
    title: "OECD Digital Education Outlook 2026 finds GenAI reshapes education when guided by pedagogy",
    content: "The OECD Digital Education Outlook 2026 analyses emerging research suggesting generative AI can support learning when guided by clear teaching principles. However, if designed or used without pedagogical guidance, outsourcing tasks to GenAI simply enhances performance with no real learning gains. The Outlook highlights GenAI's benefits as a tutor, partner and assistant. It notes that GenAI tools can amplify teachers' capacity to teach creating benefits that exceed what either teachers or AI can achieve independently when co-designed with educators and end users.",
    excerpt: "OECD report finds GenAI improves learning only when guided by clear pedagogical principles and teacher involvement",
    categorySlug: "education",
    publishedAt: "2026-01-19T07:33:58.000Z",
    tags: ["Education", "AI", "OECD", "Research", "Pedagogy"]
  },
  {
    title: "Google.org renews support for aiEDU to scale AI readiness for educators nationwide",
    content: "The AI Education Project (aiEDU) announced renewed support from Google.org to scale AI Readiness for educators nationwide. Since 2023, aiEDU with support from Google.org has reached 5,455 educators and impacted 185,938 students across 17 states with a strong focus on rural and Indigenous communities. The renewed funding will expand school district partnerships (majority Title I), scale flexible learning pathways including the Trailblazer Fellowship, and launch professional learning communities for administrators. aiEDU's total reach now exceeds 48,000 educators and 1.9 million students nationwide.",
    excerpt: "Google.org renews aiEDU funding to expand AI readiness training reaching 1.9 million students nationally",
    categorySlug: "education",
    publishedAt: "2026-06-24T19:02:00.000Z",
    tags: ["Education", "AI", "Google", "EdTech", "Nonprofit"]
  },
  {
    title: "Microsoft adds Copilot Notebooks and Study and Learn Agent free to education subscribers",
    content: "Microsoft is expanding its AI-powered education tools with Copilot Notebooks and Study and Learn Agents available at no additional cost to existing Microsoft 365 Education customers. Copilot Notebooks allows students to ground answers with their own learning materials similar to Google's NotebookLM. For teachers, Unit Plans within the Teach agent generate structured curriculum frameworks grounded in learning science. Learning Groups in Assignments automatically categorize students based on performance data. While over 90% of students are using AI, nearly 80% lack formal training according to Microsoft's data.",
    excerpt: "Microsoft adds free Copilot Notebooks and AI teaching tools to close the AI training gap for 80% of students",
    categorySlug: "education",
    publishedAt: "2026-06-24T16:38:01.000Z",
    tags: ["Education", "AI", "Microsoft", "EdTech", "Tools"]
  },
  {
    title: "Norway's elementary AI ban could reshape European education policy",
    content: "Norway's decision to block generative AI for students ages 6 to 13 represents a significant shift from AI adoption to restriction in education. Finland and Denmark are studying similar questions and European countries are watching Norway's outcomes to see if limiting AI improves learning. The policy is the first age-specific AI regulation that is binding rather than advisory. The EU is building broader AI governance for education but no member state has this kind of restriction yet. Education ministries across Europe will track literacy scores, teacher compliance, and enforcement outcomes.",
    excerpt: "Norway's landmark elementary AI ban becomes test case for European education policy on artificial intelligence",
    categorySlug: "education",
    publishedAt: "2026-06-24T14:30:00.000Z",
    tags: ["Education", "AI", "Policy", "Norway", "Europe"]
  },

  // ======== Defense & Drones (11 articles) ========
  {
    title: "South Korea tests live-fire defenses against drone swarm in first air force exercise",
    content: "South Korea's air force successfully conducted its first live-fire exercise against a swarm of 50 drones, shooting down all aerial targets with a combination of Vulcan cannons, a portable laser system, and shotguns. The exercise was carried out by the Air Force Missile Defense Command. Eight Vulcan cannons fired simultaneously at 50 low-flying drones from about one kilometer away, destroying 44 targets before they reached defensive positions. The remaining six drones were intercepted at close range using a portable laser weapon and five shotguns achieving a 100% interception rate.",
    excerpt: "South Korea achieves 100% interception rate in first live-fire drone swarm defense exercise using lasers and cannons",
    categorySlug: "defense-drones",
    publishedAt: "2026-06-25T12:35:58.000Z",
    tags: ["Defense", "Drones", "South Korea", "Military", "Counter-UAS"]
  },
  {
    title: "Tashi Network and DroneVerse complete drone swarm field trial in Delhi",
    content: "Tashi Network in collaboration with DroneVerse has completed a live drone swarm field trial in Delhi. Executed across a 72-hour operational evaluation window, the field trials deployed scalable multi-aircraft autonomous tactical cells tasked with securing a 20,000-square-metre simulated contested perimeter. The swarm infrastructure was stress-tested across two operational environments. The trial demonstrated how a decentralised mesh keeps missions going even when individual drones drop out, batteries run low, or links back to base are intermittent.",
    excerpt: "72-hour drone swarm field trial in Delhi demonstrates autonomous tactical cells securing contested perimeters",
    categorySlug: "defense-drones",
    publishedAt: "2026-06-25T10:45:00.000Z",
    tags: ["Defense", "Drones", "India", "Swarm", "Autonomous"]
  },
  {
    title: "Next phase of attack drones will see AI choosing targets autonomously",
    content: "The next evolution of attack drones like Russia's Shaheds will feature AI that allows the drone to independently recognize targets and choose to strike them, according to Serhii 'Flash' Beskrestnov, one of Ukraine's top drone analysts and advisor to Ukraine's defense ministry. 'Analyzing targets by priority, selecting a target, and autonomously deciding to attack are undoubtedly the near future for the entire class of strike UAVs.' Russia already possesses technology for drones to identify targets through advanced cameras. Terminal guidance for AI steering loitering munitions has already been implemented in both Ukrainian and Russian UAVs.",
    excerpt: "AI-powered autonomous target selection coming to attack drones as Ukraine and Russia race to deploy smart munitions",
    categorySlug: "defense-drones",
    publishedAt: "2026-06-25T06:50:56.000Z",
    tags: ["Defense", "Drones", "AI", "Ukraine", "Russia"]
  },
  {
    title: "Lithuania develops Black Wasp autonomous interceptor drone to kill kamikaze drones",
    content: "Lithuanian drone company Granta Autonomy launched the Black Wasp interceptor drone designed to destroy Shahed-class and other enemy aerial threats autonomously. The 4 kg drone reaches 320 km/h maximum speed and operates to 40 km range with return capability. It uses AI-powered guidance resilient to GPS jamming. The Black Wasp is Granta's answer to the economic trap of expensive surface-to-air missiles being used against cheap drones. At cruise speed of 160 km/h and maximum speed of 320 km/h, it is well above the typical flight speed of Shahed-class drones.",
    excerpt: "Lithuania's Black Wasp autonomous interceptor drone targets Shahed-class threats at 320 km/h with AI guidance",
    categorySlug: "defense-drones",
    publishedAt: "2026-06-25T07:11:00.000Z",
    tags: ["Defense", "Drones", "Lithuania", "Interceptor", "Autonomous"]
  },
  {
    title: "Robinson partners with Skyryse to develop uncrewed R66 helicopter for defense missions",
    content: "Robinson and Skyryse have partnered to develop an uncrewed version of the R66 helicopter aimed at the defense market. The R66-based UAS will be integrated with Skyryse's SkyOS software to enable autonomous intelligence, surveillance, and reconnaissance (ISR), manned-unmanned teaming (MUM-T), and air-launched effects (ALE) missions. 'Defense agencies need autonomous aircraft that are reliable, affordable and available now, not years from now,' said Skyryse Founder and CEO Mark Groden. The R66 is already used to train U.S. military pilots through the Navy's COPT-R program.",
    excerpt: "Robinson and Skyryse partner to create autonomous uncrewed R66 helicopter for military ISR missions",
    categorySlug: "defense-drones",
    publishedAt: "2026-06-24T23:44:09.000Z",
    tags: ["Defense", "Drones", "Helicopter", "Autonomous", "Military"]
  },
  {
    title: "India's Archer-NG surveillance UAVs upgraded to become tank and jet killers",
    content: "The Defence Research and Development Organisation will upgrade the Archer-NG (Next Generation) Unmanned Aerial Vehicle into a multi-role combat platform. Originally developed as medium-altitude long-endurance MALE drones for ISR missions, the Archer-NGs will become attack drones capable of taking on aerial and ground targets. They will remain airborne for around 18 hours at altitudes over 30,000 feet. DRDO will integrate AI-enabled target recognition and precision-guided munitions, anti-tank guided missiles, and air-to-air weapons.",
    excerpt: "India's Archer-NG drones upgraded from surveillance to multi-role combat with AI targeting and anti-tank missiles",
    categorySlug: "defense-drones",
    publishedAt: "2026-06-25T10:05:50.000Z",
    tags: ["Defense", "Drones", "India", "Military", "ISR"]
  },
  {
    title: "DRDO-developed Netra AEW&C India's eye in the sky declared combat-ready with final clearance",
    content: "The indigenously-developed Netra Airborne Early Warning and Control system achieved a major milestone when DRDO handed over the final operational clearance certificate to the Indian Air Force, meaning the system is fully combat-ready. The Netra AEW&C is a specialized airborne radar and command centre designed to detect incoming projectiles, ships and aircraft at long ranges, identify friend from foe, and direct friendly fighters in real time. It provides 250-500+ km detection ranges and 300 to 360 degree radar coverage to track hostile aircraft, drones and cruise missiles.",
    excerpt: "India's Netra AEW&C airborne early warning system achieves final operational clearance for full combat readiness",
    categorySlug: "defense-drones",
    publishedAt: "2026-06-25T16:54:00.000Z",
    tags: ["Defense", "Drones", "India", "Radar", "Military"]
  },
  {
    title: "France orders 5000 Harmattan AI drones in major expansion of military drone capability",
    content: "France has placed an order for 5,000 military drones from domestic defense technology startup Harmattan AI, marking one of the largest acquisitions of small unmanned aerial systems ever undertaken by the French armed forces. The announcement was made by France's Armed Forces Ministry on June 23. The procurement highlights the growing importance of low-cost tactical drones in modern warfare. Harmattan AI, founded in 2024 and backed by Dassault Aviation, has become a central component of France's push for sovereign defense technologies and AI-enabled military systems.",
    excerpt: "France orders 5,000 Harmattan AI drones in largest small UAV procurement strengthening sovereign defense manufacturing",
    categorySlug: "defense-drones",
    publishedAt: "2026-06-24T03:10:59.000Z",
    tags: ["Defense", "Drones", "France", "Military", "Manufacturing"]
  },
  {
    title: "Poland buys V-BAT surveillance drones in $16 million Shield AI naval deal",
    content: "Poland has signed a contract worth approximately $16 million to purchase American-made V-BAT vertical takeoff and landing drones for its Navy. The agreement confirmed by Poland's Armament Agency covers one full system set and several aerial platforms, making Poland one of the first European NATO allies to field the V-BAT in a dedicated naval role. The V-BAT is built by Shield AI, a San Diego-based defense technology company. The drones will operate from Polish Navy vessels conducting ISR missions in the Baltic Sea where hybrid security threats have increased.",
    excerpt: "Poland acquires V-BAT naval surveillance drones in $16M Shield AI deal for Baltic maritime security",
    categorySlug: "defense-drones",
    publishedAt: "2026-06-24T08:17:10.000Z",
    tags: ["Defense", "Drones", "Poland", "Navy", "ISR"]
  },
  {
    title: "Ukraine's new cheap recon drone Sweetheart flies 150 km deep into enemy lines with EW resistance",
    content: "Ukrainian defense firm General Chereshnya has developed a hand-launched reconnaissance drone called Sweetheart capable of flying 150 km into enemy territory while resisting electronic jamming. The drone weighs 4 kg and spans 1.7 meters across its wings, dimensions that allow a single soldier to carry and launch it without any ground support equipment. Sweetheart can remain airborne for up to three hours and operates at distances up to 150 km from its operator. The sensor package includes a digital video link, gimbaled zoom camera, and laser rangefinder with datalink designed to resist electronic warfare interference.",
    excerpt: "Ukrainian Sweetheart hand-launched recon drone achieves 150km range with EW-resistant datalink at low cost",
    categorySlug: "defense-drones",
    publishedAt: "2026-06-24T12:31:58.000Z",
    tags: ["Defense", "Drones", "Ukraine", "Reconnaissance", "EW"]
  },
  {
    title: "Harmattan AI emerges as Europe's fastest-growing defense tech startup with 5000-drone French order",
    content: "Harmattan AI has emerged as one of Europe's fastest-growing defense technology firms following France's order of 5,000 military drones. The company, founded in 2024 and backed by Dassault Aviation, has become central to France's push for sovereign defense technologies and AI-enabled military systems. The order reflects lessons learned from Ukraine where low-cost drones have become essential battlefield assets. The procurement strengthens France's broader strategy of integrating AI-enabled autonomous systems across future military operations.",
    excerpt: "French defense startup Harmattan AI becomes Europe's fastest-growing defense tech firm with landmark 5,000-drone order",
    categorySlug: "defense-drones",
    publishedAt: "2026-06-24T03:30:00.000Z",
    tags: ["Defense", "Drones", "France", "Startup", "Europe"]
  },
];

async function getAdminUserId(): Promise<string> {
  const admin = await prisma.user.findUnique({
    where: { email: "admin@nexusai.com" },
  });
  if (!admin) throw new Error("Admin user not found. Run seed first.");
  return admin.id;
}

async function generateSlug(title: string): Promise<string> {
  return slugify(title, { lower: true, strict: true });
}

async function main() {
  try {
    console.log("Starting NexusAI database seed...\n");

    // Create categories
    const categories = [
      { name: "AI", slug: "ai", description: "Artificial Intelligence news, models, and research" },
      { name: "Development", slug: "development", description: "Software development, frameworks, and tools" },
      { name: "Startup", slug: "startup", description: "Startups, funding, and entrepreneurship" },
      { name: "Education", slug: "education", description: "EdTech, learning resources, and courses" },
      { name: "Defense & Drones", slug: "defense-drones", description: "Defense technology, drones, and autonomous systems" },
    ];

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      });
    }
    console.log("✓ Categories seeded");

    // Create tags
    const tags = [
      "AI", "Machine Learning", "LLM", "React", "Next.js", "Node.js",
      "TypeScript", "Python", "Startup", "Funding", "OpenAI", "DeepSeek",
      "Autonomous", "Drone", "Computer Vision", "Robotics",
      "Google", "Anthropic", "Microsoft", "Security", "Development",
      "Hardware", "Chips", "Linux Foundation", "CI/CD", "GitHub",
      "Open Source", "Cloud", "Enterprise", "EdTech", "Education",
      "Europe", "Military", "ISR", "Innovation", "Testing",
      "Research", "Policy", "Investment", "Infrastructure", "Robotics",
      "Defense", "Counter-UAS", "India", "France", "Ukraine",
      "Kernel", "Rust", "Coding", "Agent", "LLM",
    ];

    for (const tag of tags) {
      await prisma.tag.upsert({
        where: { slug: tag.toLowerCase().replace(/\s+/g, "-") },
        update: {},
        create: { name: tag, slug: tag.toLowerCase().replace(/\s+/g, "-") },
      });
    }
    console.log("✓ Tags seeded");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.upsert({
      where: { email: "admin@nexusai.com" },
      update: {},
      create: {
        email: "admin@nexusai.com",
        password: hashedPassword,
        name: "Admin",
        role: "ADMIN",
      },
    });
    console.log(`✓ Admin user created: ${admin.email}`);
    console.log(`  Login: admin@nexusai.com / admin123`);

    // Create articles
    const adminId = admin.id;

    // Get category map
    const categoryMap: Record<string, string> = {};
    for (const cat of categories) {
      const dbCat = await prisma.category.findUnique({ where: { slug: cat.slug } });
      if (dbCat) categoryMap[cat.slug] = dbCat.id;
    }

    // Get tag map for lookup
    const tagMap: Record<string, string> = {};
    const allTags = await prisma.tag.findMany();
    for (const t of allTags) {
      tagMap[t.slug] = t.id;
    }

    // Clear existing articles so we can add cover images fresh
    const existingCount = await prisma.article.count();
    if (existingCount > 0) {
      await prisma.articleTag.deleteMany({});
      await prisma.article.deleteMany({});
      console.log(`✓ Cleared ${existingCount} existing articles for fresh seed with cover images`);
    }

    console.log(`\nCreating ${realArticles.length} real news articles with cover images...\n`);

    let createdCount = 0;
    const categoryCounts: Record<string, number> = {};

    // Category-specific image pools (real Unsplash photos)
    const coverImagePools: Record<string, string[]> = {
      "defense-drones": [
        "https://images.unsplash.com/photo-1743267822449-7c6ca87926bd?auto=format&fit=crop&w=800&h=400",
        "https://images.unsplash.com/photo-1770411034013-e6cb865ed21a?auto=format&fit=crop&w=800&h=400",
        "https://images.unsplash.com/photo-1724406096690-9fdf908faa87?auto=format&fit=crop&w=800&h=400",
        "https://images.unsplash.com/photo-1759610900660-b86f99e57c10?auto=format&fit=crop&w=800&h=400",
        "https://images.unsplash.com/photo-1759610736470-846dd0d667bb?auto=format&fit=crop&w=800&h=400",
        "https://images.unsplash.com/photo-1759610545704-9bbee32cb17c?auto=format&fit=crop&w=800&h=400",
        "https://images.unsplash.com/photo-1694504773665-b6d6c95397e9?auto=format&fit=crop&w=800&h=400",
        "https://images.unsplash.com/photo-1663011674120-bae80b78377c?auto=format&fit=crop&w=800&h=400",
      ],
    };
    const poolIndex: Record<string, number> = {};

    for (const article of realArticles) {
      const categoryId = categoryMap[article.categorySlug];
      if (!categoryId) {
        console.log(`  ⚠ Category not found for slug: ${article.categorySlug}`);
        continue;
      }

      const slug = await generateSlug(article.title);

      // Check if article with this slug already exists
      const existing = await prisma.article.findUnique({ where: { slug } });
      if (existing) {
        console.log(`  - Skipping (exists): "${article.title.substring(0, 60)}..."`);
        continue;
      }

      const createdArticle = await prisma.article.create({
        data: {
          title: article.title,
          slug,
          content: article.content,
          excerpt: article.excerpt,
          categoryId,
          status: "PUBLISHED",
          publishedAt: new Date(article.publishedAt),
          authorId: adminId,
          coverImage: (() => {
            const pool = coverImagePools[article.categorySlug];
            if (pool) {
              const idx = (poolIndex[article.categorySlug] ?? 0) % pool.length;
              poolIndex[article.categorySlug] = idx + 1;
              return pool[idx];
            }
            return `https://picsum.photos/seed/${slug.substring(0, 60)}/800/400`;
          })(),
        },
      });

      // Assign tags to the article
      for (const tagName of article.tags) {
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, "-");
        let tagId = tagMap[tagSlug];

        // Create tag if it doesn't exist
        if (!tagId) {
          const newTag = await prisma.tag.create({
            data: { name: tagName, slug: tagSlug },
          });
          tagId = newTag.id;
          tagMap[tagSlug] = tagId;
        }

        await prisma.articleTag.create({
          data: {
            articleId: createdArticle.id,
            tagId: tagId,
          },
        }).catch(() => {});
      }

      createdCount++;
      categoryCounts[article.categorySlug] = (categoryCounts[article.categorySlug] || 0) + 1;
    }

    console.log(`\n✓ ${createdCount} articles created successfully!\n`);
    console.log("Breakdown by category:");
    for (const [slug, count] of Object.entries(categoryCounts)) {
      const catName = categories.find((c) => c.slug === slug)?.name || slug;
      console.log(`  ${catName}: ${count} articles`);
    }

    console.log("\n✓ Database seed complete!");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
