import Fastify from "fastify";
import cors from "@fastify/cors";
import healthRoute from "./routes/health.js";
import logger from "./lib/logger.js";
import authRoute from "./routes/auth.js";
import personaRoute from "./routes/chat/persona.js";
import conversationRoute from "./routes/chat/conversation.js";
import process from "node:process";
import { setupServer } from "./setup.js";
import { getScraper } from "./lib/scraper/scraper.js";
import { login } from "./lib/scraper/login.js";
import chatRoute from "./routes/chat/chat.js";

const serverConfig = {
  port: 3000,
  host: "0.0.0.0",
};

const allowedOrigins = Object.freeze([
  "localhost",
  "127.0.0.1",
  "tweet-chat-web.vercel.app",
]);

const corsOriginPolicy = (origin, cb) => {
  // When running tests origin headers is undefined
  if (process.env.NODE_ENV === "development" && !origin) {
    cb(null, true);
    return;
  }

  const hostname = new URL(origin).hostname;
  if (allowedOrigins.includes(hostname)) {
    cb(null, true);
    return;
  }

  cb(new Error("Not allowed"), false);
};

const start = async () => {
  // Basic server setup routines
  await setupServer();
  const scraper = getScraper();
  const { success, error } = await login(scraper);
  if (!success) {
    logger.error(error);
    process.exit(1);
  }

  const fastify = Fastify({ logger: false });
  await fastify.register(cors, {
    origin: corsOriginPolicy,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });

  // Register routes
  healthRoute.register(fastify);
  authRoute.register(fastify);
  personaRoute.register(fastify);
  conversationRoute.register(fastify);
  chatRoute.register(fastify);

  try {
    await fastify.listen({ port: serverConfig.port, host: serverConfig.host });
    logger.info(
      `Server running on ${JSON.stringify(fastify.server.address())}`,
    );
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

start();
