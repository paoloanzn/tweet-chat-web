# supabase.js

Source: `src/server/lib/supabase.js`

<a name="getSupabaseClient"></a>

## getSupabaseClient ⇒ <code>SupabaseClient</code>

Returns a singleton Supabase client instance.

The client is created using the SUPABASE_URL and SUPABASE_KEY environment variables.
If these variables are not set, the process exits with an error.

**Kind**: global constant  
**Returns**: <code>SupabaseClient</code> - A Supabase client instance.
