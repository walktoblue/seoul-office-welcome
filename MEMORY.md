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
