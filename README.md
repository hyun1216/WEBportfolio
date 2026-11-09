# macOS Interactive Desktop Portfolio (Next.js & Supabase)

macOS 감성의 인터랙티브 웹 데스크톱 포트폴리오입니다.  
**Next.js 14+ (App Router), TypeScript, Tailwind CSS, Supabase PostgreSQL, Lucide React** 기반으로 제작되었으며, 관리자 인증을 통한 서버리스 API 및 DB 영구 저장을 지원합니다.

---

## 🌟 기술 스택 & 아키텍처

- **Framework:** Next.js 14+ (App Router, Server & Client Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Glassmorphism, Custom macOS Theme
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS)
- **Icons:** Lucide React & Custom SVG
- **Deployment:** Vercel (One-Click Deploy 지원)

---

## 🚀 빠른 시작 가이드

### 1. 환경 변수 설정 (`.env.local`)
`.env.example`을 복사하여 `.env.local`을 생성하고 Supabase 프로젝트의 키 값을 입력합니다:

```env
# Supabase 대시보드 (Project Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 서버 전용 Service Role Key (클라이언트에 절대 노출되지 않음)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 관리자 인증 전용 비밀번호 (기본: admin1234)
ADMIN_SECRET_KEY=admin1234
```

### 2. Supabase 데이터베이스 세팅
Supabase SQL Editor에서 [`supabase/schema.sql`](./supabase/schema.sql) 파일의 내용을 실행합니다:
- `projects` 테이블 자동 생성 (UUID, RLS 활성화)
- 방문자 읽기(`SELECT`) 허용 및 클라이언트 직접 쓰기 차단 보안 정책
- 초기 7대 기본 프로젝트 데이터 자동 `INSERT`

### 3. 로컬 개발 서버 실행
```bash
npm install
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속합니다.

### 4. Vercel 배포
GitHub 저장소(`https://github.com/hyun1216/WEBportfolio.git`)를 Vercel에 연동한 후, Vercel 프로젝트 설정의 **Environment Variables**에 위 4개 환경 변수를 등록하면 즉시 프로덕션 배포가 완료됩니다.

---

## 📁 주요 파일 및 컴포넌트 구조

```
WEBportfolio/
├── app/
│   ├── api/folders/route.ts   # GET (프로젝트 목록 조회) & POST (x-admin-key 검증 후 DB 저장)
│   ├── globals.css            # macOS 폰트, 스크롤바, 흔들림(shake) 애니메이션
│   ├── layout.tsx             # 루트 레이아웃 & 메타데이터
│   └── page.tsx               # SSR 데이터 패칭 및 데스크톱 진입점
├── components/
│   ├── Desktop.tsx            # 전체 macOS 데스크톱 화면, 메뉴바, Dock
│   ├── FolderIcon.tsx         # 노란색 macOS 폴더 벡터 아이콘 (84px 크기)
│   ├── FinderWindow.tsx       # 신호등 버튼(닫기/최소화/최대화), 드래그 지원 모달
│   ├── Taskbar.tsx            # 우측 하단 실시간 초 단위 갱신 시계 & 날짜 위젯
│   ├── ContextMenu.tsx        # 우클릭 컨텍스트 메뉴 (새 폴더 생성 등)
│   └── NewFolderModal.tsx     # 관리자 암호 입력 및 Shake 애니메이션 모달
├── lib/
│   ├── supabaseClient.ts      # 공개(anon) 클라이언트
│   └── supabaseServer.ts      # 서버 전용(service_role) 클라이언트
├── public/
│   ├── me.JPG                 # 개발자 프로필 사진 에셋
│   └── wallpaper.jpg          # macOS 기본 배경화면
├── supabase/
│   └── schema.sql             # DB 테이블 스키마, RLS 정책, 초기 데이터 쿼리
└── types/
    └── project.ts             # TypeScript 인터페이스
```

---

## 🔒 보안 아키텍처 (Security)
- **RLS(Row Level Security):** 클라이언트가 직접 Supabase DB에 쓰기 요청을 보내는 것은 데이터베이스 레벨에서 원천 차단됩니다.
- **서버리스 API 검증:** 새 폴더 생성 시 `x-admin-key` 헤더를 `POST /api/folders`로 전달하며, 서버 환경 변수 `ADMIN_SECRET_KEY`와 일치할 때만 `service_role` 키로 DB에 안전하게 레코드를 삽입합니다.
