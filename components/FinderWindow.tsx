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
} from "lucide-react";

interface FinderWindowProps {
  isOpen: boolean;
  activeProject: Project | null;
  allProjects: Project[];
  activeTab: "project" | "profile" | "overview";
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  onSelectTab: (tab: "project" | "profile" | "overview") => void;
}

export default function FinderWindow({
  isOpen,
  activeProject,
  allProjects,
  activeTab,
  onClose,
  onSelectProject,
  onSelectTab,
}: FinderWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 120, y: 70 });
  const [size, setSize] = useState({ width: 880, height: 580 });
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

  // 초기 위치와 크기를 반응형으로 설정
  useEffect(() => {
    if (typeof window !== "undefined") {
      const w = Math.min(880, window.innerWidth - 40);
      const h = Math.min(580, window.innerHeight - 120);
      setSize({ width: w, height: h });
      setPosition({
        x: Math.max(20, Math.floor((window.innerWidth - w) / 2)),
        y: Math.max(40, Math.floor((window.innerHeight - h) / 2)),
      });
    }
  }, []);

  // 창 이동(드래그) 시작
  const handleMouseDown = (e: React.MouseEvent) => {
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
      style={
        isMaximized
          ? {
              top: "32px",
              left: "8px",
              width: "calc(100vw - 16px)",
              height: "calc(100vh - 40px)",
            }
          : {
              top: `${position.y}px`,
              left: `${position.x}px`,
              width: `${size.width}px`,
              height: `${size.height}px`,
            }
      }
      className={`fixed z-50 flex flex-col bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-2xl rounded-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/10 overflow-hidden ${
        isDragging || isResizing ? "transition-none select-none" : "animate-in fade-in zoom-in-95 duration-150"
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
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
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
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"
            title="GitHub 저장소 바로가기"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 윈도우 본문: 사이드바 + 메인 뷰어 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 사이드바 */}
        <aside className="w-52 bg-[#f4f4f6] dark:bg-[#252526] border-r border-black/10 dark:border-white/10 p-3 flex flex-col gap-4 shrink-0 overflow-y-auto">
          {/* 즐겨찾기 */}
          <div>
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 px-2 uppercase tracking-wider">
              Favorites
            </span>
            <ul className="mt-1 space-y-0.5 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab("overview")}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === "overview"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 shrink-0" />
                  <span>전체 프로젝트</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab("profile")}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === "profile"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span>개발자 소개 (Profile)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 프로젝트 목록 */}
          <div className="flex-1">
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 px-2 uppercase tracking-wider">
              Projects ({allProjects.length})
            </span>
            <ul className="mt-1 space-y-0.5 text-xs">
              {allProjects.map((p) => {
                const isActive = activeTab === "project" && activeProject?.id === p.id;
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => {
                        onSelectProject(p);
                        onSelectTab("project");
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md font-medium text-left truncate transition-colors ${
                        isActive
                          ? "bg-blue-500 text-white shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <Folder className="w-3.5 h-3.5 text-[#e8a716] shrink-0" />
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
          {/* 1. 개발자 프로필 탭 (public/me.JPG 직접 연결) */}
          {activeTab === "profile" && (
            <div className="max-w-2xl mx-auto flex flex-col items-center text-center py-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl mb-4">
                <Image
                  src="/me.JPG"
                  alt="개발자 프로필 사진"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Frontend / Full-stack Developer
              </h2>
              <p className="text-sm font-semibold text-blue-500 mt-1">
                macOS Inspired Interactive Portfolio
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 leading-relaxed max-w-lg break-keep">
                Git-as-a-CMS 아키텍처와 사용자 중심의 인터랙티브 인터페이스를 설계합니다.
                Next.js, TypeScript, Tailwind CSS를 기반으로 완성도 높은 웹 애플리케이션을 구현합니다.
              </p>
              <div className="flex gap-3 mt-6">
                <a
                  href="https://github.com/hyun1216/WEBportfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-semibold shadow-md transition-all"
                >
                  <Github className="w-4 h-4" />
                  GitHub 저장소
                </a>
                <button
                  onClick={() => onSelectTab("overview")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold transition-all"
                >
                  <LayoutGrid className="w-4 h-4" />
                  프로젝트 둘러보기
                </button>
              </div>
            </div>
          )}

          {/* 2. 전체 프로젝트 모아보기 탭 */}
          {activeTab === "overview" && (
            <div>
              <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  전체 프로젝트 탐색기
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  GitHub 저장소의 data/projects.json에서 불러온 프로젝트 목록입니다.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {allProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p);
                      onSelectTab("project");
                    }}
                    className="group border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md cursor-pointer transition-all bg-gray-50/50 dark:bg-gray-800/40"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <Folder className="w-5 h-5 text-[#e8a716]" />
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-blue-500 truncate">
                        {p.title}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {p.description || "상세 설명이 없습니다."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. 개별 프로젝트 상세 탭 */}
          {activeTab === "project" && activeProject && (
            <div className="space-y-6">
              {/* 상단 헤더 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Folder className="w-6 h-6 text-[#e8a716]" />
                    {activeProject.title}
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">
                    프로젝트 ID: {activeProject.id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {activeProject.link && (
                    <a
                      href={activeProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <span>라이브 데모</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <a
                    href="https://github.com/hyun1216/WEBportfolio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold transition-all"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>저장소</span>
                  </a>
                </div>
              </div>

              {/* 스크린샷 이미지 뷰어 */}
              <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 shadow-inner">
                {activeProject.image ? (
                  <Image
                    src={activeProject.image}
                    alt={`${activeProject.title} 스크린샷`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                    <Folder className="w-12 h-12 stroke-[1.2]" />
                    <span className="text-xs">등록된 스크린샷이 없습니다</span>
                  </div>
                )}
              </div>

              {/* 프로젝트 상세 설명 */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  📌 프로젝트 개요 및 설명
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line break-keep">
                  {activeProject.description || "등록된 상세 설명이 없습니다."}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
