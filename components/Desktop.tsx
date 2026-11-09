"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Project } from "@/types/project";
import FolderIcon from "./FolderIcon";
import FinderWindow from "./FinderWindow";
import Taskbar from "./Taskbar";
import ContextMenu from "./ContextMenu";
import NewFolderModal from "./NewFolderModal";
import {
  Folder,
  FolderPlus,
  Github,
  Trash2,
  Wifi,
  Battery,
  SlidersHorizontal,
  Coffee,
} from "lucide-react";

interface DesktopProps {
  initialProjects: Project[];
}

export interface WindowState {
  id: string; // e.g. "overview", "profile", `project-${project.id}`
  title: string;
  tab: "project" | "profile" | "overview";
  project: Project | null;
  zIndex: number;
  initialOffset: number;
}

export default function Desktop({ initialProjects }: DesktopProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // 멀티 윈도우 목록 & zIndex 관리
  const [windows, setWindows] = useState<WindowState[]>([]);
  const highestZIndexRef = useRef(100);

  // 상단 메뉴바 도움말 드롭다운 상태
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);

  // 컨텍스트 메뉴 상태
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
  }>({ isOpen: false, x: 0, y: 0 });

  // 새 폴더 모달 상태
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);

  // 배경화면 테마 토글 (Sonoma, Monterey 등)
  const [wallpaperIndex, setWallpaperIndex] = useState(0);

  // Supabase API로부터 최신 목록 새로고침
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/folders", { cache: "no-store" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProjects(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // 창을 최상위 z-index로 맨 앞으로 올리는 함수
  const bringToFront = useCallback((windowId: string) => {
    const nextZ = ++highestZIndexRef.current;
    setWindows((wList) =>
      wList.map((w) => (w.id === windowId ? { ...w, zIndex: nextZ } : w))
    );
  }, []);

  // 바탕화면 빈 공간 우클릭 핸들러
  const handleContextMenu = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
      e.preventDefault();
      setIsHelpMenuOpen(false);
      setContextMenu({
        isOpen: true,
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  // 바탕화면 클릭 시 메뉴 닫기 & 폴더 선택 해제
  const handleDesktopClick = () => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
    setIsHelpMenuOpen(false);
    setSelectedFolderId(null);
  };

  // 폴더 더블클릭 시 Finder 오픈 (원자적 체크로 중복 창 절대 방지)
  const handleOpenFolder = useCallback((project: Project) => {
    const windowId = `project-${project.id}`;

    setWindows((prev) => {
      const nextZ = ++highestZIndexRef.current;
      // 이미 열려 있으면 최상위 z-index로 맨 앞 포커싱만 수행 (새 창 추가 절대 방지)
      const exists = prev.some((w) => w.id === windowId);
      if (exists) {
        return prev.map((w) =>
          w.id === windowId ? { ...w, zIndex: nextZ } : w
        );
      }

      // 없을 때만 단 1개의 새 창 생성
      const offset = (prev.length * 28) % 180;
      return [
        ...prev,
        {
          id: windowId,
          title: project.title,
          tab: "project",
          project,
          zIndex: nextZ,
          initialOffset: offset,
        },
      ];
    });
  }, []);

  // 프로필 보기 열기 (원자적 체크로 동일 창 존재 시 포커싱)
  const handleOpenProfile = useCallback(() => {
    const windowId = "profile";

    setWindows((prev) => {
      const nextZ = ++highestZIndexRef.current;
      const exists = prev.some((w) => w.id === windowId);
      if (exists) {
        return prev.map((w) =>
          w.id === windowId ? { ...w, zIndex: nextZ } : w
        );
      }

      const offset = (prev.length * 28) % 180;
      return [
        ...prev,
        {
          id: windowId,
          title: "개발자 소개 (Profile)",
          tab: "profile",
          project: null,
          zIndex: nextZ,
          initialOffset: offset,
        },
      ];
    });
  }, []);

  // 전체 프로젝트 모아보기 열기 (원자적 체크로 동일 창 존재 시 포커싱)
  const handleOpenOverview = useCallback(() => {
    const windowId = "overview";

    setWindows((prev) => {
      const nextZ = ++highestZIndexRef.current;
      const exists = prev.some((w) => w.id === windowId);
      if (exists) {
        return prev.map((w) =>
          w.id === windowId ? { ...w, zIndex: nextZ } : w
        );
      }

      const offset = (prev.length * 28) % 180;
      return [
        ...prev,
        {
          id: windowId,
          title: "전체 프로젝트 탐색기",
          tab: "overview",
          project: null,
          zIndex: nextZ,
          initialOffset: offset,
        },
      ];
    });
  }, []);

  // 창 닫기
  const handleCloseWindow = (windowId: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId));
  };

  // 창 내부에서 탭 변경 시
  const handleSelectTabInWindow = (
    windowId: string,
    tab: "project" | "profile" | "overview"
  ) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, tab } : w))
    );
  };

  // 창 내부에서 프로젝트 선택 시
  const handleSelectProjectInWindow = (windowId: string, project: Project) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId
          ? { ...w, tab: "project", project, title: project.title }
          : w
      )
    );
  };

  // 새 폴더 생성 완료 콜백
  const handleFolderCreated = (newProject: Project) => {
    setProjects((prev) => [...prev, newProject]);
    handleOpenFolder(newProject);
  };

  // 배경화면 테마 토글
  const handleToggleTheme = () => {
    setWallpaperIndex((prev) => (prev + 1) % 3);
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={handleDesktopClick}
      className="relative w-screen h-screen overflow-hidden select-none font-mac bg-cover bg-center"
      style={{
        backgroundImage:
          wallpaperIndex === 0
            ? "url('/wallpaper.jpg')"
            : wallpaperIndex === 1
            ? "radial-gradient(circle at 10% 20%, #ff7e5f 0%, #feb47b 20%, transparent 45%), radial-gradient(circle at 85% 85%, #6a11cb 0%, #2575fc 30%, transparent 55%), linear-gradient(135deg, #1a0b2e 0%, #0f172a 100%)"
            : "radial-gradient(circle at 20% 80%, #7f00ff 0%, #e100ff 25%, transparent 50%), radial-gradient(circle at 80% 20%, #00c6ff 0%, #0072ff 25%, transparent 50%), linear-gradient(135deg, #090a0f 0%, #151828 100%)",
      }}
    >
      {/* 1. 상단 macOS 메뉴바 */}
      <header className="absolute top-0 left-0 right-0 h-8 bg-white/40 dark:bg-black/35 backdrop-blur-2xl border-b border-white/20 dark:border-white/10 px-4 flex items-center justify-between z-40 text-[13.5px] text-gray-900 dark:text-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="font-bold text-base cursor-pointer select-none"></span>
          <span className="font-bold cursor-pointer">Finder</span>
          <span className="hidden sm:inline-block cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">
            파일
          </span>
          <span className="hidden sm:inline-block cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">
            보기
          </span>
          <span className="hidden sm:inline-block cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded">
            이동
          </span>

          {/* 도움말 메뉴 & 드롭다운 */}
          <div className="relative inline-block">
            <span
              onClick={(e) => {
                e.stopPropagation();
                setIsHelpMenuOpen((prev) => !prev);
              }}
              className={`hidden sm:inline-block cursor-pointer px-2 py-0.5 rounded transition-colors ${
                isHelpMenuOpen ? "bg-white/30 dark:bg-white/20" : "hover:bg-white/20"
              }`}
            >
              도움말
            </span>

            {isHelpMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-8 left-0 w-64 bg-white/95 dark:bg-[#252526]/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-black/10 dark:border-white/10 py-1.5 z-50 text-[13px] animate-in fade-in zoom-in-95 duration-100"
              >
                <a
                  href="https://buymeacoffee.com/devom"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsHelpMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer text-gray-800 dark:text-gray-200 group"
                >
                  <div className="w-6 h-6 rounded-md bg-[#FFDD00] text-black flex items-center justify-center font-bold shadow-sm">
                    ☕️
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-white">
                      개발자 후원하기
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 group-hover:text-blue-100">
                      buymeacoffee.com/devom
                    </span>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 프로필 칩 */}
          <button
            onClick={handleOpenProfile}
            className="flex items-center gap-2 bg-white/40 hover:bg-white/60 dark:bg-white/10 dark:hover:bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30 transition-all cursor-pointer"
            title="개발자 프로필 보기"
          >
            <div className="relative w-4.5 h-4.5 rounded-full overflow-hidden border border-white">
              <Image src="/me.JPG" alt="Profile" fill className="object-cover" />
            </div>
            <span className="text-xs font-semibold">Portfolio</span>
          </button>

          <span title="배터리 100%" className="flex items-center">
            <Battery className="w-4 h-4 stroke-[2]" />
          </span>
          <span title="Wi-Fi 연결됨" className="flex items-center">
            <Wifi className="w-4 h-4 stroke-[2]" />
          </span>
          <span title="제어 센터" className="flex items-center">
            <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2]" />
          </span>
        </div>
      </header>

      {/* 2. 바탕화면 폴더 그리드 (우측 상단부터 세로 정렬되는 macOS 스타일) */}
      <main className="absolute top-8 bottom-20 left-0 right-0 p-6 overflow-hidden">
        <div className="h-full flex flex-col flex-wrap content-end gap-6">
          {projects.map((proj) => (
            <FolderIcon
              key={proj.id}
              project={proj}
              isSelected={selectedFolderId === proj.id}
              onSelect={(id) => setSelectedFolderId(id)}
              onOpen={handleOpenFolder}
            />
          ))}
        </div>
      </main>

      {/* 3. 오른쪽 하단 실시간 초 단위 시계 & 날짜 위젯 */}
      <Taskbar />

      {/* 4. macOS 하단 플로팅 Dock */}
      <footer className="absolute bottom-2.5 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <div className="pointer-events-auto flex items-end gap-3 px-4 py-2 rounded-2xl bg-white/30 dark:bg-black/40 backdrop-blur-3xl border border-white/30 dark:border-white/10 shadow-2xl">
          {/* Finder 열기 버튼 */}
          <button
            onClick={handleOpenOverview}
            className="group flex flex-col items-center transition-transform hover:-translate-y-2 hover:scale-110 active:scale-95"
            title="Finder (전체 프로젝트)"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-lg overflow-hidden">
              <Folder className="w-7 h-7 fill-white/80" />
            </div>
            {windows.length > 0 && (
              <span className="w-1 h-1 rounded-full bg-white mt-1 shadow" />
            )}
          </button>

          {/* 프로필 열기 버튼 */}
          <button
            onClick={handleOpenProfile}
            className="group flex flex-col items-center transition-transform hover:-translate-y-2 hover:scale-110 active:scale-95"
            title="개발자 프로필 (me.JPG)"
          >
            <div className="relative w-12 h-12 rounded-xl border-2 border-white/80 shadow-lg overflow-hidden bg-white">
              <Image src="/me.JPG" alt="Profile" fill className="object-cover" />
            </div>
            {windows.some((w) => w.tab === "profile") && (
              <span className="w-1 h-1 rounded-full bg-white mt-1 shadow" />
            )}
          </button>

          {/* 새 폴더 생성 버튼 (관리자 전용) */}
          <button
            onClick={() => setIsNewFolderModalOpen(true)}
            className="group flex flex-col items-center transition-transform hover:-translate-y-2 hover:scale-110 active:scale-95"
            title="새 폴더 생성 (관리자)"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-white/40 flex items-center justify-center text-amber-500 shadow-lg">
              <FolderPlus className="w-6 h-6" />
            </div>
          </button>

          <div className="w-px h-10 bg-white/30 mx-1" />

          {/* GitHub 저장소 바로가기 */}
          <a
            href="https://github.com/hyun1216/WEBportfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center transition-transform hover:-translate-y-2 hover:scale-110 active:scale-95"
            title="GitHub 저장소 방문"
          >
            <div className="w-12 h-12 rounded-xl bg-[#24292e] flex items-center justify-center text-white shadow-lg">
              <Github className="w-6 h-6" />
            </div>
          </a>

          {/* 휴지통 */}
          <button
            onClick={() => alert("버릴게 없는 개발자 입니다")}
            className="group flex flex-col items-center transition-transform hover:-translate-y-2 hover:scale-110 active:scale-95"
            title="휴지통"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-gray-400 to-gray-500 flex items-center justify-center text-white shadow-lg">
              <Trash2 className="w-5 h-5" />
            </div>
          </button>
        </div>
      </footer>

      {/* 5. 우클릭 컨텍스트 메뉴 */}
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.isOpen}
        onClose={() => setContextMenu((prev) => ({ ...prev, isOpen: false }))}
        onOpenNewFolderModal={() => setIsNewFolderModalOpen(true)}
        onRefresh={fetchProjects}
        onOpenProfile={handleOpenProfile}
        onToggleTheme={handleToggleTheme}
      />

      {/* 6. 다중 Finder 윈도우 인스턴스들 */}
      {windows.map((win) => (
        <FinderWindow
          key={win.id}
          id={win.id}
          zIndex={win.zIndex}
          isOpen={true}
          activeProject={win.project}
          allProjects={projects}
          activeTab={win.tab}
          initialOffset={win.initialOffset}
          onFocus={() => bringToFront(win.id)}
          onClose={() => handleCloseWindow(win.id)}
          onSelectProject={(proj) => handleSelectProjectInWindow(win.id, proj)}
          onSelectTab={(tab) => handleSelectTabInWindow(win.id, tab)}
        />
      ))}

      {/* 7. 새 폴더 생성 모달 (관리자 비밀번호 검증) */}
      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        onClose={() => setIsNewFolderModalOpen(false)}
        onCreated={handleFolderCreated}
      />
    </div>
  );
}
