DELETE FROM user_personas
WHERE user_id = $1 AND persona_id = $2;