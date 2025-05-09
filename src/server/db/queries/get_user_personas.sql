SELECT p.*
FROM personas p
JOIN user_personas up ON up.persona_id = p.id
WHERE up.user_id = $1;