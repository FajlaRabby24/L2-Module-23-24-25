import { NextFunction, Request, Response, Router } from "express";
import { UserRoles } from "../../constant";
import { auth as betterAuth } from "../../lib/auth";
import { postController } from "./post.controller";

const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

export const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Your are not authorized!",
        });
      }

      if (!session.user.emailVerified) {
        return res.status(403).json({
          seuccess: false,
          message: "Email verification requred. Please verify your email!",
        });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        emailVerified: session.user.emailVerified,
        role: session.user.role!,
      };

      if (roles.length && !roles.includes(req.user.role as UserRoles)) {
        return res.status(403).json({
          seuccess: false,
          message:
            "Forbidden! You don't have permission to access this resources!",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

router.get("/stats", auth(UserRoles.ADMIN), postController.getStats);

router.post(
  "/",
  auth(UserRoles.USER, UserRoles.ADMIN),
  postController.createPost
);

router.get("/", postController.getAllPost);

router.get(
  "/my-posts",
  auth(UserRoles.ADMIN, UserRoles.USER),
  postController.getMyPosts
);

router.get("/:postId", postController.getPostById);

router.patch(
  "/:postId",
  auth(UserRoles.ADMIN, UserRoles.USER),
  postController.updatePost
);

router.delete(
  "/:postId",
  auth(UserRoles.ADMIN, UserRoles.USER),
  postController.deletePost
);

export const postRouter = router;
