/**
 * macOS Interactive Desktop Portfolio Script
 */

// ==========================================================================
// 1. 초기 7개 프로젝트 데이터 정의 (콘텐츠: 설명, 태그, 스크린샷, 데모/영상 링크)
// ==========================================================================
const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    name: "뭐사주지?",
    badge: "AI 추천 / 웹 서비스",
    summary: "결정 장애를 겪는 사용자들을 위한 상황 및 대상별 맞춤형 선물 추천 플랫폼",
    tags: ["React", "TypeScript", "Tailwind CSS", "Gemini API", "Node.js"],
    description: "생일, 기념일, 집들이 등 다양한 상황과 받는 사람의 연령대/취향/예산에 맞춰 최적의 선물을 센스있게 제안해주는 AI 기반 선물 큐레이션 서비스입니다. 카테고리별 실시간 랭킹 및 위시리스트 공유 기능을 제공합니다.",
    features: [
      "AI 기반 맞춤형 선물 추천 알고리즘 탑재",
      "예산별, 상황별(생일, 승진, 집들이 등), 연령대 필터링",
      "선물 찜하기 및 카카오톡 공유 기능",
      "반응형 웹 UI 및 모바일 친화적 카드 슬라이더"
    ],
    demoUrl: "https://github.com/hyun1216/WEBportfolio",
    repoUrl: "https://github.com/hyun1216/WEBportfolio",
    image: null, // 실제 이미지가 없을 경우 세련된 Mockup 플레이스홀더 렌더링
    videoUrl: null
  },
  {
    id: "proj-2",
    name: "월 배당금 목표 원금 계산기",
    badge: "FinTech / 시뮬레이터",
    summary: "투자자가 원하는 월 목표 배당금을 달성하기 위해 필요한 종목별 필요 투자 원금을 시뮬레이션하는 금융 계산기",
    tags: ["Vue.js", "Chart.js", "Financial API", "PWA"],
    description: "미국 및 한국 고배당 ETF(SCHD, JEPI 등)와 개별 배당주의 배당률 및 주가 데이터를 바탕으로, 목표 월 소득에 도달하기 위한 필요 원금, 월별 배당 캘린더, 복리 재투자 시뮬레이션을 직관적인 그래프로 제공합니다.",
    features: [
      "목표 월 배당금 입력 시 종목별 필요 투자 원금 자동 역산",
      "월별 예상 배당 수령액 캘린더 및 시각화 차트",
      "배당소득세(15.4%) 및 금융소득종합과세 계산 로직 포함",
      "포트폴리오 비중 조절 및 로컬 스토리지 시나리오 저장"
    ],
    demoUrl: "https://github.com/hyun1216/WEBportfolio",
    repoUrl: "https://github.com/hyun1216/WEBportfolio",
    image: null,
    videoUrl: null
  },
  {
    id: "proj-3",
    name: "내돈내산 저장소",
    badge: "Community / 리뷰 아카이빙",
    summary: "영수증 인증 기반의 솔직 담백한 내돈내산 소비 일기 및 신뢰도 높은 리뷰 아카이브",
    tags: ["Next.js", "OCR API", "Supabase", "Tailwind CSS"],
    description: "협찬과 광고가 범람하는 리뷰 환경에서 벗어나, 영수증 OCR 인증을 통과한 순수 실구매자들의 실제 구매 평가와 재구매 의사를 투명하게 기록하고 공유하는 클린 리뷰 커뮤니티입니다.",
    features: [
      "영수증 이미지 OCR 자동 텍스트 인식 및 구매 내역 검증",
      "별점 대신 '재구매 의사(100% / 50% / 절대 안 삼)' 중심 평가",
      "내 소비 패턴 통계 및 카테고리별 지출 분석 리포트",
      "광고 없는 검색 필터 및 핫 아이템 큐레이션"
    ],
    demoUrl: "https://github.com/hyun1216/WEBportfolio",
    repoUrl: "https://github.com/hyun1216/WEBportfolio",
    image: null,
    videoUrl: null
  },
  {
    id: "proj-4",
    name: "Bottos",
    badge: "Automation / Bot Platform",
    summary: "일상 및 업무 반복 작업을 손쉽게 자동화하는 멀티 플랫폼 봇 서비스",
    tags: ["Python", "FastAPI", "WebSocket", "Docker", "Redis"],
    description: "주요 메신저(디스코드, 텔레그램, 슬랙)와 연동되어 실시간 알림, 데이터 크롤링 수집, 스마트 스케줄링 등을 모듈식으로 조합하여 실행할 수 있는 지능형 자동화 봇 플랫폼입니다.",
    features: [
      "모듈형 웹훅 및 트리거 기반 작업 자동화 파이프라인",
      "실시간 데이터 크롤링 및 메신저 즉시 푸시 알림",
      "대시보드를 통한 봇 상태 모니터링 및 실시간 로그 뷰어",
      "클라우드 컨테이너 기반 무중단 가동 환경 구축"
    ],
    demoUrl: "https://github.com/hyun1216/WEBportfolio",
    repoUrl: "https://github.com/hyun1216/WEBportfolio",
    image: null,
    videoUrl: null
  },
  {
    id: "proj-5",
    name: "청년체크",
    badge: "Public Policy / 자격 진단",
    summary: "청년들을 위한 복잡한 정부·지자체 지원 정책 및 금융 혜택 원클릭 자격 진단기",
    tags: ["React", "Zustand", "공공데이터포털 API", "Styled-Components"],
    description: "나이, 소득구간, 거주지역, 취업상태 등 간단한 정보 입력만으로 청년도약계좌, 청년월세지원, 구직활동지원금 등 본인이 수혜받을 수 있는 모든 정부 지원 정책을 즉시 판별해주는 서비스입니다.",
    features: [
      "1분 맞춤형 정책 자격 자가진단 인터랙티브 폼",
      "중복 수혜 가능 여부 판별 및 신청 일정 D-Day 카운트다운",
      "공공데이터 연동을 통한 최신 정책 데이터 자동 업데이트",
      "PDF 요약 보고서 다운로드 및 카카오 알림톡 신청 알림"
    ],
    demoUrl: "https://github.com/hyun1216/WEBportfolio",
    repoUrl: "https://github.com/hyun1216/WEBportfolio",
    image: null,
    videoUrl: null
  },
  {
    id: "proj-6",
    name: "Hangeul_zip",
    badge: "Design & Typography / 아카이브",
    summary: "아름다운 상업용 무료 한글 폰트를 한곳에 모아 실시간 타이핑 테스트 및 다운로드를 지원하는 폰트 아카이빙 웹",
    tags: ["HTML5 Canvas", "Vanilla JS", "Web Font API", "CSS Grid"],
    description: "수백 가지의 상업용 무료 한글 서체를 라이선스 범위별로 분류하고, 사용자가 입력한 문구를 즉석에서 실시간 프리뷰 및 글자 간격, 굵기를 조절하며 비교해 볼 수 있는 디자이너/개발자용 폰트 플랫폼입니다.",
    features: [
      "실시간 다중 폰트 렌더링 및 인터랙티브 텍스트 커스텀 테스트",
      "라이선스 범위(인쇄, 웹, 영상, CI/BI) 명확한 원클릭 필터링",
      "폰트 CSS @font-face 코드 스니펫 원클릭 복사",
      "가벼운 단일 경량 웹 구조로 초고속 렌더링 속도 보장"
    ],
    demoUrl: "https://github.com/hyun1216/WEBportfolio",
    repoUrl: "https://github.com/hyun1216/WEBportfolio",
    image: null,
    videoUrl: null
  },
  {
    id: "proj-7",
    name: "소원하늘",
    badge: "Interactive 3D / 감성 웹",
    summary: "밤하늘에 소원을 담은 풍등을 띄우고 다른 사람들의 소원과 교감하는 감성 인터랙티브 플랫폼",
    tags: ["Three.js", "WebGL", "Firebase", "Web Audio API"],
    description: "사용자가 적은 소중한 소원 문구를 빛나는 3D 풍등 오브젝트에 실어 가상 3D 밤하늘에 띄워 보내고, 밤하늘을 유영하는 다른 사람들의 풍등을 클릭해 응원과 공감을 전할 수 있는 힐링 인터랙티브 웹 애플리케이션입니다.",
    features: [
      "Three.js 기반 3D 밤하늘 풍등 물리 엔진 및 파티클 애니메이션",
      "감성적인 백그라운드 사운드 및 입체 음향(Web Audio) 효과",
      "풍등 소원 실시간 동기화 및 익명 응원(하트) 인터랙션",
      "시간대별 조명(노을, 한밤, 새벽) 다이내믹 스카이박스 변화"
    ],
    demoUrl: "https://github.com/hyun1216/WEBportfolio",
    repoUrl: "https://github.com/hyun1216/WEBportfolio",
    image: null,
    videoUrl: null
  }
];

// ==========================================================================
// 2. 상태 관리 (localStorage 연동: 사용자 생성 폴더 유지)
// ==========================================================================
const STORAGE_KEY = "mac_portfolio_folders_v1";
const THEME_STORAGE_KEY = "mac_portfolio_theme";

let projects = [];

function loadProjects() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      projects = JSON.parse(saved);
      return;
    } catch (e) {
      console.error("Failed to parse saved projects:", e);
    }
  }
  // 초기 로드 시 기본 7개 프로젝트 설정
  projects = [...DEFAULT_PROJECTS];
  saveProjects();
}

function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

// ==========================================================================
// 3. macOS 노란 폴더 SVG 아이콘 생성기
// ==========================================================================
function getMacFolderSvg() {
  return `
    <svg class="mac-folder-icon" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="folderBack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#38b6ff" />
          <stop offset="100%" stop-color="#008be5" />
        </linearGradient>
        <linearGradient id="folderYellowBack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffd56b" />
          <stop offset="100%" stop-color="#e8a716" />
        </linearGradient>
        <linearGradient id="folderYellowFront" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffe885" />
          <stop offset="15%" stop-color="#ffd15c" />
          <stop offset="100%" stop-color="#e09809" />
        </linearGradient>
        <filter id="folderShadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.25"/>
        </filter>
      </defs>
      <!-- 폴더 뒷면 탭 -->
      <path d="M6 14C6 9.58172 9.58172 6 14 6H36.5C39.5 6 42.5 8 45 11L48.5 15.5C50.5 18 53.5 19.5 56.5 19.5H86C90.4183 19.5 94 23.0817 94 27.5V64C94 68.4183 90.4183 72 86 72H14C9.58172 72 6 68.4183 6 64V14Z" fill="url(#folderYellowBack)"/>
      <!-- 폴더 내부 종이 실루엣 -->
      <rect x="14" y="16" width="72" height="40" rx="3" fill="#ffffff" opacity="0.8"/>
      <!-- 폴더 앞면 커버 -->
      <path d="M6 26C6 22.6863 8.68629 20 12 20H88C91.3137 20 94 22.6863 94 26V64C94 68.4183 90.4183 72 86 72H14C9.58172 72 6 68.4183 6 64V26Z" fill="url(#folderYellowFront)" filter="url(#folderShadow)"/>
      <!-- 은은한 상단 하이라이트 라인 -->
      <line x1="12" y1="21" x2="88" y2="21" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>
    </svg>
  `;
}

// ==========================================================================
// 4. [필수] 화면 오른쪽 하단: 실시간 초 단위 갱신 시계 로직
// ==========================================================================
function updateRealtimeClock() {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = days[now.getDay()];
  
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  
  // 우측 하단 위젯 업데이트 (요구 포맷 예시: 2026. 11. 09 (월) 15:37:00)
  const widgetTimeEl = document.getElementById("realtimeClock");
  const widgetDateEl = document.getElementById("realtimeDate");
  const widgetMonthEl = document.getElementById("widgetMonth");
  const widgetDayEl = document.getElementById("widgetDay");
  
  if (widgetTimeEl) widgetTimeEl.textContent = `${hours}:${minutes}:${seconds}`;
  if (widgetDateEl) widgetDateEl.textContent = `${year}. ${month}. ${date} (${dayName})`;
  if (widgetMonthEl) widgetMonthEl.textContent = `${parseInt(month, 10)}월`;
  if (widgetDayEl) widgetDayEl.textContent = date;
  
  // 상단 메뉴바 간이 시계 업데이트
  const menuClockEl = document.getElementById("menuClock");
  if (menuClockEl) {
    menuClockEl.textContent = `${month}월 ${date}일 (${dayName}) ${hours}:${minutes}`;
  }
}

// ==========================================================================
// 5. 바탕화면 폴더 렌더링 & 클릭 인터랙션
// ==========================================================================
function renderFolderGrid() {
  const gridEl = document.getElementById("folderGrid");
  if (!gridEl) return;
  gridEl.innerHTML = "";

  projects.forEach((proj) => {
    const item = document.createElement("div");
    item.className = "folder-item";
    item.dataset.id = proj.id;
    item.title = `${proj.name} (클릭하여 열기)`;

    item.innerHTML = `
      ${getMacFolderSvg()}
      <span class="folder-name">${escapeHtml(proj.name)}</span>
    `;

    // 단일 클릭: 선택 하이라이트
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".folder-item").forEach(f => f.classList.remove("selected"));
      item.classList.add("selected");
    });

    // 더블클릭 또는 클릭: Finder 모달 팝업 오픈
    item.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      openFinder(proj.id);
    });

    // 모바일 터치 대응 (단일 탭으로도 열 수 있도록)
    let touchTime = 0;
    item.addEventListener("touchend", (e) => {
      const now = new Date().getTime();
      if (now - touchTime < 350) {
        openFinder(proj.id);
      }
      touchTime = now;
    });

    gridEl.appendChild(item);
  });

  // 사이드바 프로젝트 목록도 동기화
  renderSidebarList();
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, function(m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[m];
  });
}

// ==========================================================================
// 6. 우클릭 컨텍스트 메뉴 & 새 폴더 생성
// ==========================================================================
const contextMenu = document.getElementById("contextMenu");
const newFolderModal = document.getElementById("newFolderModal");
const newFolderInput = document.getElementById("newFolderInput");

function initContextMenu() {
  const desktop = document.getElementById("desktop");

  // 바탕화면 우클릭 이벤트
  desktop.addEventListener("contextmenu", (e) => {
    // 인풋창 내부가 아니면 기본 브라우저 메뉴 차단
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
      showContextMenu(e.clientX, e.clientY);
    }
  });

  // 아무 곳이나 클릭 시 컨텍스트 메뉴 닫기 & 폴더 선택 해제
  document.addEventListener("click", (e) => {
    hideContextMenu();
    if (!e.target.closest(".folder-item")) {
      document.querySelectorAll(".folder-item").forEach(f => f.classList.remove("selected"));
    }
  });

  // '새 폴더' 메뉴 클릭
  document.getElementById("ctxNewFolder")?.addEventListener("click", () => {
    hideContextMenu();
    openNewFolderDialog();
  });

  // Dock의 '새 폴더' 버튼
  document.getElementById("dockNewFolder")?.addEventListener("click", () => {
    openNewFolderDialog();
  });

  // '새로고침'
  document.getElementById("ctxRefresh")?.addEventListener("click", () => {
    hideContextMenu();
    renderFolderGrid();
  });

  // '아이콘 자동 정렬'
  document.getElementById("ctxCleanUp")?.addEventListener("click", () => {
    hideContextMenu();
    renderFolderGrid();
  });

  // '배경화면 테마 변경'
  document.getElementById("ctxChangeTheme")?.addEventListener("click", () => {
    hideContextMenu();
    toggleDesktopTheme();
  });

  // '개발자 프로필 보기'
  document.getElementById("ctxAboutMe")?.addEventListener("click", () => {
    hideContextMenu();
    openFinder("profile");
  });

  // 다이얼로그 확인 & 취소
  document.getElementById("btnCancelFolder")?.addEventListener("click", closeNewFolderDialog);
  document.getElementById("btnConfirmFolder")?.addEventListener("click", handleCreateFolder);

  newFolderInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleCreateFolder();
    } else if (e.key === "Escape") {
      closeNewFolderDialog();
    }
  });
}

function showContextMenu(x, y) {
  const menuWidth = 195;
  const menuHeight = 180;
  const maxX = window.innerWidth - menuWidth - 10;
  const maxY = window.innerHeight - menuHeight - 10;

  contextMenu.style.left = `${Math.min(x, maxX)}px`;
  contextMenu.style.top = `${Math.min(y, maxY)}px`;
  contextMenu.style.display = "block";
}

function hideContextMenu() {
  if (contextMenu) contextMenu.style.display = "none";
}

function openNewFolderDialog() {
  newFolderModal.style.display = "flex";
  newFolderInput.value = `새 프로젝트 ${projects.length + 1}`;
  setTimeout(() => {
    newFolderInput.focus();
    newFolderInput.select();
  }, 50);
}

function closeNewFolderDialog() {
  newFolderModal.style.display = "none";
}

function handleCreateFolder() {
  const name = newFolderInput.value.trim();
  if (!name) {
    alert("폴더 이름을 입력해주세요.");
    newFolderInput.focus();
    return;
  }

  const newProj = {
    id: "proj-" + Date.now(),
    name: name,
    badge: "신규 프로젝트",
    summary: "새로 등록된 포트폴리오 프로젝트 폴더입니다.",
    tags: ["Frontend", "HTML5", "CSS3", "JavaScript"],
    description: "이곳에 프로젝트에 대한 상세 설명, 주요 기여도, 트러블슈팅 경험 등을 자유롭게 작성할 수 있습니다.",
    features: [
      "프로젝트 주요 기능 1",
      "프로젝트 주요 기능 2",
      "반응형 웹 UI 및 성능 최적화"
    ],
    demoUrl: "https://github.com/hyun1216/WEBportfolio",
    repoUrl: "https://github.com/hyun1216/WEBportfolio",
    image: null,
    videoUrl: null
  };

  projects.push(newProj);
  saveProjects();
  renderFolderGrid();
  closeNewFolderDialog();

  // 바로 생성된 새 폴더 창 열어주기
  openFinder(newProj.id);
}

// 테마 토글 (Sonoma, Monterey, 기본)
const themes = ["", "theme-sonoma", "theme-monterey"];
let currentThemeIdx = 0;

function toggleDesktopTheme() {
  const desktop = document.getElementById("desktop");
  themes.forEach(t => t && desktop.classList.remove(t));
  currentThemeIdx = (currentThemeIdx + 1) % themes.length;
  if (themes[currentThemeIdx]) {
    desktop.classList.add(themes[currentThemeIdx]);
  }
  localStorage.setItem(THEME_STORAGE_KEY, themes[currentThemeIdx]);
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    const desktop = document.getElementById("desktop");
    desktop.classList.add(savedTheme);
    currentThemeIdx = themes.indexOf(savedTheme);
  }
}

// ==========================================================================
// 7. Finder 창 (모달) & 드래그, 신호등 버튼 로직
// ==========================================================================
const finderWindow = document.getElementById("finderWindow");
const windowHeader = document.getElementById("windowHeader");
const windowTitle = document.getElementById("windowTitle");
const finderContent = document.getElementById("finderContent");

let activeProjectId = null;
let isMaximized = false;
let isDragging = false;
let dragStartX = 0, dragStartY = 0;
let winStartX = 0, winStartY = 0;

function initFinder() {
  // 닫기
  document.getElementById("btnWinClose")?.addEventListener("click", closeFinder);
  // 최소화
  document.getElementById("btnWinMinimize")?.addEventListener("click", closeFinder);
  // 최대화
  document.getElementById("btnWinMaximize")?.addEventListener("click", toggleMaximizeFinder);

  // 헤더 드래그
  windowHeader?.addEventListener("mousedown", onDragStart);
  document.addEventListener("mousemove", onDragging);
  document.addEventListener("mouseup", onDragEnd);

  // 즐겨찾기 내비게이션
  document.getElementById("navAllProjects")?.addEventListener("click", () => {
    setActiveSidebarItem("navAllProjects");
    renderOverviewContent();
  });

  document.getElementById("navProfile")?.addEventListener("click", () => {
    setActiveSidebarItem("navProfile");
    renderProfileContent();
  });

  // Dock Finder 버튼
  document.getElementById("dockFinder")?.addEventListener("click", () => {
    openFinder("overview");
  });

  // Dock 및 상단 프로필 버튼
  document.getElementById("dockProfile")?.addEventListener("click", () => {
    openFinder("profile");
  });
  document.getElementById("profileQuickBtn")?.addEventListener("click", () => {
    openFinder("profile");
  });
}

function openFinder(targetId) {
  finderWindow.style.display = "flex";
  finderWindow.classList.remove("minimized");

  if (!targetId || targetId === "overview") {
    setActiveSidebarItem("navAllProjects");
    renderOverviewContent();
    windowTitle.textContent = "Finder - 전체 프로젝트";
  } else if (targetId === "profile") {
    setActiveSidebarItem("navProfile");
    renderProfileContent();
    windowTitle.textContent = "개발자 소개 (Profile)";
  } else {
    activeProjectId = targetId;
    setActiveSidebarItem(`sidebar-item-${targetId}`);
    renderProjectDetail(targetId);
  }
}

function closeFinder() {
  finderWindow.style.display = "none";
}

function toggleMaximizeFinder() {
  isMaximized = !isMaximized;
  if (isMaximized) {
    finderWindow.classList.add("maximized");
  } else {
    finderWindow.classList.remove("maximized");
  }
}

// 윈도우 드래그 구현
function onDragStart(e) {
  if (isMaximized) return;
  // 버튼 클릭 시 드래그 방지
  if (e.target.closest(".traffic-light") || e.target.closest(".tool-btn")) return;

  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  winStartX = finderWindow.offsetLeft;
  winStartY = finderWindow.offsetTop;
}

function onDragging(e) {
  if (!isDragging) return;
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;
  
  let newX = winStartX + dx;
  let newY = winStartY + dy;

  // 화면 경계 체크
  newY = Math.max(28, newY); // 상단 메뉴바 아래로 제한
  finderWindow.style.left = `${newX}px`;
  finderWindow.style.top = `${newY}px`;
}

function onDragEnd() {
  isDragging = false;
}

// 사이드바 프로젝트 목록 렌더링
function renderSidebarList() {
  const listEl = document.getElementById("sidebarProjectList");
  if (!listEl) return;
  listEl.innerHTML = "";

  projects.forEach((proj) => {
    const li = document.createElement("li");
    li.className = "sidebar-item";
    li.id = `sidebar-item-${proj.id}`;
    li.innerHTML = `
      <span class="item-icon">📂</span>
      <span class="item-name">${escapeHtml(proj.name)}</span>
    `;

    li.addEventListener("click", () => {
      activeProjectId = proj.id;
      setActiveSidebarItem(li.id);
      renderProjectDetail(proj.id);
    });

    listEl.appendChild(li);
  });
}

function setActiveSidebarItem(elementId) {
  document.querySelectorAll(".sidebar-item").forEach(item => {
    item.classList.remove("active");
  });
  const target = document.getElementById(elementId);
  if (target) target.classList.add("active");
}

// ==========================================================================
// 8. 뷰어 콘텐츠 렌더링 (프로젝트 상세 / 프로필 / 전체보기)
// ==========================================================================

// ① 프로젝트 상세 뷰 (텍스트 설명, 스크린샷 <img>, 시연 영상/데모 링크)
function renderProjectDetail(projectId) {
  const proj = projects.find(p => p.id === projectId);
  if (!proj) return;

  windowTitle.textContent = proj.name;

  const tagsHtml = (proj.tags || [])
    .map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`)
    .join("");

  const featuresHtml = (proj.features || [])
    .map(f => `<li>${escapeHtml(f)}</li>`)
    .join("");

  // 미디어 영역 (이미지가 있으면 <img>, 없으면 인터랙티브 목업 플레이스홀더)
  let mediaHtml = "";
  if (proj.image) {
    mediaHtml = `
      <div class="media-showcase-box">
        <img src="${escapeHtml(proj.image)}" alt="${escapeHtml(proj.name)} 스크린샷" class="media-screen-img" />
      </div>
    `;
  } else {
    mediaHtml = `
      <div class="media-showcase-box">
        <div class="media-mockup-placeholder">
          <span class="mockup-icon">💻</span>
          <p><strong>${escapeHtml(proj.name)}</strong> 스크린샷 준비 중</p>
          <span style="font-size:12px; opacity:0.8;">(스크린샷 이미지 또는 시연 영상을 언제든 연결할 수 있습니다)</span>
        </div>
      </div>
    `;
  }

  // 영상 임베드 영역 (videoUrl 존재 시)
  let videoHtml = "";
  if (proj.videoUrl) {
    videoHtml = `
      <div class="media-video-container">
        <video controls poster="">
          <source src="${escapeHtml(proj.videoUrl)}" type="video/mp4">
          브라우저가 비디오 재생을 지원하지 않습니다.
        </video>
      </div>
    `;
  }

  finderContent.innerHTML = `
    <div class="project-detail-view">
      <div class="project-header-banner">
        <div class="project-title-group">
          <h2>
            <span>📂</span>
            <span>${escapeHtml(proj.name)}</span>
            <span class="project-badge">${escapeHtml(proj.badge || "Project")}</span>
          </h2>
          <p class="project-summary-text">${escapeHtml(proj.summary || "")}</p>
        </div>
        <div class="project-actions">
          ${proj.demoUrl ? `<a href="${proj.demoUrl}" target="_blank" class="action-btn primary">라이브 데모 ↗</a>` : ""}
          ${proj.repoUrl ? `<a href="${proj.repoUrl}" target="_blank" class="action-btn secondary">GitHub ↗</a>` : ""}
        </div>
      </div>

      <div class="tech-stack-row">
        ${tagsHtml}
      </div>

      ${mediaHtml}
      ${videoHtml}

      <div class="section-block">
        <h3>📌 프로젝트 개요</h3>
        <p>${escapeHtml(proj.description || "상세 설명이 등록되지 않았습니다.")}</p>
      </div>

      <div class="section-block">
        <h3>✨ 핵심 기능 및 특징</h3>
        <ul class="feature-list">
          ${featuresHtml}
        </ul>
      </div>

      <div class="section-block" style="margin-top:28px; padding-top:16px; border-top:1px dashed #e1e4e8; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:12px; color:#888;">프로젝트 폴더 ID: ${proj.id}</span>
        <button class="action-btn secondary" style="font-size:11.5px; color:#c00;" onclick="handleDeleteProject('${proj.id}')">폴더 삭제</button>
      </div>
    </div>
  `;
}

// 프로젝트 삭제 핸들러
window.handleDeleteProject = function(projectId) {
  if (confirm("정말로 이 프로젝트 폴더를 바탕화면에서 삭제하시겠습니까?")) {
    projects = projects.filter(p => p.id !== projectId);
    saveProjects();
    renderFolderGrid();
    openFinder("overview");
  }
};

// ② 전체 프로젝트 모아보기 뷰
function renderOverviewContent() {
  const cardsHtml = projects.map(p => `
    <div class="overview-card" onclick="openFinder('${p.id}')">
      <div class="overview-folder-icon">${getMacFolderSvg()}</div>
      <div class="overview-title">${escapeHtml(p.name)}</div>
      <div class="overview-desc">${escapeHtml(p.summary || p.badge || "")}</div>
    </div>
  `).join("");

  finderContent.innerHTML = `
    <div class="project-detail-view">
      <div class="project-header-banner">
        <div class="project-title-group">
          <h2>전체 프로젝트 (${projects.length})</h2>
          <p class="project-summary-text">바탕화면의 폴더를 선택하거나 아래 카드를 클릭하여 세부 내용을 확인하세요.</p>
        </div>
        <button class="action-btn primary" onclick="openNewFolderDialog()">+ 새 폴더 생성</button>
      </div>
      <div class="overview-grid">
        ${cardsHtml}
      </div>
    </div>
  `;
}

// ③ [에셋 연동] 개발자 프로필 뷰 (로컬 ./me.JPG 직접 연결)
function renderProfileContent() {
  finderContent.innerHTML = `
    <div class="project-detail-view profile-view-card">
      <div class="profile-avatar-wrap">
        <img src="./me.JPG" alt="증명사진" class="profile-avatar-img" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23bbb%22><circle cx=%2212%22 cy=%228%22 r=%224%22/><path d=%22M4 20c0-4 4-6 8-6s8 2 8 6%22/></svg>'">
      </div>
      <h2 class="profile-name">Frontend Developer</h2>
      <p class="profile-role">macOS Inspired Portfolio</p>
      <p class="profile-bio">
        사용자 경험(UX)과 유려한 인터랙션 디자인에 몰입하는 프론트엔드 개발자입니다.<br/>
        복잡한 요구사항을 직관적이고 감성적인 웹 인터페이스로 설계하며,<br/>
        완성도 높은 디테일과 견고한 코드 품질을 최우선으로 지향합니다.
      </p>

      <div class="profile-links-row">
        <a href="https://github.com/hyun1216/WEBportfolio" target="_blank" class="action-btn primary">
          <span>🐙 GitHub Repository</span>
        </a>
        <button class="action-btn secondary" onclick="openFinder('overview')">
          <span>📁 프로젝트 둘러보기</span>
        </button>
      </div>
    </div>
  `;
}

// ==========================================================================
// 9. 초기화 실행
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  loadSavedTheme();
  renderFolderGrid();
  initContextMenu();
  initFinder();

  // 초 단위 실시간 시계 시작 (즉시 1회 실행 후 매초 갱신)
  updateRealtimeClock();
  setInterval(updateRealtimeClock, 1000);
});

