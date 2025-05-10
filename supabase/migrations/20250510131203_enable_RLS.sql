alter table "public"."conversations" enable row level security;

alter table "public"."personas" enable row level security;

alter table "public"."user_personas" enable row level security;

create policy "allow_backend_access"
on "public"."conversations"
as permissive
for all
to backend
using (true);


create policy "allow_backend_access"
on "public"."personas"
as permissive
for all
to backend
using (true);


create policy "allow_backend_access"
on "public"."user_personas"
as permissive
for all
to backend
using (true);



