import {
  generateText,
  ModelProvider,
  ModelType,
} from "../../lib/ai/provider.js";
import logger from "../../lib/logger.js";
import { authMiddleware } from "../../lib/middleware.js";
import Route from "../route.js";
import { PassThrough } from "stream";
import PersonaManager from "../../db/PersonaManager.js";

const MAX_MESSAGE_LENGTH = 5 * 1000;

const personaRoute = new Route("/persona");

const routes = [
  {
    method: "POST",
    url: "/new/message/:conversationId",
    preHandler: (request, reply, done) => {
      authMiddleware(request, reply, done);
    },
    handler: async (request, reply) => {
      const { content } = request.body;
      if (!content) {
        reply.status(400).send({
          status: "error",
          message: "Missing content.",
        });
        return;
      }

      if (content > MAX_MESSAGE_LENGTH) {
        reply.status(400).send({
          status: "error",
          message: "Content exceeded max allowed character length.",
        });
        return;
      }

      // set SSE headers for streaming
      reply
        .header("Content-Type", "text/event-stream")
        .header("Cache-Control", "no-cache")
        .header("Connection", "keep-alive");

      const responseStream = new PassThrough();
      reply.send(responseStream);

      try {
        const { error } = await generateText(
          "Hi bro!",
          ModelProvider.OPENAI,
          (textPart) =>
            responseStream.write(
              `data: ${JSON.stringify({ text: textPart })}\n\n`,
            ),
          ModelType.MEDIUM,
        );

        if (error) {
          throw new Error(error);
        }
      } catch (error) {
        logger.error(`Error in generateText: ${error}`);
        if (!responseStream.writableEnded) {
          responseStream.write(
            `event: error\ndata: ${JSON.stringify({ message: "Internal Server Error." })}\n\n`,
          );
        }
      } finally {
        if (!responseStream.writableEnded) {
          responseStream.end();
        }
      }
    },
  },
  {
    method: "POST",
    url: "/add-new",
    preHandler: (request, reply, done) => {
      authMiddleware(request, reply, done);
    },
    handler: async (request, reply) => {
      const { twitterHandle } = request.body;
      if (!twitterHandle) {
        reply.status(400).send({
          status: "error",
          message: "Missing twitterHandle in request body.",
        });
        return;
      }
      const personaManager = new PersonaManager();
      try {
        const userId = request.user.sub;
        const { data, error } = await personaManager.addPersonaForUser(userId);
        if (error) {
          logger.error(`Error executing query: ${error}`);
          reply.status(500).send({
            status: "error",
            message: "Internal Server Error while adding new Persona."
          })
          return;
        }
        reply.send({ status: "success", data });
      } catch (error) {
        logger.error(`Error while adding new persona: ${error}`);
        reply.status(500).send({
          status: "error",
          message: "Internal Server Error while adding new Persona.",
        });
      } finally {
        await personaManager.close();
      }
    },
  },
];

personaRoute.addRoutes(...routes);

export default personaRoute;
