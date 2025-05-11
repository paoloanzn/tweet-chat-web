# create-persona.js

Source: `src/server/lib/persona/create-persona.js`

## Constants

<dl>
<dt><a href="#MAX_TWEETS_LIMIT">MAX_TWEETS_LIMIT</a></dt>
<dd><p>Maximum number of tweets that can be fetched</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#createPersona">createPersona(user, maxTweets, scraper)</a> ⇒ <code>Promise.&lt;{data: ({profile: Object, tweets: Array}|null), error: (string|null)}&gt;</code></dt>
<dd><p>Creates a persona by fetching a user&#39;s profile and tweets</p>
</dd>
</dl>

<a name="MAX_TWEETS_LIMIT"></a>

## MAX\_TWEETS\_LIMIT
Maximum number of tweets that can be fetched

**Kind**: global constant  
<a name="createPersona"></a>

## createPersona(user, maxTweets, scraper) ⇒ <code>Promise.&lt;{data: ({profile: Object, tweets: Array}\|null), error: (string\|null)}&gt;</code>
Creates a persona by fetching a user's profile and tweets

**Kind**: global function  
**Returns**: <code>Promise.&lt;{data: ({profile: Object, tweets: Array}\|null), error: (string\|null)}&gt;</code> - Persona data or error  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> | The username to fetch data for |
| maxTweets | <code>number</code> | Maximum number of tweets to fetch (capped at MAX_TWEETS_LIMIT) |
| scraper | <code>Object</code> | The scraper instance used to fetch data |
| scraper.isLoggedIn | <code>function</code> | Checks if scraper is logged in |
| scraper.getTweets | <code>function</code> | Gets tweets for a user |
| scraper.getProfile | <code>function</code> | Gets profile for a user |

