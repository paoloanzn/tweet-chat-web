INSERT INTO conversations (user_id, persona_id, conversation)
VALUES ($1, $2, $3)
RETURNING *;