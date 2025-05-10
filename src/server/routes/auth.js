import logger from "../lib/logger.js";
import { getSupabaseClient } from "../lib/supabase.js";
import Route from "./route.js";

const authRoute = new Route("/auth");

const routes = [
  {
    method: "POST",
    url: "/sign-up",
    handler: async (request, reply) => {
      const supabaseClient = getSupabaseClient();
      const { email, password } = request.body;
      if ((!email, !password)) {
        reply.status(400).send({
          status: "error",
          message: "Provided credentials are invalid.",
        });
        return;
      }
      try {
        const { _data, error } = await supabaseClient.auth.signUp({
          email,
          password,
        });
        if (error) {
          throw new Error(error);
        }

        logger.info(`Successfully registered new user: ${email}`);
        reply.status(200).send({
          status: "success",
          message: "Sign-up was successful.",
        });
        return;
      } catch (error) {
        logger.error(`Error during sign-up: ${error}`);
        reply.status(500).send({
          status: "error",
          message: `Internal Server Error during sing-up.`,
        });
      }
    },
  },
  {
    method: "POST",
    url: "/sign-in",
    handler: async (request, reply) => {
      const supabaseClient = getSupabaseClient();
      const { email, password } = request.body;
      if ((!email, !password)) {
        reply.status(400).send({
          status: "error",
          message: "Provided credentials are invalid.",
        });
        return;
      }
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          reply.status(400).send({
            status: "error",
            message: error,
          });
          return;
        }

        logger.log(`User ${email} logged in.`);
        return data.session;
      } catch (error) {
        logger.error(`Error during sign-in: ${error}`);
        reply.status(500).send({
          status: "error",
          message: "Internal Server Error during login.",
        });
      }
    },
  },
];

authRoute.addRoutes(...routes);

export default authRoute;
