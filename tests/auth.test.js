import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setupTestPrerequisites } from "./setup";

describe("Auth Endpoints", () => {
  beforeAll(async () => {
    await setupTestPrerequisites();
  });

  describe("POST /auth/sign-up", () => {
    it("should create a new user successfully", async () => {
      const response = await fetch("http://localhost:3000/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: `test${Date.now()}@example.com`,
          password: "TestPassword123!",
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.status).toBe("success");
    });

    it("should fail with invalid credentials", async () => {
      const response = await fetch("http://localhost:3000/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "",
          password: "",
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /auth/sign-in", () => {
    it("should authenticate valid credentials", async () => {
      // First create a test user
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

      // Then try to sign in
      const response = await fetch("http://localhost:3000/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });

      expect(response.status).toBe(200);
    });
  });
});
