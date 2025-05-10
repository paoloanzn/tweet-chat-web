-- Create the backend role (password to be set dynamically)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'backend') THEN
        CREATE ROLE backend WITH LOGIN PASSWORD '{{BACKEND_ROLE_PASSWORD}}';
        -- Grant service_role permissions to backend
        GRANT service_role TO backend;
    END IF;
END $$;