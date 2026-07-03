create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  session text not null check (session in ('hello', 'main', 'goodbye')),
  title text not null,
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "anyone can read tasks" on public.tasks for select using (true);
create policy "authenticated can insert tasks" on public.tasks for insert with check (auth.role() = 'authenticated');
create policy "authenticated can update tasks" on public.tasks for update using (auth.role() = 'authenticated');

insert into public.tasks (session, title, description, sort_order) values
  ('hello', '서울사무소 소개', '서울사무소가 어떤 일을 하는 곳인지, 소속과 역할을 소개받습니다.', 1),
  ('hello', '사무실 둘러보기', '사무실 공간과 주요 시설의 위치를 안내받습니다.', 2),
  ('hello', '후원업무 오리엔테이션', '후원 관리 업무 전반에 대한 오리엔테이션을 진행합니다.', 3),
  ('hello', '한국장학재단 및 근로시스템 등록하기', '한국장학재단 국가근로장학 시스템에 본인 정보를 등록합니다.', 4),
  ('hello', '안전교육이수 사진 촬영 및 제출하기', '안전교육 이수 화면을 촬영해 담당자에게 제출합니다.', 5),
  ('hello', '시간표 제출하기', '이번 학기 수업 시간표를 담당자에게 제출합니다.', 6),
  ('hello', '프린터 설치하기', '사무실 프린터를 본인 컴퓨터에 설치합니다.', 7),
  ('hello', '주변 주요 업무 장소 파악하기', '은행·우체국 등 업무에 자주 쓰는 주변 장소 위치를 파악합니다.', 8),
  ('main', '매월초 출근시간표 제출하기', '매월 초 그 달의 출근 가능 시간표를 제출합니다.', 1),
  ('main', '갈대상자 책 읽고 독후감 쓰기', '갈대상자 책을 읽고 독후감을 작성해 제출합니다.', 2),
  ('main', '프로파일링 교육', '후원자 프로파일링 작성 방법 교육을 받습니다.', 3),
  ('main', '라벨지 인쇄실습', '라벨지 인쇄 프로그램 사용법을 실습합니다.', 4),
  ('goodbye', '소감문 제출하기', '근무를 마치며 소감문을 작성해 제출합니다.', 1);
