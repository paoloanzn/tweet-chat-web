import { afterAll, beforeAll } from "vitest";

async function isServerRunning() {
  try {
    const response = await fetch("http://localhost:3000/health/status");
    return response.ok;
  } catch {
    return false;
  }
}

async function isSupabaseRunning() {
  // We'll use the auth endpoint to check if Supabase is accessible
  try {
    const response = await fetch("http://localhost:3000/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@test.com",
        password: "wrong password",
      }),
    });
    // Even if auth fails, if we get a response, Supabase is running
    return response.status !== 500;
  } catch {
    return false;
  }
}

export async function setupTestPrerequisites() {
  let serverRunning = await isServerRunning();
  let supabaseRunning = await isSupabaseRunning();

  if (!serverRunning) {
    throw new Error(
      "Backend server is not running. Please start it with npm run dev:server",
    );
  }

  if (!supabaseRunning) {
    throw new Error(
      "Supabase is not running. Please start your local Supabase instance",
    );
  }
}

beforeAll(async () => {
  await setupTestPrerequisites();
});

afterAll(() => {
  // Cleanup if needed
});
