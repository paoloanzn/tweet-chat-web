# route.js

Source: `src/server/routes/route.js`

## Classes

<dl>
<dt><a href="#Route">Route</a></dt>
<dd></dd>
<dt><a href="#Route">Route</a></dt>
<dd></dd>
</dl>

<a name="Route"></a>

## Route

**Kind**: global class

- [Route](#Route)
  - [new Route()](#new_Route_new)
  - [new Route([rootUrl])](#new_Route_new)
  - [.addRoutes(...routes)](#Route+addRoutes)
  - [.getRoutes()](#Route+getRoutes) ⇒ <code>Array.&lt;Object&gt;</code>
  - [.register(fastify)](#Route+register)

<a name="new_Route_new"></a>

### new Route()

Class representing a collection of Fastify routes.

<a name="new_Route_new"></a>

### new Route([rootUrl])

Create a Route instance.

| Param     | Type                | Default                                  | Description                  |
| --------- | ------------------- | ---------------------------------------- | ---------------------------- |
| [rootUrl] | <code>string</code> | <code>&quot;\&quot;/\&quot;&quot;</code> | The root URL for all routes. |

<a name="Route+addRoutes"></a>

### route.addRoutes(...routes)

Add one or more routes.

**Kind**: instance method of [<code>Route</code>](#Route)

| Param                 | Type                  | Description                   |
| --------------------- | --------------------- | ----------------------------- |
| ...routes             | <code>Object</code>   | Route objects                 |
| routes[].method       | <code>string</code>   | HTTP method                   |
| routes[].url          | <code>string</code>   | Route URL path                |
| [routes[].preHandler] | <code>function</code> | Optional pre-handler function |
| routes[].handler      | <code>function</code> | Route handler function        |

<a name="Route+getRoutes"></a>

### route.getRoutes() ⇒ <code>Array.&lt;Object&gt;</code>

Return an array of Fastify route definitions.

**Kind**: instance method of [<code>Route</code>](#Route)  
**Returns**: <code>Array.&lt;Object&gt;</code> - The list of registered routes  
**Properties**

| Name    | Type                  | Description            |
| ------- | --------------------- | ---------------------- |
| method  | <code>string</code>   | HTTP method            |
| url     | <code>string</code>   | Route URL path         |
| handler | <code>function</code> | Route handler function |

<a name="Route+register"></a>

### route.register(fastify)

Register all routes with the Fastify instance.

**Kind**: instance method of [<code>Route</code>](#Route)

| Param   | Type                 | Description           |
| ------- | -------------------- | --------------------- |
| fastify | <code>Fastify</code> | The Fastify instance. |

<a name="Route"></a>

## Route

**Kind**: global class

- [Route](#Route)
  - [new Route()](#new_Route_new)
  - [new Route([rootUrl])](#new_Route_new)
  - [.addRoutes(...routes)](#Route+addRoutes)
  - [.getRoutes()](#Route+getRoutes) ⇒ <code>Array.&lt;Object&gt;</code>
  - [.register(fastify)](#Route+register)

<a name="new_Route_new"></a>

### new Route()

Class representing a collection of Fastify routes.

<a name="new_Route_new"></a>

### new Route([rootUrl])

Create a Route instance.

| Param     | Type                | Default                                  | Description                  |
| --------- | ------------------- | ---------------------------------------- | ---------------------------- |
| [rootUrl] | <code>string</code> | <code>&quot;\&quot;/\&quot;&quot;</code> | The root URL for all routes. |

<a name="Route+addRoutes"></a>

### route.addRoutes(...routes)

Add one or more routes.

**Kind**: instance method of [<code>Route</code>](#Route)

| Param                 | Type                  | Description                   |
| --------------------- | --------------------- | ----------------------------- |
| ...routes             | <code>Object</code>   | Route objects                 |
| routes[].method       | <code>string</code>   | HTTP method                   |
| routes[].url          | <code>string</code>   | Route URL path                |
| [routes[].preHandler] | <code>function</code> | Optional pre-handler function |
| routes[].handler      | <code>function</code> | Route handler function        |

<a name="Route+getRoutes"></a>

### route.getRoutes() ⇒ <code>Array.&lt;Object&gt;</code>

Return an array of Fastify route definitions.

**Kind**: instance method of [<code>Route</code>](#Route)  
**Returns**: <code>Array.&lt;Object&gt;</code> - The list of registered routes  
**Properties**

| Name    | Type                  | Description            |
| ------- | --------------------- | ---------------------- |
| method  | <code>string</code>   | HTTP method            |
| url     | <code>string</code>   | Route URL path         |
| handler | <code>function</code> | Route handler function |

<a name="Route+register"></a>

### route.register(fastify)

Register all routes with the Fastify instance.

**Kind**: instance method of [<code>Route</code>](#Route)

| Param   | Type                 | Description           |
| ------- | -------------------- | --------------------- |
| fastify | <code>Fastify</code> | The Fastify instance. |
