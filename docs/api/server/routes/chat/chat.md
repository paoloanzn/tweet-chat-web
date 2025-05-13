# chat.js

Source: `src/server/routes/chat/chat.js`

## Functions

<dl>
<dt><a href="#formatTimestamp">formatTimestamp(timestamp)</a> ⇒ <code>string</code></dt>
<dd><p>Formats a timestamp into a human readable date string</p>
</dd>
<dt><a href="#formatConversation">formatConversation(messages)</a> ⇒ <code>string</code></dt>
<dd><p>Formats an array of messages into a readable conversation format</p>
</dd>
</dl>

<a name="formatTimestamp"></a>

## formatTimestamp(timestamp) ⇒ <code>string</code>

Formats a timestamp into a human readable date string

**Kind**: global function  
**Returns**: <code>string</code> - Formatted date string

| Param     | Type                | Description               |
| --------- | ------------------- | ------------------------- |
| timestamp | <code>number</code> | Unix timestamp in seconds |

<a name="formatConversation"></a>

## formatConversation(messages) ⇒ <code>string</code>

Formats an array of messages into a readable conversation format

**Kind**: global function  
**Returns**: <code>string</code> - Formatted conversation string

| Param    | Type                               | Description              |
| -------- | ---------------------------------- | ------------------------ |
| messages | <code>Array.&lt;Message&gt;</code> | Array of message objects |
