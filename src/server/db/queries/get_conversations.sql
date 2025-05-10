SELECT *
FROM conversations
WHERE user_id = $1 AND persona_id = $2
ORDER BY createdAt DESC;