"use client";

import React from "react";
import { FolderPlus, RefreshCw, Sparkles, User, Palette } from "lucide-react";

interface ContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
  onOpenNewFolderModal: () => void;
  onRefresh: () => void;
  onOpenProfile: () => void;
  onToggleTheme?: () => void;
}

export default function ContextMenu({
  x,
  y,
  isOpen,
  onClose,
  onOpenNewFolderModal,
  onRefresh,
  onOpenProfile,
  onToggleTheme,
}: ContextMenuProps) {
  if (!isOpen) return null;

  // 화면 경계 체크
  const menuWidth = 200;
  const menuHeight = 210;
  const safeX = typeof window !== "undefined" ? Math.min(x, window.innerWidth - menuWidth - 10) : x;
  const safeY = typeof window !== "undefined" ? Math.min(y, window.innerHeight - menuHeight - 10) : y;

  return (
    <div
      style={{ top: `${safeY}px`, left: `${safeX}px` }}
      onClick={(e) => e.stopPropagation()}
      className="fixed z-50 w-52 bg-white/80 dark:bg-[#252526]/85 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-xl p-1.5 shadow-2xl text-xs text-gray-800 dark:text-gray-200 select-none animate-in fade-in zoom-in-95 duration-100"
    >
      <button
        onClick={() => {
          onClose();
          onOpenNewFolderModal();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium hover:bg-blue-500 hover:text-white transition-colors"
      >
        <FolderPlus className="w-4 h-4 text-amber-500" />
        <span>새 폴더 생성 (관리자)</span>
      </button>

      <div className="h-px bg-black/10 dark:bg-white/10 my-1 mx-2" />

      <button
        onClick={() => {
          onClose();
          onRefresh();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium hover:bg-blue-500 hover:text-white transition-colors"
      >
        <RefreshCw className="w-4 h-4 text-emerald-500" />
        <span>새로고침</span>
      </button>

      {onToggleTheme && (
        <button
          onClick={() => {
            onClose();
            onToggleTheme();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium hover:bg-blue-500 hover:text-white transition-colors"
        >
          <Palette className="w-4 h-4 text-purple-500" />
          <span>배경화면 테마 변경</span>
        </button>
      )}

      <div className="h-px bg-black/10 dark:bg-white/10 my-1 mx-2" />

      <button
        onClick={() => {
          onClose();
          onOpenProfile();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium hover:bg-blue-500 hover:text-white transition-colors"
      >
        <User className="w-4 h-4 text-blue-500" />
        <span>개발자 소개 (Profile)</span>
      </button>
    </div>
  );
}

