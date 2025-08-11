import type { ProjectTechEnum } from "./projecStackData";
import type { ProjectCategoryEnum } from "./projectCategroyData";

export interface ProjectData {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  viewCount: number;
  category: ProjectCategoryEnum | "";
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  githubUrl: string;
  isPublic: boolean;
  member: {
    id: number;
    // 필요한 멤버 정보 추가
  };
  files: File[];
  projectTechs: ProjectTechEnum[];
}

// 초기 상태값 - ProjectData 인터페이스에 맞게 수정
export const ProjectState: ProjectData = {
  id: 0,
  title: "",
  content: "",
  thumbnailUrl: "",
  youtubeUrl: "",
  viewCount: 0,
  category: "", // 빈 문자열을 타입으로 캐스팅
  createdAt: "",
  updatedAt: "",
  isDeleted: false,
  githubUrl: "",
  isPublic: true,
  member: {
    id: 0,
  },
  files: [],
  projectTechs: [],
};
