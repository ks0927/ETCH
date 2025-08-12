import type { ProjectCategoryEnum } from "./projectCategroyData";

// 백엔드 응답용 타입들 (API 응답 받을 때만 사용)
export interface TechCodeData {
  id: number;
  techCategory: string;
  codeName: string;
}

export interface ProjectTechData {
  id: number;
  techCode: TechCodeData;
}

export interface MemberData {
  id: number;
  nickname?: string;
  email?: string;
}

export interface ProjectModalData extends ProjectData {
  type: "project"; // CardType 추가
  onCardClick?: (id: number) => void;
}

// 프론트엔드에서 사용할 메인 ProjectData (ID 기반으로 수정)
export interface ProjectData {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  viewCount: number;
  projectCategory: ProjectCategoryEnum | "";
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  githubUrl: string;
  isPublic: boolean;
  likeCount: number;
  nickname: string;
  member: {
    id: number;
    // 필요한 멤버 정보 추가
  };
  files: File[]; // 기존 방식 유지
  projectTechs: number[]; // ID 배열로 변경
}

// 백엔드 API 호출용 입력 데이터 타입
export interface ProjectInputData {
  title: string;
  content: string;
  projectCategory: ProjectCategoryEnum;
  githubUrl?: string;
  youtubeUrl?: string;
  isPublic: boolean;
  techCodeIds: number[]; // 백엔드로 보낼 때는 ID 배열

  // 파일 관련
  thumbnailFile?: File;
  imageFiles?: File[];
  pdfFile?: File;

  // 수정시에만 사용
  removeThumbnail?: boolean;
  removeFileIds?: number[];
  removePdf?: boolean;
}

// 초기 상태값 - ID 기반으로 수정
export const ProjectState: ProjectData = {
  id: 0,
  title: "",
  content: "",
  thumbnailUrl: "",
  youtubeUrl: "",
  viewCount: 0,
  likeCount: 0,
  projectCategory: "", // 빈 문자열을 타입으로 캐스팅
  createdAt: "",
  updatedAt: "",
  isDeleted: false,
  githubUrl: "",
  isPublic: true,
  nickname: "",
  member: {
    id: 1,
  },
  files: [], // 기존 방식
  projectTechs: [], // 빈 number 배열
};

// 백엔드 API 호출용 입력 데이터 타입
export interface ProjectInputData {
  title: string;
  content: string;
  projectCategory: ProjectCategoryEnum;
  githubUrl?: string;
  youtubeUrl?: string;
  isPublic: boolean;
  techCodeIds: number[]; // 백엔드로 보낼 때는 ID 배열

  // 파일 관련
  thumbnailFile?: File;
  imageFiles?: File[];
  pdfFile?: File;

  // 수정시에만 사용
  removeThumbnail?: boolean;
  removeFileIds?: number[];
  removePdf?: boolean;
}

// 프로젝트 입력 초기 상태
export const ProjectInputState: ProjectInputData = {
  title: "",
  content: "",
  projectCategory: "" as ProjectCategoryEnum,
  githubUrl: "",
  youtubeUrl: "",
  isPublic: true,
  techCodeIds: [],
  removeThumbnail: false,
  removeFileIds: [],
  removePdf: false,
};
