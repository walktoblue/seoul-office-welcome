create table public.students (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  semester text not null,
  student_number text not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (year, semester, student_number, name)
);

alter table public.students enable row level security;

create policy "anyone can read students" on public.students for select using (true);
create policy "anyone can insert students" on public.students for insert with check (true);
