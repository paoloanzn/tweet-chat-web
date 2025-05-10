import ScraperAccountsManager from "../../db/ScraperAccountsManager.js";

/**
 * @typedef {Object} LoginResult
 * @property {boolean} success - Whether the login was successful
 * @property {string|null} message - Optional message describing the result
 */

/**
 * Performs login for the scraper instance by retrieving credentials from the database
 * and handling both cookie and password-based authentication.
 * 
 * @param {import('./scraper.js').Scraper} scraper - The scraper instance to authenticate
 * @returns {Promise<LoginResult>} The login result
 */
export async function login(scraper) {
  if (await scraper.isLoggedIn()) {
    return { success: true, message: "Already logged in." };
  }

  // Create accounts manager instance
  const accountsManager = new ScraperAccountsManager();

  // Get the first available account from the database
  const { data: accounts, error } = await accountsManager.getAccounts();
  if (error) {
    return { success: false, message: `Database error: ${error.message}` };
  }
  if (!accounts || accounts.length === 0) {
    return { success: false, message: "No scraper accounts found in database" };
  }

  const account = accounts[0];
  const authMethod = account.cookies ? "cookies" : "password";

  switch (authMethod) {
    case "cookies": {
      if (!account.cookies) {
        return { success: false, message: "Cookies cannot be null" };
      }

      // Parse and format cookies for the scraper
      const parsedCookies = JSON.parse(account.cookies).map(
        (cookie) => `${cookie.key}=${cookie.value}; domain=.twitter.com; path=/`
      );

      await scraper.setCookies(parsedCookies);
      const isLoggedIn = await scraper.isLoggedIn();

      return {
        success: isLoggedIn ?? false,
        message: isLoggedIn ? null : "Failed to log in with cookies",
      };
    }

    case "password": {
      try {
        await scraper.login(account.username, account.password, account.email);
        const isLoggedIn = await scraper.isLoggedIn();

        if (isLoggedIn) {
          // Get and save cookies for future sessions
          const cookies = await scraper.getCookies();
          await accountsManager.updateAccountCookies(account.username, cookies);
        }

        return {
          success: isLoggedIn ?? false,
          message: isLoggedIn ? null : "Failed to log in with username and password",
        };
      } catch (error) {
        return { success: false, message: error.toString() };
      }
    }

    default:
      return { success: false, message: "Invalid login method." };
  }
}
