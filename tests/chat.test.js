import { describe, it, expect, beforeAll } from "vitest";
import { setupTestPrerequisites } from "./setup";

describe("Chat Endpoints", () => {
  let authToken;
  let personaId;
  let conversationId;

  beforeAll(async () => {
    await setupTestPrerequisites();

    // Create and login a test user to get auth token
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = "TestPassword123!";

    // Sign up
    await fetch("http://localhost:3000/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    // Sign in
    const loginResponse = await fetch("http://localhost:3000/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    const session = await loginResponse.json();
    authToken = session.access_token;

    // Create a test persona
    const personaResponse = await fetch(
      "http://localhost:3000/persona/add-new",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          user: "apollonator3000",
          maxTweets: 20,
        }),
      },
    );

    const personaData = await personaResponse.json();
    personaId = personaData.data[0]["persona_id"];

    // Create a test conversation
    const conversationResponse = await fetch(
      "http://localhost:3000/conversation/add-new",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          personaId,
          conversationData: {
            title: "Test Chat Conversation",
            messages: [],
            persona: {
              name: "Test Persona",
              description: "A test persona for chat",
            },
          },
        }),
      },
    );

    const conversationData = await conversationResponse.json();
    conversationId = conversationData.data[0]["id"];
  });

  describe("POST /chat/new-message/:conversationId", () => {
    it("should handle missing content", async () => {
      const response = await fetch(
        `http://localhost:3000/chat/new-message/${conversationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({}), // Missing content
        },
      );

      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.status).toBe("error");
      expect(data.message).toBe("Missing content.");
    });

    it("should reject content exceeding max length", async () => {
      const longContent = "a".repeat(6000); // Exceeds MAX_MESSAGE_LENGTH (5000)

      const response = await fetch(
        `http://localhost:3000/chat/new-message/${conversationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ content: longContent }),
        },
      );

      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.status).toBe("error");
      expect(data.message).toBe(
        "Content exceeded max allowed character length.",
      );
    });

    it("should handle invalid conversation ID", async () => {
      const response = await fetch(
        `http://localhost:3000/chat/new-message/invalid-id`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ content: "Hello!" }),
        },
      );

      expect(response.status).toBe(500); // Should return 500 for invalid UUID
    });

    it("should successfully send a message and receive streaming response", async () => {
      const response = await fetch(
        `http://localhost:3000/chat/new-message/${conversationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ content: "Hello! How are you?" }),
        },
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("text/event-stream");

      // Test streaming response
      const reader = response.body.getReader();
      let receivedData = false;
      let errorOccurred = false;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const events = chunk.split("\n\n").filter(Boolean);

          for (const event of events) {
            if (event.startsWith("data: ")) {
              const data = JSON.parse(event.slice(6));
              if (data.text) {
                receivedData = true;
              }
            } else if (event.startsWith("event: error")) {
              errorOccurred = true;
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      expect(errorOccurred).toBe(false);
      expect(receivedData).toBe(true);

      // Verify conversation was updated with new messages
      const updatedConversation = await fetch(
        `http://localhost:3000/conversation/list/${personaId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      const conversationData = await updatedConversation.json();
      const targetConversation = conversationData.data.find(
        (conv) => conv.id === conversationId,
      );

      expect(targetConversation.conversation.messages).toBeDefined();
      expect(targetConversation.conversation.messages.length).toBe(2); // User message + AI response
      expect(targetConversation.conversation.messages[0].role).toBe("user");
      expect(targetConversation.conversation.messages[1].role).toBe("persona");
    });

    it("should maintain message history limit", async () => {
      // Send fewer messages to avoid timeout, but enough to test the limit
      // We'll send 12 messages which will result in 24 entries (12 user + 12 AI responses)
      // This should be enough to verify the MAX_MESSAGE_HISTORY (20) limit
      const messages = Array.from(
        { length: 12 },
        (_, i) => `Test message ${i}`,
      );

      // Set a longer timeout for this specific test
      // @vitest-environment-options {"testTimeout": 30000}

      for (const message of messages) {
        const response = await fetch(
          `http://localhost:3000/chat/new-message/${conversationId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ content: message }),
          },
        );

        // For each message, we need to consume the stream to completion
        const reader = response.body.getReader();
        try {
          while (true) {
            const { done } = await reader.read();
            if (done) break;
          }
        } finally {
          reader.releaseLock();
        }
      }

      // Check conversation messages
      const response = await fetch(
        `http://localhost:3000/conversation/list/${personaId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      const data = await response.json();
      const conversation = data.data.find((conv) => conv.id === conversationId);

      // Each message generates 2 entries (user + persona)
      // MAX_MESSAGE_HISTORY (20) should be enforced
      expect(conversation.conversation.messages.length).toBe(20);

      // Verify the messages are the most recent ones
      const lastUserMessage = conversation.conversation.messages.find(
        (msg) => msg.role === "user" && msg.message === "Test message 11",
      );
      expect(lastUserMessage).toBeDefined();
    });

    it("should deny access to conversation owned by different user", async () => {
      // Create a second test user
      const testEmail2 = `test2${Date.now()}@example.com`;
      const testPassword2 = "TestPassword123!";

      // Sign up second user
      await fetch("http://localhost:3000/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail2,
          password: testPassword2,
        }),
      });

      // Sign in second user
      const loginResponse = await fetch("http://localhost:3000/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail2,
          password: testPassword2,
        }),
      });

      const session = await loginResponse.json();
      const unauthorizedAuthToken = session.access_token;

      // Try to access first user's conversation with second user's token
      const response = await fetch(
        `http://localhost:3000/chat/new-message/${conversationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${unauthorizedAuthToken}`,
          },
          body: JSON.stringify({ content: "This should fail" }),
        },
      );

      expect(response.status).toBe(403);
    });
  });
});
