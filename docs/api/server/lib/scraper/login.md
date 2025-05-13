# login.js

Source: `src/server/lib/scraper/login.js`

## Functions

<dl>
<dt><a href="#login">login(scraper)</a> ⇒ <code><a href="#LoginResult">Promise.&lt;LoginResult&gt;</a></code></dt>
<dd><p>Performs login for the scraper instance by retrieving credentials from the database
and handling both cookie and password-based authentication.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#LoginResult">LoginResult</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="login"></a>

## login(scraper) ⇒ [<code>Promise.&lt;LoginResult&gt;</code>](#LoginResult)

Performs login for the scraper instance by retrieving credentials from the database
and handling both cookie and password-based authentication.

**Kind**: global function  
**Returns**: [<code>Promise.&lt;LoginResult&gt;</code>](#LoginResult) - The login result

| Param   | Type                 | Description                          |
| ------- | -------------------- | ------------------------------------ |
| scraper | <code>Scraper</code> | The scraper instance to authenticate |

<a name="LoginResult"></a>

## LoginResult : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name    | Type                                     | Description                            |
| ------- | ---------------------------------------- | -------------------------------------- |
| success | <code>boolean</code>                     | Whether the login was successful       |
| message | <code>string</code> \| <code>null</code> | Optional message describing the result |
