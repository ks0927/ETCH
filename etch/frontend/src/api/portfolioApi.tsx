import { authInstance } from "./instances";
import type { portfolioDatas } from "../types/portfolio/portfolioDatas";
import type { ProjectCategoryEnum } from "../types/project/projectCategroyData";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// 포트폴리오 생성 요청 타입
interface CreatePortfolioRequest {
  name: string;
  introduce: string;
  githubUrl: string;
  blogUrl: string;
  phoneNumber: string;
  email: string;
  techList: string[];
  education: string;
  language: string;
  projectList: number[];
}

// 포트폴리오 응답 타입
interface PortfolioResponse {
  portfolioId: number;
  name: string;
  phoneNumber: string;
  email: string;
  blogUrl: string;
  githubUrl: string;
  introduce: string;
  techList: string[];
  language: string;
  education: string;
  memberId: number;
  projectList: number[];
  createdAt: string;
  updatedAt: string;
}

// PortfolioListResponseDTO 타입 정의 (백엔드 DTO와 정확히 일치)
interface PortfolioListResponseDTO {
  id: number;
  name: string;
  introduce: string;
}

// 포트폴리오 상세 응답 타입
interface PortfolioDetailResponseDTO {
  portfolioId: number;
  name: string;
  phoneNumber: string;
  email: string;
  blogUrl: string;
  githubUrl: string;
  introduce: string;
  techList: string[];
  language: string;
  education: string;
  memberId: number;
  projectList: number[];
  createdAt: string;
  updatedAt: string;
}

// 포트폴리오 목록용 간단한 응답 타입 (프론트엔드에서 사용)
interface PortfolioListItem {
  id: number;
  introduce: string;
  updatedAt: string;
  name?: string;
}

// 프로젝트 생성 요청 타입
interface CreateProjectRequest {
  title: string;
  content: string;
  projectCategory: ProjectCategoryEnum;
  techCodeIds: number[];
  githubUrl: string;
  youtubeUrl: string;
  isPublic: boolean;
  thumbnailFile?: File | null;
  imageFiles?: File[];
}

// 프로젝트 응답 타입
interface ProjectResponse {
  projectList: number;
  title: string;
  content: string;
  projectCategory: ProjectCategoryEnum;
  techCodeIds: number[];
  githubUrl: string;
  youtubeUrl: string;
  isPublic: boolean;
  memberId: number;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
  imageUrls?: string[];
}

// 포트폴리오 생성
export const createPortfolio = async (
  portfolioData: CreatePortfolioRequest
): Promise<PortfolioResponse> => {
  const response = await authInstance.post<ApiResponse<PortfolioResponse>>(
    "/portfolios",
    portfolioData
  );
  return response.data.data;
};

// 프로젝트 생성
export const createProject = async (
  projectData: CreateProjectRequest
): Promise<ProjectResponse> => {
  const formData = new FormData();

  const projectInfo = {
    title: projectData.title,
    content: projectData.content,
    projectCategory: projectData.projectCategory,
    techCodeIds: projectData.techCodeIds,
    githubUrl: projectData.githubUrl,
    youtubeUrl: projectData.youtubeUrl,
    isPublic: projectData.isPublic,
  };

  formData.append(
    "projectCreateRequest",
    new Blob([JSON.stringify(projectInfo)], { type: "application/json" })
  );

  if (projectData.thumbnailFile) {
    formData.append("thumbnailFile", projectData.thumbnailFile);
  }

  if (projectData.imageFiles && projectData.imageFiles.length > 0) {
    projectData.imageFiles.forEach((file) => {
      formData.append("imageFiles", file);
    });
  }

  const response = await authInstance.post<ApiResponse<ProjectResponse>>(
    "/projects",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data;
};

// 내 포트폴리오 목록 조회
export const getMyPortfolios = async (): Promise<PortfolioListItem[]> => {
  const response = await authInstance.get<
    ApiResponse<PortfolioListResponseDTO[]>
  >("/portfolios/list");

  return response.data.data.map((portfolio) => ({
    id: portfolio.id,
    introduce: portfolio.introduce,
    updatedAt: "", // 백엔드에서 제공하지 않으므로 빈 문자열
    name: portfolio.name,
  }));
};

// 포트폴리오 상세 조회 (/{portfolioId})
export const getPortfolioDetail = async (
  portfolioId: number
): Promise<PortfolioDetailResponseDTO> => {
  const response = await authInstance.get<
    ApiResponse<PortfolioDetailResponseDTO>
  >(`/portfolios/${portfolioId}`);
  return response.data.data;
};

// 포트폴리오 수정 (PUT /{portfolioId})
export const updatePortfolio = async (
  portfolioId: number,
  portfolioData: CreatePortfolioRequest
): Promise<void> => {
  await authInstance.put<ApiResponse<null>>(
    `/portfolios/${portfolioId}`,
    portfolioData
  );
};

// 포트폴리오 삭제 (DELETE /{portfolioId})
export const deletePortfolio = async (portfolioId: number): Promise<void> => {
  await authInstance.delete<ApiResponse<null>>(`/portfolios/${portfolioId}`);
};

// 특정 사용자의 포트폴리오 조회 (공개용)
export const getPortfolioByUserId = async (
  userId: number
): Promise<PortfolioResponse> => {
  const response = await authInstance.get<ApiResponse<PortfolioResponse>>(
    `/portfolios/user/${userId}`
  );
  return response.data.data;
};

// portfolioDatas 타입을 API 요청 형태로 변환하는 헬퍼 함수
export const convertPortfolioDataToRequest = (
  portfolioData: portfolioDatas,
  projectList: number[] = []
): CreatePortfolioRequest => {
  return {
    name: portfolioData.name || "",
    introduce: portfolioData.introduce || "",
    githubUrl: portfolioData.githubUrl || "",
    blogUrl: portfolioData.blogUrl || "",
    phoneNumber: portfolioData.phoneNumber || "",
    email: portfolioData.email || "",
    techList: Array.isArray(portfolioData.stack)
      ? portfolioData.stack.map((stackEnum) => String(stackEnum))
      : [],
    language: portfolioData.language || "",
    education: portfolioData.education || "",
    projectList: projectList,
  };
};
