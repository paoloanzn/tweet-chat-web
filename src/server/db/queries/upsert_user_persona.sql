WITH inserted_persona AS (
    INSERT INTO personas(name, data)
    VALUES ($1, $2)
    ON CONFLICT (name) DO UPDATE SET data = $2
    RETURNING id
)
INSERT INTO user_personas(user_id, persona_id)
SELECT $3, id FROM inserted_persona
ON CONFLICT (user_id, persona_id) DO UPDATE SET persona_id = EXCLUDED.persona_id
RETURNING persona_id;