import Fastify from "fastify";
import cors from "@fastify/cors";
import healthRoute from "./routes/health.js";
import logger from "./lib/logger.js";
import authRoute from "./routes/auth.js";
import personaRoute from "./routes/chat/persona.js";
import process from "node:process";
import { loadEnv } from "./setup.js";

loadEnv(); // Ensure every env variable is correctly loaded.
console.log(process.env);

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: "http://localhost:5173", // Allow requests specifically from your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow common methods
});

// Register routes
healthRoute.register(fastify);
authRoute.register(fastify);
personaRoute.register(fastify);

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
