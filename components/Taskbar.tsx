"use client";

import React, { useState, useEffect } from "react";

export default function Taskbar() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed bottom-6 right-6 z-40 pointer-events-none">
        <div className="h-16 w-60 rounded-2xl bg-white/20 backdrop-blur-xl animate-pulse" />
      </div>
    );
  }

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = days[now.getDay()];

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const formattedDate = `${year}. ${month}. ${date} (${dayName})`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return (
    <aside className="fixed bottom-6 right-6 z-40 select-none transition-transform hover:-translate-y-0.5">
      <div className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white/25 dark:bg-black/30 backdrop-blur-2xl border border-white/40 shadow-2xl text-white">
        {/* 달력 날짜 칩 */}
        <div className="w-13 h-13 rounded-xl bg-white text-gray-900 flex flex-col items-center justify-center shadow-md overflow-hidden shrink-0">
          <div className="w-full bg-red-500 text-white text-[11px] font-bold text-center py-0.5">
            {parseInt(month, 10)}월
          </div>
          <div className="text-2xl font-extrabold leading-none mt-1">
            {date}
          </div>
        </div>

        {/* 실시간 시계 & 날짜 */}
        <div className="flex flex-col">
          <span className="text-2xl font-bold tracking-wider tabular-nums drop-shadow-md">
            {formattedTime}
          </span>
          <span className="text-sm font-medium text-white/90 drop-shadow">
            {formattedDate}
          </span>
        </div>
      </div>
    </aside>
  );
}

