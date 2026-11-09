"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Project } from "@/types/project";
import {
  ExternalLink,
  Github,
  Folder,
  User,
  LayoutGrid,
  Maximize2,
  Minimize2,
  X,
  Minus,
  Briefcase,
  Calendar,
  CheckCircle2,
  Lightbulb,
  Wrench,
  Cpu,
  ShieldCheck,
  Layers,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Target,
  CheckSquare,
  Compass,
  Flame,
  Lock,
} from "lucide-react";

interface FinderWindowProps {
  id: string;
  zIndex?: number;
  isOpen?: boolean;
  activeProject: Project | null;
  allProjects: Project[];
  activeTab: "project" | "profile" | "overview";
  initialOffset?: number;
  onFocus?: () => void;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  onSelectTab: (tab: "project" | "profile" | "overview") => void;
}

export default function FinderWindow({
  id,
  zIndex = 50,
  isOpen = true,
  activeProject,
  allProjects,
  activeTab,
  initialOffset = 0,
  onFocus,
  onClose,
  onSelectProject,
  onSelectTab,
}: FinderWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 80, y: 48 });
  const [size, setSize] = useState({ width: 1200, height: 750 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, winX: 0, winY: 0 });
  const resizeStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    winX: 0,
    winY: 0,
    winWidth: 0,
    winHeight: 0,
    direction: "",
  });

  // 초기 위치와 크기를 넉넉하고 시원한 기본 크기(가로 1200px, 세로 750px)로 반응형 설정
  useEffect(() => {
    if (typeof window !== "undefined") {
      const targetW = 1200;
      const targetH = 750;

      // 우측 바탕화면 폴더 아이콘 영역(약 280px)을 확보할 수 있는 대형 화면이면 80px에서 시작, 작은 화면이면 중앙 정렬
      const availableW = window.innerWidth >= 1400 ? window.innerWidth - 280 : window.innerWidth - 40;
      const w = Math.max(480, Math.min(targetW, availableW));
      const h = Math.max(360, Math.min(targetH, window.innerHeight - 130));

      setSize({ width: w, height: h });

      const baseX = window.innerWidth >= 1400 ? 80 : Math.max(20, Math.floor((window.innerWidth - w) / 2));
      const baseY = 48;

      setPosition({
        x: Math.min(window.innerWidth - 100, Math.max(20, baseX + initialOffset)),
        y: Math.min(window.innerHeight - 100, Math.max(36, baseY + initialOffset)),
      });
    }
  }, [initialOffset]);

  // 창 이동(드래그) 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus?.();
    if (isMaximized) return;
    if ((e.target as HTMLElement).closest("button")) return;

    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winX: position.x,
      winY: position.y,
    };
  };

  // 모서리/테두리 크기 조절(리사이즈) 시작
  const handleResizeStart = (
    e: React.MouseEvent,
    direction: "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw"
  ) => {
    if (isMaximized) return;
    e.stopPropagation();
    e.preventDefault();

    setIsResizing(true);
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winX: position.x,
      winY: position.y,
      winWidth: size.width,
      winHeight: size.height,
      direction,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 1. 드래그 이동
      if (isDragging) {
        const dx = e.clientX - dragStartRef.current.mouseX;
        const dy = e.clientY - dragStartRef.current.mouseY;

        const newY = Math.max(32, dragStartRef.current.winY + dy);
        const newX = dragStartRef.current.winX + dx;
        setPosition({ x: newX, y: newY });
        return;
      }

      // 2. 모서리 크기 조절 (리사이즈)
      if (isResizing) {
        const dx = e.clientX - resizeStartRef.current.mouseX;
        const dy = e.clientY - resizeStartRef.current.mouseY;
        const { winX, winY, winWidth, winHeight, direction } = resizeStartRef.current;

        const minW = 460;
        const minH = 320;

        let newW = winWidth;
        let newH = winHeight;
        let newX = winX;
        let newY = winY;

        // 가로 조절 (East / West)
        if (direction.includes("e")) {
          newW = Math.max(minW, winWidth + dx);
        } else if (direction.includes("w")) {
          const possibleW = winWidth - dx;
          if (possibleW >= minW) {
            newW = possibleW;
            newX = winX + dx;
          } else {
            newW = minW;
            newX = winX + (winWidth - minW);
          }
        }

        // 세로 조절 (South / North)
        if (direction.includes("s")) {
          newH = Math.max(minH, winHeight + dy);
        } else if (direction.includes("n")) {
          const possibleH = winHeight - dy;
          if (possibleH >= minH) {
            const potentialY = winY + dy;
            if (potentialY >= 32) {
              newH = possibleH;
              newY = potentialY;
            }
          } else {
            newH = minH;
            newY = winY + (winHeight - minH);
          }
        }

        setSize({ width: newW, height: newH });
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing]);

  if (!isOpen) return null;

  return (
    <div
      onMouseDown={() => onFocus?.()}
      style={
        isMaximized
          ? {
              top: "32px",
              left: "8px",
              width: "calc(100vw - 16px)",
              height: "calc(100vh - 40px)",
              zIndex,
              isolation: "isolate",
              transform: "translate3d(0, 0, 0)",
            }
          : {
              top: `${position.y}px`,
              left: `${position.x}px`,
              width: `${size.width}px`,
              height: `${size.height}px`,
              zIndex,
              isolation: "isolate",
              transform: "translate3d(0, 0, 0)",
            }
      }
      className={`fixed flex flex-col bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl border border-black/15 dark:border-white/10 overflow-hidden ${
        isDragging || isResizing ? "transition-none select-none" : "animate-in fade-in duration-100"
      }`}
    >
      {/* ====================================================================
          macOS 창 크기 조절 리사이즈 핸들 (8개 방향)
          ==================================================================== */}
      {!isMaximized && (
        <>
          {/* 모서리 (Corners) */}
          <div
            onMouseDown={(e) => handleResizeStart(e, "nw")}
            className="absolute top-0 left-0 w-3.5 h-3.5 cursor-nwse-resize z-50"
            title="크기 조절"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "ne")}
            className="absolute top-0 right-0 w-3.5 h-3.5 cursor-nesw-resize z-50"
            title="크기 조절"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "sw")}
            className="absolute bottom-0 left-0 w-3.5 h-3.5 cursor-nesw-resize z-50"
            title="크기 조절"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "se")}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 flex items-end justify-end p-0.5"
            title="크기 조절"
          >
            {/* 우측 하단 macOS 특유의 그립 심볼 */}
            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 opacity-40 fill-gray-500 pointer-events-none">
              <circle cx="8" cy="8" r="1" />
              <circle cx="5" cy="8" r="1" />
              <circle cx="8" cy="5" r="1" />
              <circle cx="2" cy="8" r="1" />
              <circle cx="5" cy="5" r="1" />
              <circle cx="8" cy="2" r="1" />
            </svg>
          </div>

          {/* 테두리 변 (Edges) */}
          <div
            onMouseDown={(e) => handleResizeStart(e, "n")}
            className="absolute top-0 left-3.5 right-3.5 h-1.5 cursor-ns-resize z-40"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "s")}
            className="absolute bottom-0 left-3.5 right-3.5 h-1.5 cursor-ns-resize z-40"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "w")}
            className="absolute left-0 top-3.5 bottom-3.5 w-1.5 cursor-ew-resize z-40"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "e")}
            className="absolute right-0 top-3.5 bottom-3.5 w-1.5 cursor-ew-resize z-40"
          />
        </>
      )}
      {/* 윈도우 상단 타이틀바 & 신호등 버튼 */}
      <div
        onMouseDown={handleMouseDown}
        className="h-12 bg-[#ececee] dark:bg-[#2d2d2d] border-b border-black/10 dark:border-white/10 px-4 flex items-center justify-between select-none cursor-grab active:cursor-grabbing"
      >
        {/* 신호등 버튼 */}
        <div className="flex items-center gap-2 group/lights">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] flex items-center justify-center text-[#4d0000] opacity-90 hover:opacity-100"
            title="닫기"
          >
            <X className="w-2 h-2 opacity-0 group-hover/lights:opacity-100" />
          </button>
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] flex items-center justify-center text-[#5c3b00] opacity-90 hover:opacity-100"
            title="최소화"
          >
            <Minus className="w-2 h-2 opacity-0 group-hover/lights:opacity-100" />
          </button>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] flex items-center justify-center text-[#004d10] opacity-90 hover:opacity-100"
            title="최대화"
          >
            {isMaximized ? (
              <Minimize2 className="w-2 h-2 opacity-0 group-hover/lights:opacity-100" />
            ) : (
              <Maximize2 className="w-2 h-2 opacity-0 group-hover/lights:opacity-100" />
            )}
          </button>
        </div>

        {/* 창 타이틀 */}
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <Folder className="w-4 h-4 text-[#e8a716]" />
          <span>
            {activeTab === "profile"
              ? "개발자 소개 (Profile)"
              : activeTab === "overview"
              ? "전체 프로젝트 탐색기"
              : activeProject?.title || "Finder"}
          </span>
        </div>

        {/* 우측 퀵 액션 */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/hyun1216/WEBportfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"
            title="GitHub 저장소 바로가기"
          >
            <Github className="w-4.5 h-4.5" />
          </a>
        </div>
      </div>

      {/* 윈도우 본문: 사이드바 + 메인 뷰어 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 사이드바 */}
        <aside className="w-60 bg-[#f4f4f6] dark:bg-[#252526] border-r border-black/10 dark:border-white/10 p-3.5 flex flex-col gap-5 shrink-0 overflow-y-auto">
          {/* 즐겨찾기 */}
          <div>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 px-2 uppercase tracking-wider">
              Favorites
            </span>
            <ul className="mt-1.5 space-y-1.5 text-sm sm:text-[15px]">
              <li>
                <button
                  onClick={() => onSelectTab("overview")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "overview"
                      ? "bg-blue-500 text-white shadow-sm font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <LayoutGrid className="w-4.5 h-4.5 shrink-0" />
                  <span>전체 프로젝트</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("profile")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "profile"
                      ? "bg-blue-500 text-white shadow-sm font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <User className="w-4.5 h-4.5 shrink-0" />
                  <span>개발자 소개 (Profile)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 프로젝트 목록 */}
          <div className="flex-1">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 px-2 uppercase tracking-wider">
              Projects ({allProjects.length})
            </span>
            <ul className="mt-1.5 space-y-1 text-sm sm:text-[14.5px]">
              {allProjects.map((p) => {
                const isActive = activeTab === "project" && activeProject?.id === p.id;
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => {
                        onSelectProject(p);
                        onSelectTab("project");
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg font-medium text-left truncate transition-colors ${
                        isActive
                          ? "bg-blue-500 text-white shadow-sm font-semibold"
                          : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <Folder className="w-4.5 h-4.5 text-[#e8a716] shrink-0" />
                      <span className="truncate">{p.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* 메인 뷰어 영역 */}
        <main className="flex-1 overflow-y-auto p-6 bg-white dark:bg-[#1e1e1e]">
          {/* 1. 개발자 프로필 탭 (public/me.JPG 및 경력 사항 연동) */}
          {activeTab === "profile" && (
            <div className="max-w-3xl mx-auto py-2 space-y-8 animate-in fade-in duration-200">
              {/* 상단 프로필 헤더 카드 */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl bg-gradient-to-b from-gray-50/80 to-gray-100/50 dark:from-gray-800/60 dark:to-gray-850/40 border border-gray-200/80 dark:border-gray-700/60 shadow-sm">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-white dark:border-gray-700 shadow-md shrink-0">
                  <Image
                    src="/me.JPG"
                    alt="개발자 프로필 사진"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800 mb-2">
                    <span>Automation Engineer & Developer</span>
                  </div>
                  <h2 className="text-2xl sm:text-3.5xl font-extrabold text-gray-900 dark:text-white">
                    RPA & AI 자동화 엔지니어 / 풀스택 개발자
                  </h2>
                  <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mt-3.5 leading-relaxed break-keep font-medium">
                    고객사 맞춤형 자동화 아키텍처 설계부터 대규모 데이터 스크래핑, 과오납 환급 파이프라인, 전사 ERP 배치 모니터링까지
                    비즈니스 생산성을 극대화하는 견고하고 신뢰도 높은 자동화 시스템을 구축합니다.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center sm:justify-start mt-4.5">
                    <a
                      href="https://github.com/hyun1216/WEBportfolio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-sm sm:text-base font-semibold shadow-sm transition-all"
                    >
                      <Github className="w-4.5 h-4.5" />
                      <span>GitHub 저장소</span>
                    </a>
                    <button
                      onClick={() => onSelectTab("overview")}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm sm:text-base font-semibold border border-gray-200 dark:border-gray-700 transition-all"
                    >
                      <LayoutGrid className="w-4.5 h-4.5" />
                      <span>프로젝트 목록 둘러보기</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 1. 성향 및 업무 스타일 섹션 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2.5 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold text-lg sm:text-xl">
                  <Sparkles className="w-5.5 h-5.5 text-amber-500" />
                  <span>성향 및 업무 스타일 (Work Style & Vision)</span>
                </div>

                <div className="grid grid-cols-1 gap-4.5">
                  {/* 장점 */}
                  <div className="p-5.5 sm:p-6 rounded-2xl bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/80 shadow-sm space-y-3 hover:border-amber-400 dark:hover:border-amber-500 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                        <Flame className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                        장점 (Strengths) <span className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded ml-2">빠른 실행력 & 확장적 사고</span>
                      </h4>
                    </div>
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed pl-11 break-keep font-medium">
                      문제를 발견하면 망설이지 않고 즉각 프로토타입으로 구체화하는 실행력과 확장적 사고가 저의 가장 큰 무기입니다. 복잡한 아이디어를 가지나무처럼 구조화하고, AI 도구와 최신 기술 스택을 적극 활용해 빠른 속도로 실제 동작하는 서비스와 자동화 파이프라인을 완성합니다. 단순히 주어진 스펙대로 코드를 타이핑하는 것을 넘어, 비즈니스 흐름 전체를 읽고 데이터 파이프라인과 사용자 경험의 개선점을 능동적으로 찾아내어 솔루션으로 연결하는 데 강점이 있습니다.
                    </p>
                  </div>

                  {/* 단점 및 극복 노력 */}
                  <div className="p-5.5 sm:p-6 rounded-2xl bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/80 shadow-sm space-y-3 hover:border-blue-400 dark:hover:border-blue-500 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                        <CheckSquare className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                        단점 및 극복 노력 (Weaknesses & Mitigation) <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 rounded ml-2">시각적 체크리스트 루틴화</span>
                      </h4>
                    </div>
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed pl-11 break-keep font-medium">
                      새로운 기술이나 프로젝트에 대한 초기 몰입도와 실행력이 매우 뛰어난 반면, 익숙해지는 단계에서는 다소 흥미가 떨어지는 경향이 있었습니다. 이를 완벽히 보완하기 위해 모든 업무를 잘게 쪼개어 &apos;체크리스트&apos;화 하고 매일 해야 할 일을 시각적으로 정리하는 루틴을 만들었습니다. 작은 성취를 눈으로 확인하며 스스로 동기부여를 지속하는 시스템을 갖추고 있습니다.
                    </p>
                  </div>

                  {/* 포부 */}
                  <div className="p-5.5 sm:p-6 rounded-2xl bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/80 shadow-sm space-y-3 hover:border-purple-400 dark:hover:border-purple-500 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                        <Compass className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                        포부 (Vision) <span className="text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded ml-2">지능형 자동화 전문가</span>
                      </h4>
                    </div>
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed pl-11 break-keep font-medium">
                      단순 반복 업무의 자동화를 넘어, AI 에이전트와 레거시 시스템, 모던 웹 환경을 유기적으로 엮어 비즈니스의 중단 없는 흐름을 만드는 지능형 자동화 전문가로 나아가고자 합니다. 빠른 실행력과 AI 오케스트레이션 역량, 그리고 탄탄한 시스템 관리 루틴을 결합하여, 기업의 생산성을 극적으로 끌어올리는 확장 가능한 자동화 생태계를 구축하겠습니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. 경력 사항 (Work Experience) 섹션 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2.5 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold text-lg sm:text-xl">
                  <Briefcase className="w-5.5 h-5.5 text-blue-500" />
                  <span>주요 경력 사항 (Work Experience)</span>
                </div>

                <div className="space-y-4">
                  {/* 경력 1: 마이닝오천 */}
                  <div className="p-5.5 sm:p-6 rounded-2xl bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/80 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                        <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                          마이닝오천 <span className="font-normal text-gray-400">|</span> RPA & AI 자동화 개발 및 유지보수
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-md w-fit">
                        <Calendar className="w-4 h-4" />
                        <span>2026.04 ~ 현재 (재직중)</span>
                      </div>
                    </div>
                    <ul className="mt-3.5 space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 pl-5 list-disc marker:text-emerald-500 leading-relaxed font-medium">
                      <li>고객사별 업무 요건 분석 기반 맞춤형 자동화 아키텍처 설계</li>
                      <li>레거시 상용 RPA(Brity, Worktronics 등) 워크플로의 Python 기반 전환 및 리팩터링</li>
                      <li>세무·노무 데이터 처리 자동화 및 이기종 RPA 솔루션 유지보수·트러블슈팅</li>
                    </ul>
                  </div>

                  {/* 경력 2: 세무법인 */}
                  <div className="p-5.5 sm:p-6 rounded-2xl bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/80 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                        <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                          세무법인 <span className="font-normal text-gray-400">|</span> RPA 상주 개발 및 유지보수
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-md w-fit">
                        <Calendar className="w-4 h-4" />
                        <span>2025.03 ~ 2026.04 (1년 1개월)</span>
                      </div>
                    </div>
                    <ul className="mt-3.5 space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 pl-5 list-disc marker:text-blue-500 leading-relaxed font-medium">
                      <li>세무·회계 데이터 정규화 및 과오납 환급/경정청구 자동화 파이프라인 구축</li>
                      <li>2차 인증(OTP, 인증서) 및 세션 보안 구간 예외 처리를 포함한 안정적 DataOps 구축</li>
                      <li>홈택스·위택스·4대보험 연계 포털 대상 대량 데이터 자동 스크래핑 및 접수 자동화</li>
                      <li>Node-RED 기반 워크플로 및 Telegram Bot 연동을 통한 실시간 배치 상태 알림 및 운영 제어 체계(ChatOps) 구축</li>
                    </ul>
                  </div>

                  {/* 경력 3: 대기업 마트 본사 */}
                  <div className="p-5.5 sm:p-6 rounded-2xl bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/80 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-purple-500 shrink-0" />
                        <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                          대기업 마트 본사 <span className="font-normal text-gray-400">|</span> IS RPA 상주 개발 및 유지보수
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-950/50 px-3 py-1 rounded-md w-fit">
                        <Calendar className="w-4 h-4" />
                        <span>2021.08 ~ 2024.10 (3년 2개월)</span>
                      </div>
                    </div>
                    <ul className="mt-3.5 space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 pl-5 list-disc marker:text-purple-500 leading-relaxed font-medium">
                      <li>SAP ERP 데이터 추출, 일일 재고/매출 지표 리포팅 등 전사 반복 업무 자동화 총괄</li>
                      <li>경쟁사 가격 모니터링 및 대량 유통 데이터 자동 수집 배치 파이프라인 운영</li>
                      <li>무중단 배치를 위한 일일 작업 모니터링 체계 구축 및 장애 대응</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3. 학력 사항 (Education) - 맨 아래 배치 */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-2.5 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold text-lg sm:text-xl">
                  <GraduationCap className="w-5.5 h-5.5 text-indigo-500" />
                  <span>학력 사항 (Education)</span>
                </div>

                <div className="p-5.5 sm:p-6 rounded-2xl bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/80 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-indigo-500 shrink-0" />
                      <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                        한양사이버대학교 <span className="font-normal text-gray-400">|</span> 소프트웨어응용학과
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-md w-fit">
                      <Calendar className="w-4 h-4" />
                      <span>2022.03 ~ 2028.02 (예정)</span>
                    </div>
                  </div>
                  <ul className="mt-3.5 space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 pl-5 list-disc marker:text-indigo-500 leading-relaxed font-medium">
                    <li>소프트웨어응용학과 4학년 재학 중</li>
                    <li>컴퓨터 공학 기초 및 응용 소프트웨어 개발 역량 강화 중</li>
                    <li>실무 업무와 학업을 병행하며 꾸준히 학습하고 성장하고 있습니다.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 2. 전체 프로젝트 모아보기 탭 */}
          {activeTab === "overview" && (
            <div>
              <div className="mb-7 pb-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  전체 프로젝트 탐색기
                </h2>
                <p className="text-base text-gray-500 mt-2">
                  등록된 {allProjects.length}개의 프로젝트 목록입니다. 클릭하여 상세 설명과 링크를 확인하세요.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {allProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p);
                      onSelectTab("project");
                    }}
                    className="group border border-gray-200 dark:border-gray-800 rounded-2xl p-5.5 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg cursor-pointer transition-all bg-gray-50/60 dark:bg-gray-800/40 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="w-6 h-6 text-[#e8a716] shrink-0" />
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white group-hover:text-blue-500 truncate">
                        {p.title}
                      </h3>
                    </div>
                    {p.subtitle && (
                      <p className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 line-clamp-1">
                        {p.subtitle}
                      </p>
                    )}
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                      {p.description || "상세 설명이 없습니다."}
                    </p>
                    {p.tags && p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {p.tags.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                          >
                            {t}
                          </span>
                        ))}
                        {p.tags.length > 3 && (
                          <span className="text-[11px] text-gray-400 self-center">
                            +{p.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. 개별 프로젝트 상세 탭 */}
          {activeTab === "project" && activeProject && (
            <div className="space-y-7 max-w-4xl mx-auto pb-8">
              {/* 상단 헤더 */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-gray-200 dark:border-gray-800">
                <div className="space-y-2 flex-1">
                  <h1 className="text-2xl sm:text-3.5xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                    <Folder className="w-8 h-8 text-[#e8a716] shrink-0" />
                    <span>{activeProject.title}</span>
                  </h1>
                  {activeProject.subtitle && (
                    <p className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                      {activeProject.subtitle}
                    </p>
                  )}
                  {activeProject.tags && activeProject.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1.5">
                      {activeProject.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold text-xs sm:text-sm border border-blue-200 dark:border-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 링크 & 상태 버튼 */}
                <div className="flex flex-wrap items-center gap-3 shrink-0 pt-1">
                  {/* 라이브 데모 버튼 */}
                  {activeProject.demoUrl ? (
                    <a
                      href={activeProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all shrink-0 whitespace-nowrap"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-4.5 h-4.5" />
                    </a>
                  ) : activeProject.id === "6" ? (
                    <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-semibold border border-gray-200 dark:border-gray-700 shrink-0 whitespace-nowrap">
                      <span>Live Demo 진행중</span>
                    </span>
                  ) : null}

                  {/* GitHub 저장소 버튼 / Private 뱃지 */}
                  {activeProject.githubUrl ? (
                    <a
                      href={activeProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-sm sm:text-base font-semibold shadow-md transition-all shrink-0 whitespace-nowrap"
                    >
                      <Github className="w-4.5 h-4.5" />
                      <span>Repository</span>
                    </a>
                  ) : activeProject.isPrivate ? (
                    <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs sm:text-sm font-semibold shrink-0 whitespace-nowrap">
                      <Lock className="w-4 h-4 text-amber-600" />
                      <span>Private Repository</span>
                    </span>
                  ) : null}
                </div>
              </div>

              {/* 스크린샷 이미지 뷰어 */}
              <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 shadow-sm">
                {activeProject.image ? (
                  <Image
                    src={activeProject.image}
                    alt={`${activeProject.title} 스크린샷`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                    <Folder className="w-14 h-14 stroke-[1.2]" />
                    <span className="text-base font-medium">등록된 스크린샷이 없습니다</span>
                  </div>
                )}
              </div>

              {/* 기본 개요 설명 */}
              {activeProject.description && (
                <div className="p-6 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200/90 dark:border-gray-700/80 space-y-2.5 shadow-sm">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>📌 프로젝트 개요 및 설명</span>
                  </h3>
                  <p className="text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed break-keep font-medium">
                    {activeProject.description}
                  </p>
                </div>
              )}

              {/* 1. 💡 프로젝트 요약 (Summary) 섹션 */}
              {activeProject.summary && (
                <div className="p-6 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-lg">
                    <Lightbulb className="w-5.5 h-5.5 shrink-0 text-amber-500" />
                    <span>프로젝트 요약</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                    {activeProject.summary.background && (
                      <p>
                        <strong className="text-gray-900 dark:text-white font-bold">• 배경:</strong>{" "}
                        {activeProject.summary.background}
                      </p>
                    )}
                    {activeProject.summary.role && (
                      <p>
                        <strong className="text-gray-900 dark:text-white font-bold">• 핵심 역할:</strong>{" "}
                        {activeProject.summary.role}
                      </p>
                    )}
                    {activeProject.summary.philosophy && (
                      <p>
                        <strong className="text-gray-900 dark:text-white font-bold">• 설계 철학:</strong>{" "}
                        <span className="bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded font-semibold text-amber-950 dark:text-amber-200">
                          {activeProject.summary.philosophy}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 2. 🛠️ 엔지니어링 핵심 특장점 */}
              {activeProject.features && activeProject.features.length > 0 && (
                <div className="space-y-4 pt-1">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold text-lg sm:text-xl">
                    <Wrench className="w-5.5 h-5.5 text-blue-500" />
                    <span>엔지니어링 핵심 특장점</span>
                  </div>
                  <div className="space-y-4">
                    {activeProject.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 shadow-sm space-y-3"
                      >
                        <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2.5">
                          <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                          <span>{feat.title}</span>
                        </h4>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 pl-7.5 leading-relaxed font-medium">
                          {feat.desc}
                        </p>
                        {feat.subitems && feat.subitems.length > 0 && (
                          <div className="pl-7.5 space-y-2.5 pt-1">
                            {feat.subitems.map((sub, sIdx) => {
                              // 11단계 파이프라인 텍스트일 경우 시각적 배지 형태로 렌더링
                              if (sub.includes("➔")) {
                                const steps = sub.split("➔").map((s) => s.trim());
                                return (
                                  <div
                                    key={sIdx}
                                    className="flex flex-wrap items-center gap-2.5 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 text-xs sm:text-sm"
                                  >
                                    {steps.map((st, i) => (
                                      <React.Fragment key={i}>
                                        <span
                                          className={`px-3 py-1.5 rounded-lg font-semibold ${
                                            st.includes("검토")
                                              ? "bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-700 shadow-sm"
                                              : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                                          }`}
                                        >
                                          {st}
                                        </span>
                                        {i < steps.length - 1 && (
                                          <ArrowRight className="w-4 h-4 text-gray-400" />
                                        )}
                                      </React.Fragment>
                                    ))}
                                  </div>
                                );
                              }
                              return (
                                <div
                                  key={sIdx}
                                  className="text-sm sm:text-base text-gray-700 dark:text-gray-300 flex items-start gap-2.5"
                                >
                                  <span className="text-blue-500 font-bold mt-0.5">•</span>
                                  <span className="leading-relaxed">{sub}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. 💻 기술 스택 (Tech Stack Table) */}
              {activeProject.techStackTable && activeProject.techStackTable.length > 0 && (
                <div className="space-y-4 pt-1">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold text-lg sm:text-xl">
                    <Cpu className="w-5.5 h-5.5 text-purple-500" />
                    <span>기술 스택 (Tech Stack)</span>
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-sm">
                    <table className="w-full text-left text-sm sm:text-base">
                      <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 font-bold border-b border-gray-200 dark:border-gray-700 text-sm sm:text-base">
                        <tr>
                          <th className="py-3.5 px-4.5 w-44">구분</th>
                          <th className="py-3.5 px-4.5">사용 기술 및 라이브러리</th>
                          <th className="py-3.5 px-4.5">적용 목적</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900/40 text-gray-700 dark:text-gray-300">
                        {activeProject.techStackTable.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40">
                            <td className="py-3.5 px-4.5 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                              {row.category}
                            </td>
                            <td className="py-3.5 px-4.5 font-mono text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-bold">
                              {row.skills}
                            </td>
                            <td className="py-3.5 px-4.5 leading-relaxed">{row.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
