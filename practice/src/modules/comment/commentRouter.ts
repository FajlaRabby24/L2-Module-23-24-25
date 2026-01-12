import { Router } from "express";
import { UserRoles } from "../../constant";
import { auth } from "../../middleware/auth";
import { commentController } from "./commentController";

const router = Router();

router.get("/", commentController.getAllComment);

router.get("/:commentId", commentController.getCommentById);

router.get("/author/:authorId", commentController.getCommentByAuthorId);

router.post(
  "/",
  auth(UserRoles.ADMIN, UserRoles.USER),
  commentController.createComment
);

router.delete(
  "/:commentId",
  auth(UserRoles.ADMIN, UserRoles.USER),
  commentController.deleteComment
);

router.patch("/:commentId", commentController.updateComment);

export const commentRouter = router;
