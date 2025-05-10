create sequence "public"."scraper_accounts_id_seq";

create table "public"."scraper_accounts" (
    "id" integer not null default nextval('scraper_accounts_id_seq'::regclass),
    "username" text not null,
    "email" text not null,
    "password" text not null,
    "cookies" jsonb,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."scraper_accounts" enable row level security;

alter sequence "public"."scraper_accounts_id_seq" owned by "public"."scraper_accounts"."id";

CREATE UNIQUE INDEX scraper_accounts_pkey ON public.scraper_accounts USING btree (id);

alter table "public"."scraper_accounts" add constraint "scraper_accounts_pkey" PRIMARY KEY using index "scraper_accounts_pkey";

grant delete on table "public"."scraper_accounts" to "anon";

grant insert on table "public"."scraper_accounts" to "anon";

grant references on table "public"."scraper_accounts" to "anon";

grant select on table "public"."scraper_accounts" to "anon";

grant trigger on table "public"."scraper_accounts" to "anon";

grant truncate on table "public"."scraper_accounts" to "anon";

grant update on table "public"."scraper_accounts" to "anon";

grant delete on table "public"."scraper_accounts" to "authenticated";

grant insert on table "public"."scraper_accounts" to "authenticated";

grant references on table "public"."scraper_accounts" to "authenticated";

grant select on table "public"."scraper_accounts" to "authenticated";

grant trigger on table "public"."scraper_accounts" to "authenticated";

grant truncate on table "public"."scraper_accounts" to "authenticated";

grant update on table "public"."scraper_accounts" to "authenticated";

grant delete on table "public"."scraper_accounts" to "service_role";

grant insert on table "public"."scraper_accounts" to "service_role";

grant references on table "public"."scraper_accounts" to "service_role";

grant select on table "public"."scraper_accounts" to "service_role";

grant trigger on table "public"."scraper_accounts" to "service_role";

grant truncate on table "public"."scraper_accounts" to "service_role";

grant update on table "public"."scraper_accounts" to "service_role";

create policy "allow_backend_access"
on "public"."scraper_accounts"
as permissive
for all
to backend
using (true);



