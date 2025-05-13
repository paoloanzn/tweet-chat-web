# logger.js

Source: `src/server/lib/logger.js`

<a name="Logger"></a>

## Logger

Logger class for logging messages with timestamps.

Implements the Singleton pattern to ensure a single instance is used.

**Kind**: global class

- [Logger](#Logger)
  - [.log(message)](#Logger+log)
  - [.info(message)](#Logger+info)
  - [.warn(message)](#Logger+warn)
  - [.error(message)](#Logger+error)

<a name="Logger+log"></a>

### logger.log(message)

Logs a general message.

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param   | Type                | Description         |
| ------- | ------------------- | ------------------- |
| message | <code>string</code> | The message to log. |

<a name="Logger+info"></a>

### logger.info(message)

Logs an info message.

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param   | Type                | Description                     |
| ------- | ------------------- | ------------------------------- |
| message | <code>string</code> | The information message to log. |

<a name="Logger+warn"></a>

### logger.warn(message)

Logs a warning message.

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param   | Type                | Description                 |
| ------- | ------------------- | --------------------------- |
| message | <code>string</code> | The warning message to log. |

<a name="Logger+error"></a>

### logger.error(message)

Logs an error message.

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param   | Type                | Description               |
| ------- | ------------------- | ------------------------- |
| message | <code>string</code> | The error message to log. |
