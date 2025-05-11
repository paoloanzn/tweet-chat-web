/** Maximum number of tweets that can be fetched */
const MAX_TWEETS_LIMIT = 50;

/**
 * Creates a persona by fetching a user's profile and tweets
 * @param {string} user - The username to fetch data for
 * @param {number} maxTweets - Maximum number of tweets to fetch (capped at MAX_TWEETS_LIMIT)
 * @param {Object} scraper - The scraper instance used to fetch data
 * @param {Function} scraper.isLoggedIn - Checks if scraper is logged in
 * @param {Function} scraper.getTweets - Gets tweets for a user
 * @param {Function} scraper.getProfile - Gets profile for a user
 * @returns {Promise<{data: {profile: Object, tweets: Array}|null, error: string|null}>} Persona data or error
 */
export async function createPersona(user, maxTweets, scraper) {
  if (!(await scraper.isLoggedIn())) {
    return { data: null, error: "Scraper is not logged in." };
  }

  if (user === "" || user.length < 4) {
    return { data: null, error: "Invalid username." };
  }

  const tweetsIterator = scraper.getTweets(
    user,
    maxTweets <= MAX_TWEETS_LIMIT ? maxTweets : MAX_TWEETS_LIMIT,
  );

  const tweets = new Array(
    maxTweets <= MAX_TWEETS_LIMIT ? maxTweets : MAX_TWEETS_LIMIT,
  );

  for await (const tweet of tweetsIterator) {
    if (tweet) {
      tweets.push(tweet);
    }
  }

  if (tweets.length === 0) {
    return { data: null, error: "no tweets found." };
  }

  const profile = await scraper.getProfile(user);

  const persona = {
    profile,
    tweets,
  };

  return { data: persona, error: null };
}
