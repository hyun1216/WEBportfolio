"use client";

import React from "react";
import { Project } from "@/types/project";

interface FolderIconProps {
  project: Project;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpen: (project: Project) => void;
}

export default function FolderIcon({
  project,
  isSelected,
  onSelect,
  onOpen,
}: FolderIconProps) {
  // 모바일 터치 더블탭 처리
  const lastTapRef = React.useRef<number>(0);

  const handleTouchEnd = (e: React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 350) {
      e.preventDefault();
      onOpen(project);
    }
    lastTapRef.current = now;
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(project.id);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onOpen(project);
      }}
      onTouchEnd={handleTouchEnd}
      className={`group w-28 flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all select-none ${
        isSelected
          ? "bg-blue-500/35 border border-white/40 backdrop-blur-sm"
          : "hover:bg-white/15 hover:backdrop-blur-sm border border-transparent"
      }`}
      title={`${project.title} (더블클릭하여 열기)`}
    >
      {/* macOS 노란색 폴더 SVG 아이콘 */}
      <div className="w-[84px] h-[68px] relative transition-transform duration-200 group-hover:scale-105 group-active:scale-95 drop-shadow-lg">
        <svg
          viewBox="0 0 100 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="folderBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffd56b" />
              <stop offset="100%" stopColor="#e8a716" />
            </linearGradient>
            <linearGradient id="folderFrontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffe885" />
              <stop offset="15%" stopColor="#ffd15c" />
              <stop offset="100%" stopColor="#e09809" />
            </linearGradient>
            <filter
              id="folderShadow"
              x="-10%"
              y="-10%"
              width="120%"
              height="130%"
              filterUnits="userSpaceOnUse"
            >
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="3"
                floodColor="#000000"
                floodOpacity="0.25"
              />
            </filter>
          </defs>
          {/* 폴더 뒷면 탭 */}
          <path
            d="M6 14C6 9.58172 9.58172 6 14 6H36.5C39.5 6 42.5 8 45 11L48.5 15.5C50.5 18 53.5 19.5 56.5 19.5H86C90.4183 19.5 94 23.0817 94 27.5V64C94 68.4183 90.4183 72 86 72H14C9.58172 72 6 68.4183 6 64V14Z"
            fill="url(#folderBackGrad)"
          />
          {/* 폴더 내부 문서 실루엣 */}
          <rect
            x="14"
            y="16"
            width="72"
            height="40"
            rx="3"
            fill="#ffffff"
            opacity="0.85"
          />
          {/* 폴더 앞면 커버 */}
          <path
            d="M6 26C6 22.6863 8.68629 20 12 20H88C91.3137 20 94 22.6863 94 26V64C94 68.4183 90.4183 72 86 72H14C9.58172 72 6 68.4183 6 64V26Z"
            fill="url(#folderFrontGrad)"
            filter="url(#folderShadow)"
          />
          {/* 상단 은은한 하이라이트 라인 */}
          <line
            x1="12"
            y1="21"
            x2="88"
            y2="21"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* 폴더 명칭 */}
      <span
        className={`mt-2 text-xs font-medium text-center line-clamp-2 px-1.5 py-0.5 rounded leading-tight max-w-[110px] break-keep ${
          isSelected
            ? "bg-blue-600 text-white"
            : "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
        }`}
      >
        {project.title}
      </span>
    </div>
  );
}

