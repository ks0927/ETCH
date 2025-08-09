import type { ProjectStackEnum } from "./projecStackData";
import type { ProjectCategoryEnum } from "./projectCategroyData";

export interface ProjectData {
  title: string;
  content: string;
  category: ProjectCategoryEnum | "";
  stack: ProjectStackEnum[];
  githubUrl: string;
  isPublic: boolean;
  uploadedFiles: File[];
}

// 초기 상태값
export const ProjectState: ProjectData = {
  title: "",
  content: "",
  category: "",
  stack: [],
  githubUrl: "",
  isPublic: false,
  uploadedFiles: [],
};
