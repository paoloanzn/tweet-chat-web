import { createClient } from "@supabase/supabase-js";
import logger from "./logger.js";
import process from "node:process";

let supabaseClient = null;

/**
 * Returns a singleton Supabase client instance.
 *
 * The client is created using the SUPABASE_URL and SUPABASE_KEY environment variables.
 * If these variables are not set, the process exits with an error.
 *
 * @returns {SupabaseClient} A Supabase client instance.
 */
export const getSupabaseClient = () => {
  if (!supabaseClient) {
    // create a new client
    if (!process.env.SUPABASE_KEY || !process.env.SUPABASE_URL) {
      logger.error(`Missing required SUPABASE_KEY or SUPABASE_URL.`);
      process.exit(1);
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
};
