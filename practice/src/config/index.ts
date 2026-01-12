import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  admin_name: process.env.ADMIN_NAME,
  admin_email: process.env.ADMIN_EMAIL || "",
  admin_password: process.env.ADMIN_PASSWORD,
  database_url: process.env.DATABASE_URL,
  port: process.env.PORT || 3000,
  app_url: process.env.APP_URL || "http://localhost:4000",
  better_auth_secret: process.env.BETTER_AUTH_SECRET,
  better_auth_url: process.env.BETTER_AUTH_URL,
  app_user: process.env.APP_USER,
  app_pass: process.env.APP_PASS,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
};
