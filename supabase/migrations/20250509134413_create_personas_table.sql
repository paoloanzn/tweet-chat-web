create table "public"."personas" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "createdat" timestamp with time zone not null default now(),
    "updatedat" timestamp with time zone not null default now(),
    "last_tweetid" text,
    "data" jsonb
);


CREATE UNIQUE INDEX personas_name_key ON public.personas USING btree (name);

CREATE UNIQUE INDEX personas_pkey ON public.personas USING btree (id);

alter table "public"."personas" add constraint "personas_pkey" PRIMARY KEY using index "personas_pkey";

alter table "public"."personas" add constraint "personas_name_key" UNIQUE using index "personas_name_key";

grant delete on table "public"."personas" to "anon";

grant insert on table "public"."personas" to "anon";

grant references on table "public"."personas" to "anon";

grant select on table "public"."personas" to "anon";

grant trigger on table "public"."personas" to "anon";

grant truncate on table "public"."personas" to "anon";

grant update on table "public"."personas" to "anon";

grant delete on table "public"."personas" to "authenticated";

grant insert on table "public"."personas" to "authenticated";

grant references on table "public"."personas" to "authenticated";

grant select on table "public"."personas" to "authenticated";

grant trigger on table "public"."personas" to "authenticated";

grant truncate on table "public"."personas" to "authenticated";

grant update on table "public"."personas" to "authenticated";

grant delete on table "public"."personas" to "service_role";

grant insert on table "public"."personas" to "service_role";

grant references on table "public"."personas" to "service_role";

grant select on table "public"."personas" to "service_role";

grant trigger on table "public"."personas" to "service_role";

grant truncate on table "public"."personas" to "service_role";

grant update on table "public"."personas" to "service_role";


