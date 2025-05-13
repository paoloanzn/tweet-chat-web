import logger from "../../lib/logger.js";
import { authMiddleware } from "../../lib/middleware.js";
import Route from "../route.js";
import PersonaManager from "../../db/PersonaManager.js";

const MAX_MESSAGE_LENGTH = 5 * 1000;
const MAX_TWEETS = 10;

const personaRoute = new Route("/persona");

const routes = [
  {
    method: "POST",
    url: "/add-new",
    preHandler: (request, reply, done) => {
      authMiddleware(request, reply, done);
    },
    handler: async (request, reply) => {
      const { user } = request.body;
      if (!user) {
        reply.status(400).send({
          status: "error",
          message: "Missing user or maxTweets in request body.",
        });
        return;
      }

      const personaManager = new PersonaManager();
      try {
        const userId = request.user.sub;
        const { data, error } = await personaManager.addPersonaForUser(userId, {
          user,
          maxTweets: MAX_TWEETS,
        });
        if (error) {
          logger.error(`Error executing query: ${error}`);
          reply.status(500).send({
            status: "error",
            message: "Internal Server Error while adding new Persona.",
          });
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
  {
    method: "GET",
    url: "/list",
    preHandler: (request, reply, done) => {
      authMiddleware(request, reply, done);
    },
    handler: async (request, reply) => {
      const personaManager = new PersonaManager();
      try {
        const userId = request.user.sub;
        const { data, error } = await personaManager.getUserPersonas(userId);
        if (error) {
          logger.error(`Error executing query: ${error}`);
          reply.status(500).send({
            status: "error",
            message: "Internal Server Error while fetching personas.",
          });
          return;
        }
        reply.send({ status: "success", data });
      } catch (error) {
        logger.error(`Error while fetching personas: ${error}`);
        reply.status(500).send({
          status: "error",
          message: "Internal Server Error while fetching personas.",
        });
      } finally {
        await personaManager.close();
      }
    },
  },
  {
    method: "POST",
    url: "/delete",
    preHandler: (request, reply, done) => {
      authMiddleware(request, reply, done);
    },
    handler: async (request, reply) => {
      const { personaId } = request.body;
      if (!personaId) {
        reply.status(400).send({
          status: "error",
          message: "Missing personaId in request body.",
        });
        return;
      }
      const personaManager = new PersonaManager();
      try {
        const userId = request.user.sub;
        const { data, error } = await personaManager.deletePersonaForUser(
          userId,
          personaId,
        );
        if (error) {
          logger.error(`Error executing query: ${error}`);
          reply.status(500).send({
            status: "error",
            message: "Internal Server Error while deleting persona.",
          });
          return;
        }
        reply.send({ status: "success", data });
      } catch (error) {
        logger.error(`Error while deleting persona: ${error}`);
        reply.status(500).send({
          status: "error",
          message: "Internal Server Error while deleting persona.",
        });
      } finally {
        await personaManager.close();
      }
    },
  },
];

personaRoute.addRoutes(...routes);

export default personaRoute;
