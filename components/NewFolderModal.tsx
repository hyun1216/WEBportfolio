"use client";

import React, { useState, useRef } from "react";
import { Lock, FolderPlus, AlertCircle, Loader2 } from "lucide-react";
import { Project } from "@/types/project";

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newProject: Project) => void;
}

export default function NewFolderModal({
  isOpen,
  onClose,
  onCreated,
}: NewFolderModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const triggerShake = () => {
    setIsShaking(false);
    setTimeout(() => setIsShaking(true), 10);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("폴더 이름을 입력해주세요.");
      triggerShake();
      return;
    }

    if (!adminPassword.trim()) {
      setErrorMessage("관리자 비밀번호를 입력해주세요.");
      triggerShake();
      passwordInputRef.current?.focus();
      return;
    }

    setIsLoading(true);

    try {
      // 서버리스 API에 x-admin-key 헤더 및 Body 전달 (GitHub REST API 커밋 수행)
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminPassword.trim(),
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || "새로 추가된 프로젝트 폴더입니다.",
          image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80",
          link: "https://github.com/hyun1216/WEBportfolio",
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        if (res.status === 401) {
          setErrorMessage("관리자 비밀번호가 일치하지 않습니다. (기본: admin1234)");
        } else {
          setErrorMessage(result.error || "GitHub 커밋 및 폴더 생성에 실패했습니다.");
        }
        triggerShake();
        passwordInputRef.current?.focus();
        passwordInputRef.current?.select();
        setIsLoading(false);
        return;
      }

      // 성공 시 바탕화면 상태 즉시 반영
      setTitle("");
      setDescription("");
      setAdminPassword("");
      onCreated(result.data);
      onClose();
    } catch (err: any) {
      console.error("Folder creation error:", err);
      setErrorMessage("서버 통신 중 오류가 발생했습니다.");
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        className={`w-full max-w-sm bg-white/90 dark:bg-[#252526]/95 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-2xl p-6 shadow-2xl text-gray-900 dark:text-gray-100 ${
          isShaking ? "animate-shake" : ""
        }`}
      >
        {/* 상단 아이콘 및 뱃지 */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
            Git-as-a-CMS 관리자 인증
          </span>
          <h3 className="text-base font-bold mt-2">새 폴더 생성 (GitHub 직접 커밋)</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            저장소의 data/projects.json에 영구 반영됩니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
              폴더 이름
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 신규 프로젝트 명칭"
              maxLength={40}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
              간단한 설명 (선택)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="프로젝트 설명 또는 한 줄 요약"
              rows={2}
              maxLength={120}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span>관리자 암호</span>
              <span className="text-[10px] text-gray-400">기본: admin1234</span>
            </label>
            <input
              ref={passwordInputRef}
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-2 rounded-md border border-red-200 dark:border-red-900">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2 rounded-lg text-xs font-semibold bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 rounded-lg text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-1.5 shadow-md transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>GitHub 커밋 중...</span>
                </>
              ) : (
                <>
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>생성 & 커밋</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
