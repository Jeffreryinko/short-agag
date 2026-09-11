# short-agag (돌돌)

aagag.com(여러 한국 커뮤니티 인기글을 모아 보여주는 사이트)을 모티브로, 틱톡처럼
위아래 스와이프로 보는 숏폼 웹사이트.

## 시작하기 (다른 컴퓨터에서 이어서 작업할 때)

1. Node.js, Git 설치
2. 이 저장소 clone
   ```bash
   git clone https://github.com/Jeffreryinko/short-agag.git
   cd short-agag
   npm install
   ```
3. `.env.local` 파일을 프로젝트 루트에 직접 만들고 아래 내용 추가 (이 파일은 보안상 Git에
   올라가지 않으므로, 발급받은 유튜브 API 키를 별도로 옮겨와야 함):
   ```
   YOUTUBE_API_KEY=발급받은_키_값
   ```
4. 개발 서버 실행
   ```bash
   npm run dev
   ```
   → http://localhost:3000 에서 확인

## 프로젝트 구조

```
short-agag/
├── reference/short-agag.html   ← 원본 프로토타입 (디자인/인터랙션 기준, 비교용 보관)
├── src/
│   ├── app/
│   │   ├── layout.tsx           ← 공통 레이아웃 (폰트, 메타데이터)
│   │   ├── page.tsx              ← 홈 화면 (Feed 컴포넌트 렌더링)
│   │   └── globals.css           ← 프로토타입 CSS 이식본
│   ├── components/Feed.tsx      ← 피드/스와이프/좋아요/소스필터 등 핵심 인터랙션
│   └── lib/
│       ├── data.ts               ← [임시] 목업 글 데이터 — 다음 단계에서 API로 교체 예정
│       └── types.ts              ← 데이터 타입 정의
```

## 현재 상태 (2026-09-11 기준)

- 프로토타입의 디자인/인터랙션을 Next.js(TypeScript, App Router, Tailwind 미사용)로 포팅 완료
- 데이터는 아직 `src/lib/data.ts`의 하드코딩된 목업
- GitHub 저장소 연결 완료 (private)
- Google Cloud 프로젝트("My First Project", agile-genius-379904)에서 YouTube Data API v3
  활성화 + API 키 발급 완료 (`short-agag-youtube-key`, YouTube Data API v3로만 제한)

## 다음 작업

1. YouTube Data API를 호출하는 서버 API 라우트 작성 (`src/app/api/...`)
2. `src/lib/data.ts`의 목업 POSTS를 실제 유튜브 데이터로 교체
3. 검증되면 커뮤니티(클리앙/오유/SLR/뽐뿌/82쿡/엠팍/보배드림/인벤/루리웹/웃대/딴지일보/펨코)
   직접 파싱으로 확장

## 저작권 대응 방침 (중요)

- 본문 전문 복제 금지 — AI 요약만 사용
- 댓글은 자체 시스템 (원 커뮤니티 댓글 긁어오지 않음)
- 삭제요청 처리 창구 필요 (관리자 기능으로 구현 예정)
- 클릭 시 항상 원문 링크로 연결

## 기술 스택

Next.js (TypeScript, App Router) + Supabase(예정) + Vercel 배포(예정). Tailwind는
디자인이 이미 순수 CSS로 완성되어 있어 의도적으로 제외함.
