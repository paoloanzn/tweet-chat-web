import logger from "../../lib/logger.js";
import { authMiddleware } from "../../lib/middleware.js";
import Route from "../route.js";
import ConversationManager from "../../db/ConversationManager.js";

const conversationRoute = new Route("/conversation");

const routes = [
  {
    method: "GET",
    url: "/list/:personaId",
    preHandler: (request, reply, done) => {
      authMiddleware(request, reply, done);
    },
    handler: async (request, reply) => {
      const { personaId } = request.params;
      if (!personaId) {
        reply.status(400).send({
          status: "error",
          message: "Missing personaId parameter.",
        });
        return;
      }

      const conversationManager = new ConversationManager();
      try {
        const userId = request.user.sub;
        console.log(userId);
        const { data, error } = await conversationManager.getConversations(
          userId,
          personaId,
        );
        if (error) {
          logger.error(`Error executing query: ${error}`);
          reply.status(500).send({
            status: "error",
            message: "Internal Server Error while fetching conversations.",
          });
          return;
        }
        reply.send({ status: "success", data });
      } catch (error) {
        logger.error(`Error while fetching conversations: ${error}`);
        reply.status(500).send({
          status: "error",
          message: "Internal Server Error while fetching conversations.",
        });
      } finally {
        await conversationManager.close();
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
      const { personaId, conversationData } = request.body;
      if (!personaId || !conversationData) {
        reply.status(400).send({
          status: "error",
          message: "Missing personaId or conversationData in request body.",
        });
        return;
      }

      const conversationManager = new ConversationManager();
      try {
        const userId = request.user.sub;
        const { data, error } = await conversationManager.addConversation(
          userId,
          personaId,
          conversationData,
        );
        if (error) {
          logger.error(`Error executing query: ${error}`);
          reply.status(500).send({
            status: "error",
            message: "Internal Server Error while adding new conversation.",
          });
          return;
        }
        reply.send({ status: "success", data });
      } catch (error) {
        logger.error(`Error while adding new conversation: ${error}`);
        reply.status(500).send({
          status: "error",
          message: "Internal Server Error while adding new conversation.",
        });
      } finally {
        await conversationManager.close();
      }
    },
  },
  {
    method: "PUT",
    url: "/update/:conversationId",
    preHandler: (request, reply, done) => {
      authMiddleware(request, reply, done);
    },
    handler: async (request, reply) => {
      const { conversationId } = request.params;
      const { conversationData } = request.body;
      if (!conversationId || !conversationData) {
        reply.status(400).send({
          status: "error",
          message: "Missing conversationId or conversationData.",
        });
        return;
      }

      const conversationManager = new ConversationManager();
      try {
        const { data, error } = await conversationManager.updateConversation(
          conversationId,
          conversationData,
        );
        if (error) {
          logger.error(`Error executing query: ${error}`);
          reply.status(500).send({
            status: "error",
            message: "Internal Server Error while updating conversation.",
          });
          return;
        }
        reply.send({ status: "success", data });
      } catch (error) {
        logger.error(`Error while updating conversation: ${error}`);
        reply.status(500).send({
          status: "error",
          message: "Internal Server Error while updating conversation.",
        });
      } finally {
        await conversationManager.close();
      }
    },
  },
  {
    method: "DELETE",
    url: "/:conversationId",
    preHandler: (request, reply, done) => {
      authMiddleware(request, reply, done);
    },
    handler: async (request, reply) => {
      const { conversationId } = request.params;
      if (!conversationId) {
        reply.status(400).send({
          status: "error",
          message: "Missing conversationId parameter.",
        });
        return;
      }

      const conversationManager = new ConversationManager();
      try {
        const { data, error } =
          await conversationManager.deleteConversation(conversationId);
        if (error) {
          logger.error(`Error executing query: ${error}`);
          reply.status(500).send({
            status: "error",
            message: "Internal Server Error while deleting conversation.",
          });
          return;
        }
        reply.send({ status: "success", data });
      } catch (error) {
        logger.error(`Error while deleting conversation: ${error}`);
        reply.status(500).send({
          status: "error",
          message: "Internal Server Error while deleting conversation.",
        });
      } finally {
        await conversationManager.close();
      }
    },
  },
];

conversationRoute.addRoutes(...routes);

export default conversationRoute;
