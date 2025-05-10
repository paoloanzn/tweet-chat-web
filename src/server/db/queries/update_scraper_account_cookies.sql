UPDATE scraper_accounts
SET cookies = $2
WHERE username = $1
RETURNING *; 