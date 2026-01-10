import { Router } from "express";
import { UserRoles } from "../../constant";
import { auth } from "../post/post.router";
import { commentController } from "./comment.controller";

const router = Router();

router.get("/:commentId", commentController.getCommentById);

// create comment -> admin, user
router.post(
  "/",
  auth(UserRoles.ADMIN, UserRoles.USER),
  commentController.createComment
);

export const commentRouter = router;
