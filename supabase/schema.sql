-- ==============================================================================
-- 1. projects 테이블 생성
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  demo_url TEXT,
  tags TEXT[] DEFAULT '{}',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 2. Row Level Security (RLS) 활성화 및 정책 구성
-- ==============================================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 모든 사용자(방문자 포함)에게 SELECT(읽기) 권한 허용
DROP POLICY IF EXISTS "Allow public read access" ON public.projects;
CREATE POLICY "Allow public read access"
  ON public.projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 클라이언트에서의 직접 INSERT, UPDATE, DELETE는 차단 (USING false)
-- 서버 사이드 API 라우트에서 service_role 키를 통해서만 쓰기 허용
DROP POLICY IF EXISTS "Deny direct public write" ON public.projects;
CREATE POLICY "Deny direct public write"
  ON public.projects
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- ==============================================================================
-- 3. 초기 7대 기본 프로젝트 데이터 INSERT
-- ==============================================================================
INSERT INTO public.projects (title, description, image_url, demo_url, tags, order_index)
VALUES
  (
    '뭐사주지?',
    '결정 장애를 겪는 사용자들을 위해 상황과 대상, 예산에 맞춰 최적의 선물을 추천해주는 AI 큐레이션 웹 서비스입니다.',
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
    'https://github.com/hyun1216/WEBportfolio',
    ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Gemini API'],
    1
  ),
  (
    '월 배당금 목표 원금 계산기',
    '목표 월 배당금을 달성하기 위해 필요한 종목별 투자 원금과 월별 배당 캘린더, 복리 재투자를 시뮬레이션하는 핀테크 도구입니다.',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    'https://github.com/hyun1216/WEBportfolio',
    ARRAY['React', 'Chart.js', 'FinTech', 'PWA'],
    2
  ),
  (
    '내돈내산 저장소',
    '영수증 OCR 인증을 거친 순수 실구매자들의 신뢰도 높은 후기와 재구매 의사를 투명하게 공유하는 클린 리뷰 커뮤니티입니다.',
    'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&auto=format&fit=crop&q=80',
    'https://github.com/hyun1216/WEBportfolio',
    ARRAY['Next.js', 'OCR API', 'Supabase', 'Tailwind CSS'],
    3
  ),
  (
    'Bottos',
    '반복적인 일상 업무 및 데이터 수집, 웹훅 트리거 알림을 모듈식으로 자동화하는 지능형 멀티 플랫폼 봇 서비스입니다.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    'https://github.com/hyun1216/WEBportfolio',
    ARRAY['Python', 'FastAPI', 'Docker', 'WebSocket'],
    4
  ),
  (
    '청년체크',
    '청년들이 놓치기 쉬운 정부·지자체 지원 정책 및 금융 혜택을 1분 자가진단으로 맞춤형 자격을 판별해주는 공공 혜택 서비스입니다.',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    'https://github.com/hyun1216/WEBportfolio',
    ARRAY['React', 'Zustand', '공공데이터포털 API'],
    5
  ),
  (
    'Hangeul_zip',
    '상업용 무료 한글 폰트를 모아 즉석에서 폰트 크기, 간격, 굵기 커스텀 테스트 및 CSS @font-face 코드를 복사할 수 있는 아카이브입니다.',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    'https://github.com/hyun1216/WEBportfolio',
    ARRAY['Canvas API', 'Vanilla JS', 'Web Font API'],
    6
  ),
  (
    '소원하늘',
    '밤하늘 3D 가상 공간에 소원을 적은 풍등을 띄우고, 다른 사용자들의 소원을 열람하며 응원을 나누는 감성 인터랙티브 웹입니다.',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
    'https://github.com/hyun1216/WEBportfolio',
    ARRAY['Three.js', 'WebGL', 'Firebase', 'Web Audio'],
    7
  )
ON CONFLICT (id) DO NOTHING;

