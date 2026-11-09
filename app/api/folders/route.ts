import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { supabase } from "@/lib/supabaseClient";
import { Project } from "@/types/project";

// Supabase 미연결 또는 초기 상태일 때 사용할 7대 기본 폴더 데이터
const FALLBACK_PROJECTS: Project[] = [
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

/**
 * GET: 전체 프로젝트 폴더 목록 조회 (공개 API, order_index 오름차순)
 */
export async function GET() {
  try {
    // 1. Supabase URL이 실제 유효한지 확인
    const isConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");

    if (!isConfigured) {
      return NextResponse.json({
        success: true,
        data: FALLBACK_PROJECTS,
        source: "fallback",
      });
    }

    // 2. Supabase DB에서 projects 조회
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.error("[API GET /api/folders] Supabase error:", error);
      // DB 쿼리 오류 시 fallback 데이터 반환
      return NextResponse.json({
        success: true,
        data: FALLBACK_PROJECTS,
        source: "fallback_on_error",
      });
    }

    // DB에 데이터가 하나도 없으면 초기 7대 프로젝트 반환
    const result = data && data.length > 0 ? data : FALLBACK_PROJECTS;

    return NextResponse.json({
      success: true,
      data: result,
      source: "supabase",
    });
  } catch (err: any) {
    console.error("[API GET /api/folders] Server error:", err);
    return NextResponse.json(
      { success: false, error: err.message, data: FALLBACK_PROJECTS },
      { status: 500 }
    );
  }
}

/**
 * POST: 새 폴더 생성 (관리자 인증 필요: x-admin-key 헤더 검증)
 */
export async function POST(req: NextRequest) {
  try {
    // 1. 요청 헤더에서 x-admin-key 추출
    const adminKey = req.headers.get("x-admin-key");
    const serverAdminSecret = process.env.ADMIN_SECRET_KEY || "admin1234";

    // 2. 관리자 비밀번호 검증 (불일치 시 즉시 401 Unauthorized)
    if (!adminKey || adminKey !== serverAdminSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: 관리자 권한이 유효하지 않습니다.",
        },
        { status: 401 }
      );
    }

    // 3. 요청 Body 파싱
    const body = await req.json();
    const { title, description, image_url, demo_url, tags } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "폴더 제목(title)은 필수 입력값입니다." },
        { status: 400 }
      );
    }

    // 4. Supabase DB 환경 변수 확인
    const isConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id") &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your-service-role-key");

    // Supabase가 연결되어 있는 경우 service_role 클라이언트로 삽입
    if (isConfigured) {
      const serverClient = createServerSupabaseClient();

      // 현재 최대 order_index 조회
      const { data: maxOrderData } = await serverClient
        .from("projects")
        .select("order_index")
        .order("order_index", { ascending: false })
        .limit(1);

      const nextOrder = (maxOrderData?.[0]?.order_index ?? 0) + 1;

      const newRecord = {
        title: title.trim(),
        description: description?.trim() || "새로 추가된 프로젝트 폴더입니다.",
        image_url: image_url?.trim() || null,
        demo_url: demo_url?.trim() || "https://github.com/hyun1216/WEBportfolio",
        tags: Array.isArray(tags) ? tags : ["New Project", "Web"],
        order_index: nextOrder,
      };

      const { data, error } = await serverClient
        .from("projects")
        .insert([newRecord])
        .select()
        .single();

      if (error) {
        console.error("[API POST /api/folders] Insert error:", error);
        return NextResponse.json(
          { success: false, error: "데이터베이스 저장 실패: " + error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "새 폴더가 데이터베이스에 성공적으로 저장되었습니다.",
          data,
        },
        { status: 201 }
      );
    }

    // Supabase 환경 변수가 아직 더미인 경우: 로컬 인메모리 반환 (프론트엔드 상태에 즉시 반영)
    const mockCreated: Project = {
      id: "proj-" + Date.now(),
      title: title.trim(),
      description: description?.trim() || "새로 추가된 프로젝트 폴더입니다.",
      image_url: image_url || null,
      demo_url: demo_url || "https://github.com/hyun1216/WEBportfolio",
      tags: Array.isArray(tags) ? tags : ["New Project"],
      order_index: 99,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: "새 폴더가 생성되었습니다. (Supabase 연결 시 DB에 영구 저장됩니다)",
        data: mockCreated,
        source: "mock_created",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[API POST /api/folders] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

