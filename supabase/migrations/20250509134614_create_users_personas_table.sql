create table "public"."user_personas" (
    "user_id" uuid not null,
    "persona_id" uuid not null
);


CREATE UNIQUE INDEX user_personas_pkey ON public.user_personas USING btree (user_id, persona_id);

alter table "public"."user_personas" add constraint "user_personas_pkey" PRIMARY KEY using index "user_personas_pkey";

alter table "public"."user_personas" add constraint "user_personas_persona_id_fkey" FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE CASCADE not valid;

alter table "public"."user_personas" validate constraint "user_personas_persona_id_fkey";

alter table "public"."user_personas" add constraint "user_personas_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_personas" validate constraint "user_personas_user_id_fkey";

grant delete on table "public"."user_personas" to "anon";

grant insert on table "public"."user_personas" to "anon";

grant references on table "public"."user_personas" to "anon";

grant select on table "public"."user_personas" to "anon";

grant trigger on table "public"."user_personas" to "anon";

grant truncate on table "public"."user_personas" to "anon";

grant update on table "public"."user_personas" to "anon";

grant delete on table "public"."user_personas" to "authenticated";

grant insert on table "public"."user_personas" to "authenticated";

grant references on table "public"."user_personas" to "authenticated";

grant select on table "public"."user_personas" to "authenticated";

grant trigger on table "public"."user_personas" to "authenticated";

grant truncate on table "public"."user_personas" to "authenticated";

grant update on table "public"."user_personas" to "authenticated";

grant delete on table "public"."user_personas" to "service_role";

grant insert on table "public"."user_personas" to "service_role";

grant references on table "public"."user_personas" to "service_role";

grant select on table "public"."user_personas" to "service_role";

grant trigger on table "public"."user_personas" to "service_role";

grant truncate on table "public"."user_personas" to "service_role";

grant update on table "public"."user_personas" to "service_role";


