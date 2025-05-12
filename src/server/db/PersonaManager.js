import { createPersona } from "../lib/persona/create-persona.js";
import { getScraper } from "../lib/scraper/scraper.js";
import IDatabase from "./db.js";

class PersonaManager extends IDatabase {
  /**
   * Gets all personas associated with a specific user.
   *
   * @param {string} userId - The user's ID.
   * @returns {Promise<{ data: Array, error: any }>}
   */
  async getUserPersonas(userId) {
    const sql = await this.loadQuery("get_user_personas.sql");
    if (!sql) {
      throw new Error(
        "Query not authorized or not found: get_user_personas.sql",
      );
    }
    return this.query(sql, [userId]);
  }

  /**
   * Adds a new persona for a user by scraping their data and storing it in the database.
   *
   * @param {string} userId - The user's ID.
   * @param {object} options - Configuration options
   * @param {string} options.user - Username to scrape data from
   * @param {number} options.maxTweets - Maximum number of tweets to analyze
   * @returns {Promise<{ data: Array, error: any }>} - Returns the created persona data or error
   * @throws {Error} If the SQL query is not found or if there's an error creating the persona
   */
  async addPersonaForUser(userId, options) {
    const sql = await this.loadQuery("upsert_user_persona.sql");
    if (!sql) {
      throw new Error(
        "Query not authorized or not found: upsert_user_persona.sql",
      );
    }
    const { user, maxTweets } = options;
    const { data, error } = await createPersona(user, maxTweets, getScraper());
    if (error) {
      throw new Error(`Error while creating persona: ${error}`);
    }
    return this.query(sql, [user, JSON.stringify(data), userId]);
  }

  /**
   * Deletes a specific persona for a user.
   *
   * @param {string} userId - The user's ID.
   * @param {string} personaId - The persona's ID.
   * @returns {Promise<{ data: Array, error: any }>}
   */
  async deletePersonaForUser(userId, personaId) {
    const sql = await this.loadQuery("delete_user_persona.sql");
    if (!sql) {
      throw new Error(
        "Query not authorized or not found: delete_user_persona.sql",
      );
    }
    return this.query(sql, [userId, personaId]);
  }

  /**
   * Gets a specific persona by its ID.
   *
   * @param {string} personaId - The persona's ID.
   * @returns {Promise<{ data: Array, error: any }>}
   */
  async getPersonaById(personaId) {
    const sql = await this.loadQuery("get_persona_by_id.sql");
    if (!sql) {
      throw new Error(
        "Query not authorized or not found: get_persona_by_id.sql",
      );
    }
    return this.query(sql, [personaId]);
  }
}

export default PersonaManager;
