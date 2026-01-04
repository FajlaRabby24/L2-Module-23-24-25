import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import { config } from "../config";
import { Status, UserRoles } from "../constant";
import { verificationEmailTemplate } from "../utils/verificationEmailTemplate";
import { prisma } from "./prisma";

// --------------------------- nodemailer ---------------------------
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: config.app_user,
    pass: config.app_pass,
  },
});
// --------------------------- nodemailer ---------------------------

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // email and password
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
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
  // email verification
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      try {
        const verificationToken = `${config.app_url}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismablog@ph.com>',
          to: user.email,
          subject: "Please verify your email!",
          html: verificationEmailTemplate(user.name, verificationToken),
        });

        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  trustedOrigins: [config.app_url!],
  // additional fields add by own
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
        required: false,
        defaultValue: Status.ACTIVE,
      },
    },
  },
});
