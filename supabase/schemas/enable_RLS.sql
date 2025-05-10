-- Enable RLS on all tables in the public schema
DO $$
DECLARE
    table_rec RECORD;
BEGIN
    FOR table_rec IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
    LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(table_rec.tablename) || ' ENABLE ROW LEVEL SECURITY';
        RAISE NOTICE 'Enabled RLS on table: %', quote_ident(table_rec.tablename); -- Optional: for feedback
    END LOOP;
END $$;

-- Create a specific policy to grant full access to 'service_role' and 'backend' roles
DO $$
DECLARE
    table_rec RECORD;
BEGIN
    FOR table_rec IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
    LOOP
        EXECUTE 'CREATE POLICY "allow_backend_access" ON public.' || quote_ident(table_rec.tablename) ||
                ' AS PERMISSIVE FOR ALL TO backend USING (true)';
        RAISE NOTICE 'Created "allow_backend_access" policy on table: %', quote_ident(table_rec.tablename); -- Optional: for feedback
    END LOOP;
END $$;