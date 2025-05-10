UPDATE conversations
SET conversation = $2, updatedAt = NOW()
WHERE id = $1
RETURNING *;