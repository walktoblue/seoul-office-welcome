-- "매월초 출근시간표 제출하기"를 3개월치 3개 업무로 나눈다
delete from public.task_completions
where task_id in (
  select id from public.tasks where session = 'main' and title = '매월초 출근시간표 제출하기'
);

delete from public.tasks where session = 'main' and title = '매월초 출근시간표 제출하기';

update public.tasks set sort_order = sort_order + 2
where session = 'main';

insert into public.tasks (session, title, description, sort_order) values
  ('main', '매월초 출근시간표 제출하기 1', '1개월차 출근 가능 시간표를 매월 초 제출합니다.', 1),
  ('main', '매월초 출근시간표 제출하기 2', '2개월차 출근 가능 시간표를 매월 초 제출합니다.', 2),
  ('main', '매월초 출근시간표 제출하기 3', '3개월차 출근 가능 시간표를 매월 초 제출합니다.', 3);
