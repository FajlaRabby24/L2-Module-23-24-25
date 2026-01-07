import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { config } from "./config";
import { auth } from "./lib/auth";
import { commentRouter } from "./modules/comment/comment.service";
import { postRouter } from "./modules/post/post.router";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  })
);

app.all("/api/auth/*spalte", toNodeHandler(auth));

app.use("/api/post", postRouter);
app.use("/api/comments", commentRouter);

export default app;
