import Desktop from "@/components/Desktop";
import { Project } from "@/types/project";
import { supabase } from "@/lib/supabaseClient";

// 7대 기본 프로젝트 폴더 (초기 로드용 기본 데이터)
const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "뭐사주지?",
    description: "결정 장애를 겪는 사용자들을 위해 상황과 대상, 예산에 맞춰 최적의 선물을 추천해주는 AI 큐레이션 웹 서비스입니다.",
    image_url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80",
    demo_url: "https://github.com/hyun1216/WEBportfolio",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Gemini API"],
    order_index: 1,
  },
  {
    id: "proj-2",
    title: "월 배당금 목표 원금 계산기",
    description: "목표 월 배당금을 달성하기 위해 필요한 종목별 투자 원금과 월별 배당 캘린더, 복리 재투자를 시뮬레이션하는 핀테크 도구입니다.",
    image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
    demo_url: "https://github.com/hyun1216/WEBportfolio",
    tags: ["React", "Chart.js", "FinTech", "PWA"],
    order_index: 2,
  },
  {
    id: "proj-3",
    title: "내돈내산 저장소",
    description: "영수증 OCR 인증을 거친 순수 실구매자들의 신뢰도 높은 후기와 재구매 의사를 투명하게 공유하는 클린 리뷰 커뮤니티입니다.",
    image_url: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&auto=format&fit=crop&q=80",
    demo_url: "https://github.com/hyun1216/WEBportfolio",
    tags: ["Next.js", "OCR API", "Supabase", "Tailwind CSS"],
    order_index: 3,
  },
  {
    id: "proj-4",
    title: "Bottos",
    description: "반복적인 일상 업무 및 데이터 수집, 웹훅 트리거 알림을 모듈식으로 자동화하는 지능형 멀티 플랫폼 봇 서비스입니다.",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    demo_url: "https://github.com/hyun1216/WEBportfolio",
    tags: ["Python", "FastAPI", "Docker", "WebSocket"],
    order_index: 4,
  },
  {
    id: "proj-5",
    title: "청년체크",
    description: "청년들이 놓치기 쉬운 정부·지자체 지원 정책 및 금융 혜택을 1분 자가진단으로 맞춤형 자격을 판별해주는 공공 혜택 서비스입니다.",
    image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80",
    demo_url: "https://github.com/hyun1216/WEBportfolio",
    tags: ["React", "Zustand", "공공데이터포털 API"],
    order_index: 5,
  },
  {
    id: "proj-6",
    title: "Hangeul_zip",
    description: "상업용 무료 한글 폰트를 모아 즉석에서 폰트 크기, 간격, 굵기 커스텀 테스트 및 CSS @font-face 코드를 복사할 수 있는 아카이브입니다.",
    image_url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80",
    demo_url: "https://github.com/hyun1216/WEBportfolio",
    tags: ["Canvas API", "Vanilla JS", "Web Font API"],
    order_index: 6,
  },
  {
    id: "proj-7",
    title: "소원하늘",
    description: "밤하늘 3D 가상 공간에 소원을 적은 풍등을 띄우고, 다른 사용자들의 소원을 열람하며 응원을 나누는 감성 인터랙티브 웹입니다.",
    image_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80",
    demo_url: "https://github.com/hyun1216/WEBportfolio",
    tags: ["Three.js", "WebGL", "Firebase", "Web Audio"],
    order_index: 7,
  },
];

async function getInitialProjects(): Promise<Project[]> {
  try {
    const isConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");

    if (!isConfigured) {
      return DEFAULT_PROJECTS;
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_PROJECTS;
    }

    return data as Project[];
  } catch (err) {
    console.error("Failed to fetch initial projects from Supabase:", err);
    return DEFAULT_PROJECTS;
  }
}

export const revalidate = 0; // 항상 실시간 최신 데이터 로드

export default async function Page() {
  const projects = await getInitialProjects();
  return <Desktop initialProjects={projects} />;
}

