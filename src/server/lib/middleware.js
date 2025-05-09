import jwt from "jsonwebtoken";
import logger from "./logger.js";
import process from "node:process";

/**
 * Middleware for authenticating requests using JWT.
 *
 * This middleware checks for a valid Bearer token in the Authorization header,
 * verifies the token using the JWT_SECRET environment variable, and attaches the decoded
 * token payload to the request object. If the token is missing or invalid, it sends a
 * 401 response. In case of errors during verification, it sends a 500 response.
 *
 * @param {object} request - The incoming request object.
 * @param {object} reply - The reply/response object.
 */
export function authMiddleware(request, reply, done) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    reply.status(401).send({
      status: "error",
      message: "Missing or invalid auth header.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error(
        "Missing JWT secret key. Make sure its added to set JWT_SECRET env variable.",
      );
    }
    const supabaseUrl = process.env.SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error(
        "Missing supabase url. Make sure its added to set SUPABASE_URL env variable.",
      );
    }

    const decoded = jwt.verify(token, secret, {
      audience: "authenticated",
      algorithms: ["HS256"],
    });

    logger.info(`Successfully verified user request.`);
    request.user = decoded;
    done();
  } catch (error) {
    logger.error(`Error while verifying authentication: ${error}`);
    reply.status(500).send({
      status: "error",
      message: "Internal Server Error while authenticating.",
    });
    return;
  }
}
