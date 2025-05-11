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

await setupServer();
const scraper = getScraper();
const { success } = await login(scraper);
console.log(success);

const fastify = Fastify({ logger: false });

await fastify.register(cors, {
  origin: "http://localhost:5173", // Allow requests specifically from your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow common methods
});

// Register routes
healthRoute.register(fastify);
authRoute.register(fastify);
personaRoute.register(fastify);
conversationRoute.register(fastify);
chatRoute.register(fastify);

// run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    fastify.log.info(`Server listening on ${fastify.server.address()}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
logger.info("Starting server...");
start();
