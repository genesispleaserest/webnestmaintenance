import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import xss from "xss-clean";
import { randomUUID } from "crypto";
import { config } from "./lib/config";
import { logger } from "./lib/logger";
import { prisma } from "./lib/prisma";
import { openapiSpec } from "./lib/openapi";
import { renderMaintenancePage } from "./lib/maintenance-page";
import { apiRouter } from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { healthController } from "./controllers/health-controller";

const app = express();

app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    genReqId: (req) => {
      const headerId = req.headers["x-request-id"];
      if (typeof headerId === "string" && headerId.length > 0) {
        return headerId;
      }
      return randomUUID();
    }
  })
);

app.use((req, res, next) => {
  res.setHeader("X-Request-Id", String(req.id));
  next();
});

app.use(helmet());
app.use(
  cors({
    origin: config.frontendOrigin,
    credentials: true
  })
);

app.use(express.json({ limit: config.bodyLimit }));
app.use(express.urlencoded({ extended: false, limit: config.bodyLimit }));
app.use(xss());

const generalLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitGeneralMax,
  standardHeaders: true,
  legacyHeaders: false
});

const publicLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitPublicMax,
  standardHeaders: true,
  legacyHeaders: false
});

app.get("/health", healthController);

if (config.maintenanceMode) {
  app.get(/^\/(?!health$).*/, (_req, res) => {
    res.status(503).type("html").set("Retry-After", "3600");
    res.send(renderMaintenancePage(config.maintenanceMessage));
  });
} else {
  app.use("/api", generalLimiter);
  app.use("/api/public", publicLimiter);

  app.use(
    session({
      name: config.sessionCookieName,
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: config.nodeEnv === "production" ? "none" : "lax",
        secure: config.nodeEnv === "production",
        maxAge: config.sessionTtlMs
      },
      store: new PrismaSessionStore(prisma, {
        checkPeriod: config.sessionCleanupMs,
        sessionModelName: "session"
      })
    })
  );

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
  app.use("/api", apiRouter);
}

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
export default app;
