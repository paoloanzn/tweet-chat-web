import { describe, it, expect, beforeAll } from "vitest";
import { setupTestPrerequisites } from "./setup";

describe("Persona Endpoints", () => {
  let authToken;

  beforeAll(async () => {
    await setupTestPrerequisites();

    // Create and login a test user to get auth token
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = "TestPassword123!";

    await fetch("http://localhost:3000/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

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
  });

  describe("POST /persona/add-new", () => {
    it("should add a new persona", async () => {
      const response = await fetch("http://localhost:3000/persona/add-new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          user: "apollonator3000",
          maxTweets: 20,
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.status).toBe("success");
      expect(data.data).toBeDefined();
      expect(data.data[0]).toBeDefined();
      expect(data.data[0].persona_id).toBeDefined();
    });

    it("should fail with invalid parameters", async () => {
      const response = await fetch("http://localhost:3000/persona/add-new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          user: "", // Invalid user
          maxTweets: "not a number", // Invalid maxTweets type
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /persona/list", () => {
    it("should list user personas", async () => {
      const response = await fetch("http://localhost:3000/persona/list", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.status).toBe("success");
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  describe("POST /persona/delete", () => {
    it("should delete a persona", async () => {
      // First create a persona
      const createResponse = await fetch(
        "http://localhost:3000/persona/add-new",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            user: "elonmusk",
            maxTweets: 5,
          }),
        },
      );

      const createData = await createResponse.json();
      const personaId = createData.data[0]["persona_id"];

      // Then delete it
      const deleteResponse = await fetch(
        "http://localhost:3000/persona/delete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            personaId,
          }),
        },
      );

      const deleteData = await deleteResponse.json();
      expect(deleteResponse.status).toBe(200);
      expect(deleteData.status).toBe("success");
    });
  });
});
