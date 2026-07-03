create table public.task_completions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id),
  task_id uuid not null references public.tasks(id),
  completed_at timestamptz not null default now(),
  unique (student_id, task_id)
);

alter table public.task_completions enable row level security;

create policy "anyone can read completions" on public.task_completions for select using (true);
create policy "anyone can insert completions" on public.task_completions for insert with check (true);
create policy "anyone can delete completions" on public.task_completions for delete using (true);
