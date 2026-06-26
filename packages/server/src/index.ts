import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import articleRoutes from "./routes/articles.routes";
import categoryRoutes from "./routes/categories.routes";
import tagRoutes from "./routes/tags.routes";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});

export default app;
