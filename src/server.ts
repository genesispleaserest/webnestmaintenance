import { app } from "./app";
import { config } from "./lib/config";
import { logger } from "./lib/logger";
import { prisma } from "./lib/prisma";

const server = app.listen(config.port, () => {
  logger.info({ port: config.port }, "WebNest API listening");
});

const shutdown = () => {
  server.close(() => {
    prisma
      .$disconnect()
      .catch((error) => logger.error({ error }, "Error disconnecting Prisma"))
      .finally(() => process.exit(0));
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
