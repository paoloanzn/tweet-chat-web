import IDatabase from "./db.js";

class ConversationManager extends IDatabase {
  /**
   * Gets all conversations for a given user and persona.
   *
   * @param {string} userId - The user’s ID.
   * @param {string} personaId - The persona’s ID.
   * @returns {Promise<{ data: Array, error: any }>}
   */
  async getConversations(userId, personaId) {
    const sql = await this.loadQuery("get_conversations.sql");
    if (!sql) {
      throw new Error("Query not authorized or not found: get_conversations.sql");
    }
    return this.query(sql, [userId, personaId]);
  }

  /**
   * Inserts a new conversation.
   *
   * @param {string} userId - The user’s ID.
   * @param {string} personaId - The persona’s ID.
   * @param {object} conversationData - The conversation data as a JSON object.
   * @returns {Promise<{ data: Array, error: any }>}
   */
  async addConversation(userId, personaId, conversationData) {
    const sql = await this.loadQuery("insert_conversation.sql");
    if (!sql) {
      throw new Error("Query not authorized or not found: insert_conversation.sql");
    }
    return this.query(sql, [userId, personaId, JSON.stringify(conversationData)]);
  }

  /**
   * Updates an existing conversation.
   *
   * @param {string} conversationId - The conversation unique id.
   * @param {object} conversationData - The updated conversation data as a JSON object.
   * @returns {Promise<{ data: Array, error: any }>}
   */
  async updateConversation(conversationId, conversationData) {
    const sql = await this.loadQuery("update_conversation.sql");
    if (!sql) {
      throw new Error("Query not authorized or not found: update_conversation.sql");
    }
    return this.query(sql, [conversationId, JSON.stringify(conversationData)]);
  }

  /**
   * Deletes a conversation by its ID.
   *
   * @param {string} conversationId - The conversation unique id.
   * @returns {Promise<{ data: Array, error: any }>}
   */
  async deleteConversation(conversationId) {
    const sql = await this.loadQuery("delete_conversation.sql");
    if (!sql) {
      throw new Error("Query not authorized or not found: delete_conversation.sql");
    }
    return this.query(sql, [conversationId]);
  }
}

export default ConversationManager;