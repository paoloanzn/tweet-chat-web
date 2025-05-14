project_id = "tweet-chat"
region     = "us-central1"
container_image = "gcr.io/tweet-chat/tweet-chat-api:latest"

env_vars = {
  NODE_ENV       = "production"
  SUPABASE_URL   = "your-supabase-url"
  SUPABASE_KEY   = "your-supabase-key"
  DB_URL         = "your-db-url"
  OPENAI_API_KEY = "your-openai-key"
  JWT_SECRET     = "your-jwt-secret"
} 