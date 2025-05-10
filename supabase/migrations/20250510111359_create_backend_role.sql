-- Create the backend role (password to be set dynamically)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'backend') THEN
        CREATE ROLE backend WITH LOGIN PASSWORD 'b11ba2a02b3065300d3c5963529d7347';
        -- Grant service_role permissions to backend
        GRANT service_role TO backend;
    END IF;
END $$;