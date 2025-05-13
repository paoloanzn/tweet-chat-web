# middleware.js

Source: `src/server/lib/middleware.js`

<a name="authMiddleware"></a>

## authMiddleware(request, reply)

Middleware for authenticating requests using JWT.

This middleware checks for a valid Bearer token in the Authorization header,
verifies the token using the JWT_SECRET environment variable, and attaches the decoded
token payload to the request object. If the token is missing or invalid, it sends a
401 response. In case of errors during verification, it sends a 500 response.

**Kind**: global function

| Param   | Type                | Description                  |
| ------- | ------------------- | ---------------------------- |
| request | <code>object</code> | The incoming request object. |
| reply   | <code>object</code> | The reply/response object.   |
