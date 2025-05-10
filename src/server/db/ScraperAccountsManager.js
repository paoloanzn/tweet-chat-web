import IDatabase from "./db.js";

class ScraperAccountsManager extends IDatabase {
  /**
   * Gets a scraper account by username.
   *
   * @param {string} username - The account's username
   * @returns {Promise<{ data: Array, error: any }>}
   */
  async getAccountByUsername(username) {
    const sql = await this.loadQuery("get_scraper_account_by_username.sql");
    if (!sql) {
      throw new Error(
        "Query not authorized or not found: get_scraper_account_by_username.sql",
      );
    }
    return this.query(sql, [username]);
  }

  /**
   * Adds a new scraper account.
   *
   * @param {object} account - The account data
   * @param {string} account.username - Twitter username
   * @param {string} account.email - Account email
   * @param {string} account.password - Account password
   * @param {object} [account.cookies] - Optional cookies data
   * @returns {Promise<{ data: Array, error: any }>}
   */
  async addAccount(account) {
    const sql = await this.loadQuery("add_scraper_account.sql");
    if (!sql) {
      throw new Error(
        "Query not authorized or not found: add_scraper_account.sql",
      );
    }
    return this.query(sql, [
      account.username,
      account.email,
      account.password,
      account.cookies ? JSON.stringify(account.cookies) : null,
    ]);
  }
}

export default ScraperAccountsManager; 