import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Project } from "@/types/project";

// 프로젝트 루트의 data/projects.json 파일 경로
const DATA_FILE_PATH = path.join(process.cwd(), "data", "projects.json");

/**
 * 로컬 파일 시스템에서 projects.json을 안전하게 읽어오는 헬퍼
 */
async function readLocalProjects(): Promise<Project[]> {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileData = await fs.promises.readFile(DATA_FILE_PATH, "utf-8");
      return JSON.parse(fileData);
    }
  } catch (err) {
    console.error("[API readLocalProjects error]:", err);
  }
  return [];
}

/**
 * GET /api/folders
 * data/projects.json 내용을 읽어와 브라우저에 반환 (방문자 누구나 조회 가능)
 */
export async function GET() {
  try {
    const owner = process.env.GITHUB_REPO_OWNER || "hyun1216";
    const repo = process.env.GITHUB_REPO_NAME || "WEBportfolio";
    const pat = process.env.GITHUB_PAT;

    // 1. 프로덕션 배포 환경(Vercel 등)이고 GITHUB_PAT가 구성되어 있는 경우 GitHub Contents API 조회 시도
    // (로컬 개발 환경에서는 로컬 data/projects.json 파일 변경사항이 즉시 반영되도록 로컬 우선)
    if (process.env.NODE_ENV === "production" && pat && !pat.startsWith("ghp_your")) {
      try {
        const ghRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/data/projects.json`,
          {
            headers: {
              Authorization: `Bearer ${pat}`,
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "WEBportfolio-App",
            },
            cache: "no-store",
          }
        );

        if (ghRes.ok) {
          const ghData = await ghRes.json();
          if (ghData.content) {
            const decodedStr = Buffer.from(ghData.content, "base64").toString("utf-8");
            const parsed = JSON.parse(decodedStr);
            return NextResponse.json({
              success: true,
              data: parsed,
              source: "github_api",
            });
          }
        }
      } catch (ghErr) {
        console.warn("[GET /api/folders] GitHub API fetch fallback to local file:", ghErr);
      }
    }

    // 2. 기본: 로컬 파일 시스템에서 data/projects.json 읽기
    const localProjects = await readLocalProjects();
    return NextResponse.json({
      success: true,
      data: localProjects,
      source: "local_file",
    });
  } catch (err: any) {
    console.error("[GET /api/folders error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load projects" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/folders
 * 1. x-admin-key 헤더 검증 (ADMIN_SECRET_KEY와 대조)
 * 2. GitHub REST API(PUT /contents/data/projects.json)로 직접 커밋 & 푸시
 */
export async function POST(req: NextRequest) {
  try {
    // 1. 관리자 비밀번호 검증 (x-admin-key 헤더)
    const adminKey = req.headers.get("x-admin-key");
    const serverAdminSecret = process.env.ADMIN_SECRET_KEY || "admin1234";

    if (!adminKey || adminKey !== serverAdminSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: 관리자 권한이 유효하지 않습니다.",
        },
        { status: 401 }
      );
    }

    // 2. 요청 Body 파싱
    const body = await req.json();
    const { title, description, image, link } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "폴더 제목(title)은 필수 입력값입니다." },
        { status: 400 }
      );
    }

    const owner = process.env.GITHUB_REPO_OWNER || "hyun1216";
    const repo = process.env.GITHUB_REPO_NAME || "WEBportfolio";
    const pat = process.env.GITHUB_PAT;

    // 새 프로젝트 객체 생성
    const newProject: Project = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description?.trim() || "새로 추가된 프로젝트 폴더입니다.",
      image: image?.trim() || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80",
      link: link?.trim() || "https://github.com/hyun1216/WEBportfolio",
    };

    // 3. GitHub PAT가 설정되어 있는 경우 GitHub REST API를 통해 직접 커밋 & 푸시
    if (pat && !pat.startsWith("ghp_your") && pat.trim().length > 0) {
      // 3-1. 기존 파일의 SHA와 Content 조회
      const getFileRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/data/projects.json`,
        {
          headers: {
            Authorization: `Bearer ${pat}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "WEBportfolio-App",
          },
          cache: "no-store",
        }
      );

      let currentSha = "";
      let currentProjects: Project[] = [];

      if (getFileRes.ok) {
        const fileInfo = await getFileRes.json();
        currentSha = fileInfo.sha;
        const decoded = Buffer.from(fileInfo.content, "base64").toString("utf-8");
        currentProjects = JSON.parse(decoded);
      } else {
        // GitHub에 파일이 없으면 로컬 파일에서 읽기
        currentProjects = await readLocalProjects();
      }

      // 새 프로젝트 추가
      currentProjects.push(newProject);

      // JSON을 Base64로 인코딩
      const updatedJsonString = JSON.stringify(currentProjects, null, 2);
      const base64Content = Buffer.from(updatedJsonString, "utf-8").toString("base64");

      // 3-2. PUT /repos/{owner}/{repo}/contents/data/projects.json 호출 (커밋 & 푸시)
      const putRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/data/projects.json`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${pat}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            "User-Agent": "WEBportfolio-App",
          },
          body: JSON.stringify({
            message: `feat(cms): add project folder "${newProject.title}" via web admin`,
            content: base64Content,
            ...(currentSha ? { sha: currentSha } : {}),
            branch: "main",
          }),
        }
      );

      const putResult = await putRes.json();

      if (!putRes.ok) {
        console.error("[GitHub PUT error]:", putResult);
        return NextResponse.json(
          {
            success: false,
            error: `GitHub Commit 실패: ${putResult.message || "원격 저장소 쓰기 권한을 확인해주세요."}`,
          },
          { status: 500 }
        );
      }

      // 로컬 파일 시스템도 최신화
      try {
        await fs.promises.writeFile(DATA_FILE_PATH, updatedJsonString, "utf-8");
      } catch (e) {
        console.warn("Local file sync failed, but GitHub commit succeeded:", e);
      }

      return NextResponse.json(
        {
          success: true,
          message: "새 폴더가 GitHub 저장소에 성공적으로 커밋 & 푸시되었습니다.",
          data: newProject,
          commit: putResult.commit?.sha,
        },
        { status: 201 }
      );
    }

    // 4. GITHUB_PAT가 미설정된 로컬 개발 환경인 경우: 로컬 data/projects.json에 직접 파일 기록
    const currentLocalProjects = await readLocalProjects();
    currentLocalProjects.push(newProject);
    await fs.promises.writeFile(
      DATA_FILE_PATH,
      JSON.stringify(currentLocalProjects, null, 2),
      "utf-8"
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "로컬 data/projects.json에 저장되었습니다. (GitHub 자동 커밋을 원하시면 .env.local에 GITHUB_PAT를 등록해주세요)",
        data: newProject,
        source: "local_filesystem_write",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[POST /api/folders error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
