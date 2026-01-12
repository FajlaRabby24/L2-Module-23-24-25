import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { config } from "../config";
import { Status, UserRoles } from "../constant";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [config.app_url],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: UserRoles.USER,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: Status.ACTIVE,
        required: false,
      },
    },
  },
  // social login
  socialProviders: {
    google: {
      prompt: "select_account consent", // ? if i turn on refresh token
      accessType: "offline", // ? if i turn on refresh token
      clientId: config.google_client_id as string,
      clientSecret: config.google_client_secret as string,
    },
  },
});
