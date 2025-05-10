import { Pool } from "pg";
import path from "path";
import fs from "fs/promises";
import process from "node:process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Class representing a database connection manager.
 *
 * This class encapsulates the creation and management of a connection pool,
 * executing queries against a database, and reading SQL query files.
 * It supports conditional query loading based on the NODE_ENV, ensuring only
 * authorized queries are executed in production environments.
 *
 * @class Database
 */
class IDatabase {
  /**
   * Creates an instance of Database.
   *
   * Initializes the connection pool using the DATABASE_URL environment variable.
   * In non-development environments, restricts query execution to authorized queries.
   *
   * @constructor
   */
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DB_URL,
      ssl: false, // Required for Supabase
    });

    // In prod allows only specified queries to run
    if (process.env.NODE_ENV != "development") {
      this.AUTHORIZED_QUERIES = Object.freeze({
        queries: [
          // queries filenames here
        ],
      });
    }
  }

  /**
   * Executes a SQL query using a pooled client.
   *
   * This is a private method that retrieves a client from the pool,
   * executes the given SQL statement with optional parameters,
   * and returns the result rows.
   *
   * @async
   * @param {string} sql - The SQL query to execute.
   * @param {Array} [params=[]] - An array of parameters for the SQL query.
   * @returns {Promise<{ data: Array, error: null }>} Result object containing the query data.
   * @throws Will throw an error if the query execution fails.
   */
  async query(sql, params = []) {
    let client = null;
    try {
      client = await this.pool.connect();
      const result = await client.query(sql, params);
      return { data: result.rows, error: null };
    } catch (error) {
      return { data: null, error: error };
    } finally {
      if (client) client.release();
    }
  }

  /**
   * Closes the database connection pool.
   *
   * @async
   * @function close
   * @returns {Promise<void>}
   */
  async close() {
    await this.pool.end();
  }

  /**
   * Loads a SQL query from a file.
   *
   * In non-development environments, if the query fileName is not in the list of
   * authorized queries, it will not be loaded.
   *
   * @async
   * @function loadQuery
   * @param {string} fileName - The filename of the SQL query to load.
   * @returns {Promise<string|undefined>} The content of the SQL file as a string or undefined if not authorized.
   */
  async loadQuery(fileName) {
    if (
      process.env.NODE_ENV != "development" &&
      this.AUTHORIZED_QUERIES &&
      !this.AUTHORIZED_QUERIES.queries.includes(fileName)
    ) {
      return;
    }
    const filePath = path.join(__dirname, "queries", fileName);
    return await fs.readFile(filePath, "utf8");
  }
}

export default IDatabase;
