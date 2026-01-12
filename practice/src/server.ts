import app from "./app";
import { config } from "./config";
import { prisma } from "./lib/prisma";

const PORT = config.port;

const main = async () => {
  try {
    await prisma.$connect();
    console.log("✅ connected to database successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("An error occured", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();
