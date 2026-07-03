# 🍊 만들기 기록 — 서울사무소 웰컴가이드

> 이 앱을 어떤 과정으로 만들었는지 남기는 기록입니다.
> 나중에 복기하거나, 다른 사람에게 사례로 보여줄 때 씁니다.

## 한눈에 보기
- 무엇을: 한동대학교 서울사무소 근로학생이 첫 출근 시 스스로 온보딩 체크리스트를 따라가고, 관리자가 진행 현황을 확인·관리하는 웹앱
- 누구를 위해: 방학마다 서울사무소로 오는 근로 아르바이트 학생 (첫 출근일에 사용) + 관리자 본인
- 핵심 흐름: 학생이 연도·학기·학번·이름을 입력 → hello/main/good bye 체크리스트를 실제로 진행하며 체크 → 관리자가 대시보드에서 현황 확인
- 스택: Next.js · Tailwind · shadcn/ui · Supabase · Vercel
- 시작: 2026-07-02   · 라이브: 배포 전

---

## 기록

### 2026-07-02 기획
- **정한 것**: 화면 4개(웰컴 입력 → 체크리스트 → 관리자 로그인 → 관리자 대시보드). 로그인은
  관리자만 필요하고, 학생은 매번 연도·학기·학번·이름만 입력한다. LLM API는 불필요 — 정해진
  체크리스트를 저장·표시·집계하는 게 핵심이라 고정 데이터 CRUD로 충분하다고 판단했다.
- **왜**: 방학마다 오는 근로학생에게 서울사무소 소개, 오리엔테이션, 각종 등록·제출 업무를
  매번 구두로 반복 설명하는 게 번거롭고 피로하다는 게 출발점이었다. 학생이 스스로 순서대로
  진행하며 체크하게 하면, 관리자는 구두 반복 설명 대신 대시보드로 진행 상황만 확인하면 된다.
  참고 스타일로는 노션/투두앱의 심플한 체크리스트 UI를 지목했다.
- **고민하다 버린 선택지**: 학생용 개별 로그인(회원가입)은 넣지 않기로 했다 — 방학마다 오는
  일회성 근로학생에게 계정 관리 부담을 지우는 게 오히려 번거롭다. 대신 연도·학기·학번·이름
  조합으로 학생을 식별하는 방식을 택했다.
- **막힌 점 / 바꾼 점**: 처음 설계에는 학번 입력이 없어서, 동명이인이거나 같은 학기에 여러
  학생이 있을 때 구분이 애매했다. 사용자가 직접 "학번(15~35학번 중 선택) 추가"를 요청해
  students 테이블 unique 키를 (연도, 학기, 학번, 이름) 네 값 조합으로 바꿨다. 같은 조합으로
  다시 접속하면 기존 체크 상태를 그대로 불러와 이어가도록(초기화 안 됨) 웰컴 입력 화면의
  동작을 명시했다.
- **배운 것 / 다음**: 다음은 Stitch 프로토타입 단계 — 4개 화면(웰컴 입력, 체크리스트, 관리자
  로그인, 관리자 대시보드) 전부를 담은 프롬프트를 만들어 사용자가 직접 Stitch에서 디자인을
  뽑아온다. 사용자가 현동홀 실제 사진을 갖고 있어 다음 단계(연결)에서 프로젝트 폴더에 넣기로
  했다.

### 2026-07-03 연결
- **한 것**: Stitch zip(화면 4개, `_1`~`_4`)을 `design/`으로 정리하고 각 화면을 PLAN.md의
  `디자인:` 줄에 매핑했다. Stitch 디자인 시스템(`DESIGN.md`)의 실제 색상값(강조 `#2563EB`,
  글자 `#1E293B`, 테두리 `#E2E8F0`, 오류 `#BA1A1A`)으로 PLAN.md `## 디자인`을 다듬었다(폰트는
  Stitch가 쓴 Plus Jakarta Sans/Hanken Grotesk 대신 한글 지원되는 Noto Sans KR을 그대로
  유지). `create-next-app`으로 스캐폴드하고 shadcn/ui(button·card·input·label·select·
  textarea·table·badge·tabs·dialog)를 얹은 뒤, `app/globals.css`의 shadcn CSS 변수를 위 색상에
  맞게 oklch로 변환해 적용했다. GitHub 레포 생성 → Vercel 프로젝트 연결(GitHub App은 이미
  설치돼 있어 바로 연결됨) → Supabase 프로비저닝까지 마쳤다.
- **왜**: 화면-디자인 파일을 미리 짝지어 둬야 구현 단계에서 정확한 Stitch 파일을 보고 만들 수
  있다. 디자인 토큰은 기본값보다 Stitch 결과(Notion 느낌의 정돈된 팔레트)가 더 나아서 그대로
  반영했다.
- **어떻게**: `unzip`으로 Stitch zip을 풀어 `design/_1`~`_4`, `design/DESIGN.md`로 정리 후 원본
  zip은 삭제. GitHub은 `gh repo create --source=. --public --push`, Vercel은 `vercel link` →
  `vercel git connect`, Supabase는 `vercel integration add supabase -e production -e preview
  -e development`로 프로비저닝하고 `supabase projects api-keys`로 anon 키를 확보, `supabase
  link`로 CLI를 프로젝트에 연결했다.
- **막힌 점 / 바꾼 점**: `vercel integration add supabase`가 "Cannot install more than one
  integration at a time" 오류로 계속 실패했다. `vercel integration ls`로 계정 전체 리소스를
  보니 이미 Supabase 프로젝트가 2개(도너월용 `supabase-aqua-curtain`, 그리고 아무 프로젝트에도
  연결 안 된 고아 상태 `worldcup-523-db`) 있어 **무료 플랜 조직당 2개 한도**에 걸린 것이었다.
  사용자에게 확인 후 `worldcup-523-db`를 `vercel integration-resource remove worldcup-523-db
  --yes`로 삭제해 한도를 비우고 나서야 새 프로젝트 생성이 성공했다. 또 처음에
  `--environment production preview development`처럼 값을 공백으로 나열했더니 제대로 안
  먹혀서, `-e production -e preview -e development`처럼 **플래그를 반복**해야 한다는 걸
  알았다.
- **배운 것 / 다음**: Supabase 무료 프로젝트 한도(계정당 2개)에 걸리면 오류 메시지가
  한도 초과라고 명확히 말해주지 않고 "Cannot install more than one integration at a time"처럼
  모호하게 나온다 — `vercel integration ls`로 계정 전체를 훑어보는 게 원인 파악의 핵심이었다.
  다음은 구현 단계 — PLAN.md의 4개 화면을 Stitch 디자인대로 하나씩 만든다.

### 2026-07-03 구현
- **만든 화면**: 웰컴 입력(`/`) → 체크리스트(`/checklist`) → 관리자 로그인(`/admin/login`) →
  관리자 대시보드(`/admin`), 4개 전부. Stitch 디자인의 레이아웃·요소·라벨은 그대로 따르되,
  각 화면에 붙어 있던 제네릭 상단 내비게이션·사이드바(Status/Management/Settings 등 실제로
  없는 메뉴)·풋터·플로팅 버튼은 PLAN.md에 없는 기능이라 빼고 핵심 콘텐츠만 구현했다.
- **핵심 기술 결정**:
  1. **학생 식별과 이어보기** — 로그인 없는 학생은 (연도, 학기, 학번, 이름) 조합을 유니크
     키로 써서 같은 조합으로 다시 들어오면 기존 `students` row를 재사용하고 체크 상태를
     그대로 불러온다. 체크 자체는 `task_completions`에 (student_id, task_id) unique row를
     insert/delete하는 방식으로 토글해, 별도 `completed` boolean 컬럼 없이 "행이 있으면 완료"로
     단순화했다.
  2. **관리자 인증 = Supabase Auth, 화면엔 비밀번호만** — 로그인 화면 디자인이 비밀번호 입력칸
     하나뿐이라, 이메일은 `admin@seoul-office-welcome.local`로 고정하고 Admin API
     (`/auth/v1/admin/users`, service_role 키 사용)로 관리자 계정을 미리 하나 만들어 뒀다.
     `tasks` 테이블 쓰기 정책은 `auth.role() = 'authenticated'`로 걸어서, 로그인 세션이 있는
     브라우저만 업무 설명 수정·추가가 되게 했다 — 화면 라우팅으로 막는 것과 별개로 DB 단에서도
     막힌다.
  3. **RLS 정책을 데이터 성격별로 다르게** — `students`·`task_completions`는 로그인 없는
     공개 체크리스트라 select/insert(그리고 completions는 delete까지)를 전부 열어 뒀고,
     `tasks`는 select는 열되 insert/update만 인증 필요로 걸었다. 세 테이블 모두 RLS를 켜고
     정책을 명시했다 — 하나라도 꺼져 있으면 Supabase가 프로젝트 URL만으로 read/write 가능
     경고를 보낸다.
- **막힌 점 / 바꾼 점**: 사용자가 확인하면서 요구사항이 두 번 바뀌었다. ① "매월초 출근시간표
  제출하기"를 3개월 근무 기준 3개(1/2/3)로 나눠 달라고 해서, 기존 단일 task row와 거기 달린
  completions를 지우고 sort_order를 2씩 밀어 새 3개 row를 끼워 넣는 마이그레이션
  (`004_split_timesheet_task.sql`)을 새로 짰다. ② 관리자 대시보드의 "학생 현황"이 처음엔
  전체 진행률 한 줄이었는데, hello/main/good bye 세션별로 나눠 보고 싶다는 요청에 진행률
  계산 로직을 세션별 Map으로 바꿨고, 이어서 "어떤 업무를 안 했는지" 보고 싶다는 요청에
  학생별 완료 task_id Set을 추가로 계산해 "자세히 보기" 다이얼로그(세션별 체크/미체크 아이콘
  목록)를 붙였다. 둘 다 처음부터 데이터 구조(세션별 집계, task_id 단위 완료 여부)를 넉넉히
  잡아뒀던 덕분에 큰 리팩터 없이 얹을 수 있었다.
- **배운 것**: 체크리스트형 앱에서는 "완료 개수"만 미리 계산해두지 말고, 원본 완료
  task_id 목록(Set)도 같이 들고 있는 게 낫다 — 나중에 "무엇을 안 했는지" 같은 상세 요청이
  오면 집계값만으론 답할 수 없어서 다시 원본 데이터를 fetch해야 한다.
