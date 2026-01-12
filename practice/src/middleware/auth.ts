import { NextFunction, Request, Response } from "express";
import { UserRoles } from "../constant";
import { auth as betterAuth } from "../lib/auth";
import { sendResponse } from "../utils/sendResponse";

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
        return sendResponse(res, 401, false, "Your are not authorized!");
      }

      if (!session?.user.emailVerified) {
        return sendResponse(
          res,
          403,
          false,
          "Email verification requred. Please verify your email!"
        );
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        emailVerified: session.user.emailVerified,
        role: session.user.role!,
      };

      if (roles.length && !roles.includes(req.user.role as UserRoles)) {
        return sendResponse(
          res,
          403,
          false,
          "Forbidden! You don't have permission to access this resources!"
        );
      }

      next();
    } catch (error) {
      sendResponse(res, 400, false, "something went wrong!", error);
    }
  };
};
