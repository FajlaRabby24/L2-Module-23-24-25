import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Request, Response } from "express";
import { config } from "./config";
import { auth } from "./lib/auth";
import { commentRouter } from "./modules/comment/commentRouter";
import { postRouter } from "./modules/post/postRoute";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  })
);

app.all("/api/auth/*spalte", toNodeHandler(auth));

app.use("/api/posts", postRouter);

app.use("/api/comment", commentRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route for testing.",
  });
});

export default app;
