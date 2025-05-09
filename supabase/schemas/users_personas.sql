CREATE TABLE user_personas (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, persona_id)
);