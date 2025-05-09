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
   * Adds a new persona for a user.
   *
   * Note: The logic for actually adding a new persona is left blank.
   * Instead, sample empty data is inserted.
   *
   * @param {string} userId - The user's ID.
   * @returns {Promise<{ data: Array, error: any }>}
   */
  async addPersonaForUser(userId) {
    // TODO: Implement the actual logic for adding a new persona.
    console.log(
      "addPersonaForUser: Not fully implemented. Inserting sample data.",
    );
    const sql = await this.loadQuery("upsert_user_persona.sql");
    if (!sql) {
      throw new Error(
        "Query not authorized or not found: upsert_user_persona.sql",
      );
    }
    // Sample static values for a new persona.
    const sampleName = "elonmusk";
    const sampleData = JSON.stringify({}); // Empty sample data
    return this.query(sql, [sampleName, sampleData, userId]);
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
}

export default PersonaManager;
