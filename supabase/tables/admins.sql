create table public.admins (
  id uuid not null,
  created_at timestamp with time zone not null default now(),
  level smallint not null default '1'::smallint,
  constraint admins_pkey primary key (id),
  constraint admins_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;
