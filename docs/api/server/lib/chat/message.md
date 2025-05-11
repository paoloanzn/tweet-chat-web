# message.js

Source: `src/server/lib/chat/message.js`

## Functions

<dl>
<dt><a href="#isValidMessage">isValidMessage(obj)</a> ⇒ <code>boolean</code></dt>
<dd><p>Validates if an object conforms to the Message type structure.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Message">Message</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="isValidMessage"></a>

## isValidMessage(obj) ⇒ <code>boolean</code>
Validates if an object conforms to the Message type structure.

**Kind**: global function  
**Returns**: <code>boolean</code> - True if object is a valid Message, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object to validate |
| obj.role | <code>string</code> | The role of the message sender |
| obj.message | <code>string</code> | The content of the message |
| obj.timestamp | <code>number</code> | Unix timestamp in seconds |

<a name="Message"></a>

## Message : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| role | <code>string</code> | The role of the message sender (e.g., 'user', 'assistant') |
| message | <code>string</code> | The content of the message |
| timestamp | <code>number</code> | Unix timestamp in seconds |

