import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// 브라우저 및 일반 읽기용 Supabase 클라이언트 (anon key 사용)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

