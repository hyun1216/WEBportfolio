import fs from "fs";
import path from "path";
import Desktop from "@/components/Desktop";
import { Project } from "@/types/project";

async function getInitialProjects(): Promise<Project[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "projects.json");
    if (fs.existsSync(filePath)) {
      const content = await fs.promises.readFile(filePath, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Failed to read data/projects.json on server:", err);
  }
  return [];
}

export const dynamic = "force-dynamic";

export default async function Page() {
  const projects = await getInitialProjects();
  return <Desktop initialProjects={projects} />;
}
