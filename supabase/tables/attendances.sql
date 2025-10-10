create table public.attendances (
  created_at timestamp with time zone not null default now(),
  marked_day date not null,
  user_id uuid not null,
  group_id smallint not null,
  constraint attendances_pkey primary key (marked_day, user_id),
  constraint attendances_group_id_fkey foreign KEY (group_id) references groups (id),
  constraint attendances_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;
