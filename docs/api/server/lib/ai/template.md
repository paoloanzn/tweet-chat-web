# template.js

Source: `src/server/lib/ai/template.js`

<a name="compileTemplate"></a>

## compileTemplate(template, data) ⇒ <code>Object</code>
Compiles a template string by replacing variables with values from a data object.
Variables in the template should be in the format {{variableName}}.

**Kind**: global function  
**Returns**: <code>Object</code> - Result object containing either the compiled template or an error  

| Param | Type | Description |
| --- | --- | --- |
| template | <code>string</code> | The template string containing variables to replace |
| data | <code>Object</code> | Object containing key-value pairs to replace variables |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| template | <code>string</code> \| <code>function</code> | The compiled template string or empty string if error |
| error | <code>string</code> \| <code>null</code> | Error message if compilation failed, null otherwise |

**Example**  
```js
const template = "Hello {{name}}!";
const data = { name: "World" };
const result = compileTemplate(template, data);
// result.template() returns "Hello World!"
```
