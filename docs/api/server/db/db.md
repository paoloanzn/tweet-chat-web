# db.js

Source: `src/server/db/db.js`

## Classes

<dl>
<dt><a href="#Database">Database</a></dt>
<dd></dd>
<dt><a href="#IDatabase">IDatabase</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#close">close()</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Closes the database connection pool.</p>
</dd>
<dt><a href="#loadQuery">loadQuery(fileName)</a> ⇒ <code>Promise.&lt;(string|undefined)&gt;</code></dt>
<dd><p>Loads a SQL query from a file.</p>
<p>In non-development environments, if the query fileName is not in the list of
authorized queries, it will not be loaded.</p>
</dd>
</dl>

<a name="Database"></a>

## Database

**Kind**: global class  
<a name="new_Database_new"></a>

### new Database()

Class representing a database connection manager.

This class encapsulates the creation and management of a connection pool,
executing queries against a database, and reading SQL query files.
It supports conditional query loading based on the NODE_ENV, ensuring only
authorized queries are executed in production environments.

<a name="IDatabase"></a>

## IDatabase

**Kind**: global class

- [IDatabase](#IDatabase)
  - [new IDatabase()](#new_IDatabase_new)
  - [.query(sql, [params])](#IDatabase+query) ⇒ <code>Promise.&lt;{data: Array, error: null}&gt;</code>

<a name="new_IDatabase_new"></a>

### new IDatabase()

Creates an instance of Database.

Initializes the connection pool using the DATABASE_URL environment variable.
In non-development environments, restricts query execution to authorized queries.

<a name="IDatabase+query"></a>

### iDatabase.query(sql, [params]) ⇒ <code>Promise.&lt;{data: Array, error: null}&gt;</code>

Executes a SQL query using a pooled client.

This is a private method that retrieves a client from the pool,
executes the given SQL statement with optional parameters,
and returns the result rows.

**Kind**: instance method of [<code>IDatabase</code>](#IDatabase)  
**Returns**: <code>Promise.&lt;{data: Array, error: null}&gt;</code> - Result object containing the query data.  
**Throws**:

- Will throw an error if the query execution fails.

| Param    | Type                | Default         | Description                               |
| -------- | ------------------- | --------------- | ----------------------------------------- |
| sql      | <code>string</code> |                 | The SQL query to execute.                 |
| [params] | <code>Array</code>  | <code>[]</code> | An array of parameters for the SQL query. |

<a name="close"></a>

## close() ⇒ <code>Promise.&lt;void&gt;</code>

Closes the database connection pool.

**Kind**: global function  
<a name="loadQuery"></a>

## loadQuery(fileName) ⇒ <code>Promise.&lt;(string\|undefined)&gt;</code>

Loads a SQL query from a file.

In non-development environments, if the query fileName is not in the list of
authorized queries, it will not be loaded.

**Kind**: global function  
**Returns**: <code>Promise.&lt;(string\|undefined)&gt;</code> - The content of the SQL file as a string or undefined if not authorized.

| Param    | Type                | Description                            |
| -------- | ------------------- | -------------------------------------- |
| fileName | <code>string</code> | The filename of the SQL query to load. |
