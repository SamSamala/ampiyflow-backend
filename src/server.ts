import app from "./app";
import { ENV } from "./config/env";
import { prisma } from "./lib/prisma";

async function start() {
  await prisma.$connect();
  console.log("Database connected");

  app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
  });
}

start();