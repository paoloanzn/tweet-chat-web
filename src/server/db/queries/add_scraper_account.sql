INSERT INTO scraper_accounts (username, email, password, cookies)
VALUES ($1, $2, $3, $4)
ON CONFLICT (username) DO NOTHING
RETURNING *; 