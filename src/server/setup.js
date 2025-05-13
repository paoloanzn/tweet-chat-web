import * as dotenv from "dotenv";
import path from "path";
import process from "node:process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs/promises";
import { parse } from "csv-parse/sync";
import ScraperAccountsManager from "./db/ScraperAccountsManager.js";
import logger from "./lib/logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Loads environment variables from a .env file and sets up development-specific variables.
 *
 * This function configures the environment variables using dotenv by loading them from a file located
 * two directories up from the current file. If the NODE_ENV variable is set to 'development', it iterates
 * over all environment variables and for each key starting with 'DEV_', it creates a new variable without
 * the 'DEV_' prefix.
 *
 * @function loadEnv
 */
export function loadEnv() {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });

  if (process.env.NODE_ENV === "development") {
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("DEV_")) {
        const nonDevKey = key.replace(/^DEV_/, "");
        process.env[nonDevKey] = process.env[key];
      }
    });
  }
}

/**
 * Loads scraper accounts from CSV file into the database.
 */
async function loadScraperAccounts() {
  try {
    const csvPath = path.resolve(__dirname, "lib/scraper/accounts.csv");
    const fileContent = await fs.readFile(csvPath, "utf-8");

    // Parse CSV content
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    const accountManager = new ScraperAccountsManager();

    for (const record of records) {
      const result = await accountManager.addAccount({
        username: record.username,
        email: record.email,
        password: record.password,
        cookies: null, // Initially no cookies
      });

      if (result.error) {
        logger.error(
          `Failed to add scraper account ${record.username}: ${result.error}`,
        );
      } else {
        logger.info(
          `Successfully processed scraper account: ${record.username}`,
        );
      }
    }

    await accountManager.close();
  } catch (error) {
    logger.error("Error loading scraper accounts:", error);
    process.exit(1);
  }
}

/**
 * Main setup function that runs all initialization steps
 */
export async function setupServer() {
  // Load environment variables first
  loadEnv();

  // Load scraper accounts into database
  await loadScraperAccounts();

  // Add any future setup steps here
}
