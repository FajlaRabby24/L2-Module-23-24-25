import { config } from "../config";
import { UserRoles } from "../constant";
import { prisma } from "../lib/prisma";

const seedAdmin = async () => {
  try {
    const adminData = {
      name: config.admin_name,
      email: config.admin_email,
      role: UserRoles.ADMIN,
      password: config.admin_password,
    };

    // check user exist on db or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists!!");
    }

    // sign up admin
    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );
  } catch (error) {
    console.log(error);
  }
};
