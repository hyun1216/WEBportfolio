import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "macOS Interactive Web Portfolio",
  description: "Next.js, TypeScript, Tailwind CSS, Supabase 기반 macOS 감성 인터랙티브 웹 포트폴리오",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-black">{children}</body>
    </html>
  );
}

