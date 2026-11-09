# macOS Interactive Desktop Portfolio (Git-as-a-CMS)

외부 데이터베이스(Supabase 등) 없이 **GitHub 저장소의 `data/projects.json` 파일을 데이터베이스처럼 활용(Git-as-a-CMS)**하는 macOS 감성의 인터랙티브 웹 데스크톱 포트폴리오입니다.

---

## 🌟 아키텍처 및 특징

- **Git-as-a-CMS:** 데이터베이스 설치 없이 저장소 내 `data/projects.json`을 단일 진실 공급원(Single Source of Truth)으로 사용.
- **안전한 관리자 폴더 생성:** 웹 UI에서 관리자 암호 인증을 거치면 **GitHub REST API(Contents PUT)**를 통해 원격 저장소에 직접 커밋 & 푸시.
- **macOS 데스크톱 경험:** 
  - 다이내믹 월페이퍼 및 글래스모피즘 상단 메뉴바, 하단 플로팅 Dock
  - **오른쪽 하단 태스크바:** 초 단위 실시간 흐르는 시계 & 날짜 위젯 (`2026. 11. 09 (월) 16:04:12`)
  - 노란색 폴더 아이콘 그리드
  - 드래그 및 신호등 버튼(닫기/최소화/최대화)을 지원하는 Finder 뷰어 모달
  - 프로필 에셋(`public/me.JPG`) 직접 연동

---

## 🚀 환경 변수 설정 (`.env.local` & Vercel Dashboard)

```env
# 관리자 인증 전용 비밀번호
ADMIN_SECRET_KEY=admin1234

# GitHub Personal Access Token (repo Contents 쓰기 권한 필요)
GITHUB_PAT=ghp_yourPersonalAccessTokenHere

# 대상 저장소 정보
GITHUB_REPO_OWNER=hyun1216
GITHUB_REPO_NAME=WEBportfolio
```

> 💡 **로컬 개발 시 참고:**  
> `GITHUB_PAT`를 설정하지 않더라도 로컬 환경에서는 파일 시스템(`data/projects.json`)에 직접 안전하게 기록되며, `GITHUB_PAT`가 등록되면 GitHub 원격 저장소에 자동으로 커밋 & 푸시됩니다.

---

## 📁 주요 파일 및 디렉터리

```
WEBportfolio/
├── data/
│   └── projects.json          # 프로젝트 목록 데이터 (Git-as-a-CMS)
├── app/
│   ├── api/folders/route.ts   # GET (프로젝트 조회) & POST (GitHub Contents API 커밋)
│   ├── globals.css            # macOS 폰트, 스크롤바, 애니메이션
│   ├── layout.tsx             # 루트 레이아웃
│   └── page.tsx               # 서버 사이드 data/projects.json 패칭
├── components/
│   ├── Desktop.tsx            # 데스크톱 레이아웃, 메뉴바, Dock, 그리드
│   ├── FolderIcon.tsx         # macOS 노란 폴더 벡터 아이콘
│   ├── FinderWindow.tsx       # 신호등 버튼, 드래그 지원 모달 뷰어
│   ├── Taskbar.tsx            # 실시간 초 단위 시계 & 날짜 위젯
│   ├── ContextMenu.tsx        # 우클릭 컨텍스트 메뉴
│   └── NewFolderModal.tsx     # 관리자 암호 입력 및 Shake 애니메이션 모달
├── public/
│   ├── me.JPG                 # 프로필/증명사진 에셋
│   └── wallpaper.jpg          # macOS 기본 배경화면
└── types/
    └── project.ts             # TypeScript 인터페이스
```

---

## 🛠 실행 방법

```bash
npm install
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속합니다.
