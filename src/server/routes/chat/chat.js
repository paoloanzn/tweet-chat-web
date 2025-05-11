import {
  generateText,
  ModelProvider,
  ModelType,
} from "../../lib/ai/provider.js";
import logger from "../../lib/logger.js";
import { authMiddleware } from "../../lib/middleware.js";
import Route from "../route.js";
import { PassThrough } from "stream";
import ConversationManager from "../../db/ConversationManager.js";
import { compileTemplate } from "../../lib/ai/template.js";
import { chatTemplate } from "../../lib/persona/prompt-templates.js";
import { isValidMessage } from "../../lib/chat/message.js";

const chatRoute = new Route("/chat");

// Maximum number of messages to keep in history
const MAX_MESSAGE_HISTORY = 20;
// Maximum length for a single message
const MAX_MESSAGE_LENGTH = 5 * 1000;

/**
 * Formats a timestamp into a human readable date string
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Formatted date string
 */
function formatTimestamp(timestamp) {
  return new Date(timestamp * 1000).toISOString();
}

/**
 * Formats an array of messages into a readable conversation format
 * @param {Array<Message>} messages - Array of message objects
 * @returns {string} Formatted conversation string
 */
function formatConversation(messages) {
  return messages
    .map(
      (msg) =>
        `[${formatTimestamp(msg.timestamp)}](${msg.role}) ${msg.message}`,
    )
    .join("\n");
}

const routes = [
  {
    method: "POST",
    url: "/new-message/:conversationId",
    preHandler: (request, reply, done) => {
      authMiddleware(request, reply, done);
    },
    handler: async (request, reply) => {
      const { conversationId } = request.params;
      const { content } = request.body;

      if (!content) {
        reply.status(400).send({
          status: "error",
          message: "Missing content.",
        });
        return;
      }

      if (content.length > MAX_MESSAGE_LENGTH) {
        reply.status(400).send({
          status: "error",
          message: "Content exceeded max allowed character length.",
        });
        return;
      }

      // Set SSE headers for streaming
      reply
        .header("Content-Type", "text/event-stream")
        .header("Cache-Control", "no-cache")
        .header("Connection", "keep-alive");

      const responseStream = new PassThrough();
      reply.send(responseStream);

      const conversationManager = new ConversationManager();
      try {
        const userId = request.user.sub;
        // Get current conversation and verify ownership
        const { data: conversationData, error: getError } =
          await conversationManager.getConversation(conversationId, userId);

        if (getError) {
          throw new Error(`Error fetching conversation: ${getError}`);
        }

        if (!conversationData || conversationData.length === 0) {
          reply.status(403);
          throw new Error(`Conversation not found or access denied.`);
        }

        const conversation = conversationData[0];

        // Add user message to messages array
        const userMessage = {
          role: "user",
          message: content,
          timestamp: Math.floor(Date.now() / 1000),
        };

        // Initialize or update messages array
        const messages = conversation.conversation.messages || [];
        messages.push(userMessage);

        // Compile template with persona and formatted conversation
        const { template, error: templateError } = compileTemplate(
          chatTemplate,
          {
            persona: JSON.stringify(conversation.conversation.persona),
            conversation: formatConversation(messages),
          },
        );

        if (templateError) {
          throw new Error(`Error compiling template: ${templateError}`);
        }

        let aiResponse = "";
        const { error: generateError } = await generateText(
          template(),
          ModelProvider.OPENAI,
          (textPart) => {
            aiResponse += textPart;
            responseStream.write(
              `data: ${JSON.stringify({ text: textPart })}\n\n`,
            );
          },
          ModelType.MEDIUM,
        );

        if (generateError) {
          throw new Error(generateError);
        }

        // Add AI response to messages
        const aiMessage = {
          role: "persona",
          message: aiResponse.trim(),
          timestamp: Math.floor(Date.now() / 1000),
        };

        messages.push(aiMessage);

        // Keep only the last MAX_MESSAGE_HISTORY messages
        const updatedMessages = messages.slice(-MAX_MESSAGE_HISTORY);

        // Update conversation with new messages
        const updatedConversation = {
          ...conversation.conversation,
          messages: updatedMessages,
        };

        const { error: updateError } =
          await conversationManager.updateConversation(
            conversationId,
            updatedConversation,
          );

        if (updateError) {
          throw new Error(`Error updating conversation: ${updateError}`);
        }
      } catch (error) {
        logger.error(`Error in chat message generation: ${error}`);
        if (!responseStream.writableEnded) {
          reply.status(500);
          let message = "Internal Server Error.";
          // handle special case: forbidden access
          if (error.message === "Conversation not found or access denied.") {
            reply.status(403);
            message = "Conversation not found or access denied.";
          }
          responseStream.write(
            `event: error\ndata: ${JSON.stringify({
              message: message,
            })}\n\n`,
          );
        }
      } finally {
        if (!responseStream.writableEnded) {
          responseStream.end();
        }
        await conversationManager.close();
      }
    },
  },
];

chatRoute.addRoutes(...routes);

export default chatRoute;
