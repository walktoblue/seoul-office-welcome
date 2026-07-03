# 서울사무소 웰컴가이드

기술 이름(slug): `seoul-office-welcome`

## 한 줄 소개
한동대학교 서울사무소 근로학생이 첫 출근 시 스스로 온보딩 체크리스트를 따라가고, 관리자가 진행 현황을 확인·관리하는 웹앱

## 핵심 흐름
1. 학생이 첫 화면에서 연도·학기·학번·이름을 입력해 시작한다 (이전에 입력한 적 있으면 기존 체크 상태를 그대로 이어받는다)
2. 체크리스트 화면에서 hello·main·good bye 세 세션의 업무를 실제로 진행하며 하나씩 체크한다
3. 관리자는 구두로 반복 설명하지 않고도, 학생별 진행 현황을 대시보드에서 확인한다

## 참고 앱/사이트
노션/투두앱 스타일 — 심플한 체크리스트 UI

## 설정
- 로그인: 관리자만
- LLM API: 불필요
- 외부 연동: 없음
- 민감정보: 없음

## 디자인
- 강조색: `#2563EB` (차분한 파랑) — 버튼·링크·강조. 보라색 그라데이션은 쓰지 않는다.
- 배경: `#FFFFFF` (페이지) / `#F8FAFC` (캔버스) · 글자: `#1E293B` · 카드: `#FFFFFF` · 테두리: `#E2E8F0`
- 상태색: 성공 `#16A34A` · 오류 `#BA1A1A`
- 폰트: Noto Sans KR (Stitch는 Plus Jakarta Sans·Hanken Grotesk를 썼지만 한글 지원이 없어 유지하지 않는다)
- 모서리(radius): 8px · 카드는 그림자 없이 1px 테두리만, 팝오버/모달만 옅은 그림자 · 간격: 넉넉하게 (섹션 간 40px)
- 레이아웃 원칙: 웰컴 화면은 현동홀 배경사진 위 중앙 카드 폼, 체크리스트는 탭 전환형 리스트(hello/main/good bye), 관리자는 상단 탭 + 표. 탭은 밑줄 스타일(활성 탭 2px 파란 밑줄 + 굵은 글씨)

## 화면
1. **웰컴 입력** — `/`
   - 보임: 현동홀 배경사진 위 중앙 카드(1순위) → 입력 폼(연도·학기·학번·이름) → 시작하기 버튼
   - 동작: 연도(4자리 입력), 학기(select: 1학기/여름/2학기/겨울), 학번(select: 15~35 중 선택, 2자리), 이름(text) 입력 후 "시작하기". 동일한 연도·학기·학번·이름 조합의 학생 기록이 이미 있으면 그 학생의 기존 체크 상태를 그대로 불러온다(초기화되지 않음). 없으면 새로 만든다.
   - 데이터: 읽음/씀: students (조회 후 없으면 생성)
   - 상태: 제출 중(버튼 비활성화) · 필수값 미입력 시 안내 · 실패 시 오류 메시지
   - 디자인: design/_1/code.html

2. **체크리스트** — `/checklist`
   - 보임: 상단 "0000년 여름 000님을 환영합니다"(1순위) → hello / main / good bye 탭 → 업무 목록(체크박스 + 설명 버튼)
   - 동작: 각 업무 체크박스 클릭 시 완료 처리(완료 시각 저장). "설명" 버튼 클릭 시 해당 업무 설명을 팝업으로 표시. 기본 업무 목록(hello 8개·main 6개[매월초 출근시간표 제출하기는 3개월분 3개로 분리]·goodbye 1개)은 구현 시 시드 데이터로 미리 등록해 둔다.
   - 데이터: 읽음: tasks, task_completions / 씀: task_completions
   - 상태: 로딩 스피너 · 업무 없을 때 "등록된 업무가 없습니다" 안내 · 체크 실패 시 오류 토스트
   - 디자인: design/_2/code.html

3. **관리자 로그인** — `/admin/login`
   - 보임: 중앙 로그인 카드 — 비밀번호 입력(1순위)
   - 동작: 비밀번호 입력 후 로그인
   - 데이터: 없음 (Supabase Auth)
   - 상태: 제출 중 · 비밀번호 오류 메시지
   - 디자인: design/_3/code.html

4. **관리자 대시보드** — `/admin`
   - 보임: "학생 현황" 탭(학생별 hello/main/good bye 세션별 진행률 표, 1순위) / "업무 관리" 탭(업무별 설명 수정 + 신규 업무 추가)
   - 동작: 학생 현황 표에서 "자세히 보기"를 누르면 해당 학생의 hello/main/good bye별 업무 완료·미완료 상세를 본다. 업무 관리 탭에서 기존 업무 설명 수정·저장, 신규 업무 추가(소속 세션 hello/main/goodbye 선택 + 제목 + 설명 입력)
   - 데이터: 읽음: students, tasks, task_completions / 씀: tasks (수정·추가)
   - 상태: 로딩 · 학생 0명일 때 안내 · 저장 성공/실패 피드백
   - 디자인: design/_4/code.html

## 데이터 (Supabase 테이블)
- **students**
  - `id` uuid — 기본 키
  - `year` int — 연도(4자리)
  - `semester` text — 학기(1학기/여름/2학기/겨울)
  - `student_number` text — 학번 2자리(15~35)
  - `name` text — 이름
  - `created_at` timestamptz
  - 관계: 없음 (unique: year + semester + student_number + name 조합으로 같은 학생 식별)
- **tasks**
  - `id` uuid — 기본 키
  - `session` text — hello / main / goodbye
  - `title` text — 업무명
  - `description` text — 설명(관리자가 수정)
  - `sort_order` int — 목록 내 순서
  - `created_at` timestamptz
  - 관계: 없음
- **task_completions**
  - `id` uuid — 기본 키
  - `student_id` uuid → students.id
  - `task_id` uuid → tasks.id
  - `completed_at` timestamptz — 체크한 시각
  - 관계: student_id → students.id, task_id → tasks.id (unique: student_id + task_id)

## 기술 스택
Next.js (App Router, TypeScript) · Tailwind CSS · shadcn/ui · Supabase · Vercel

## MVP 범위
- 포함: 웰컴 입력, 체크리스트(이어보기 포함), 관리자 로그인, 관리자 대시보드(현황 + 업무 관리)
- 제외 — 다음에: 학생별 리포트 다운로드, 알림/리마인더, 다국어, 학생용 개별 로그인

## 진행 상황
- [x] 기획 완료
- [x] Stitch 프로토타입
- [x] 연결 (GitHub · Vercel · Supabase)
- [x] 구현: 웰컴 입력
- [x] 구현: 체크리스트
- [x] 구현: 관리자 로그인
- [x] 구현: 관리자 대시보드
- [x] 배포 확인
