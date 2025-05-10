CREATE UNIQUE INDEX scraper_accounts_username_key ON public.scraper_accounts USING btree (username);

alter table "public"."scraper_accounts" add constraint "scraper_accounts_username_key" UNIQUE using index "scraper_accounts_username_key";


