# 서울사무소 웰컴가이드

한동대학교 서울사무소 근로학생이 첫 출근 시 스스로 온보딩 체크리스트를 따라가고, 관리자가 진행 현황을 확인·관리하는 웹앱입니다. 방학마다 반복되던 구두 온보딩 교육을 대신합니다.

- 학생: 연도·학기·학번·이름을 입력하면 hello(초기 안내) → main(근무 중 업무) → good bye(마무리) 순서의 체크리스트가 뜨고, 실제로 업무를 진행할 때마다 체크합니다. 같은 정보로 다시 접속하면 기존 진행 상황을 그대로 이어갑니다.
- 관리자: 비밀번호로 로그인해 학생별 세션별 진행률을 보고, 학생별 상세(완료/미완료 업무)를 확인하며, 업무 설명을 수정하거나 새 업무를 추가할 수 있습니다.

라이브: https://seoul-office-welcome.vercel.app

## 개발

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인합니다.

## 스택

Next.js (App Router, TypeScript) · Tailwind CSS · shadcn/ui · Supabase · Vercel

## 문서

- `PLAN.md` — 화면·데이터 명세
- `MEMORY.md` — 만들어진 과정 기록
