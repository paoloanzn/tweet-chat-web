DELETE FROM conversations
WHERE id = $1
RETURNING *;