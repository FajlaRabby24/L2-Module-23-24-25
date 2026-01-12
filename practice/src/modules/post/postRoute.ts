import { Router } from "express";
import { postController } from "./postController";

const router = Router();

router.get("/", postController.getAllPost);

router.get("/:postId", postController.getPostById);

router.post("/", postController.createPost);

export const postRouter = router;
