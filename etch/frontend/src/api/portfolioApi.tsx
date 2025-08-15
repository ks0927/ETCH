import { authInstance } from "./instances";
import type { portfolioDatas } from "../types/portfolio/portfolioDatas";
// import type { ProjectCategoryEnum } from "../types/project/projectCategroyData";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// 포트폴리오에 포함할 프로젝트 ID 타입 (간단한 형태)
interface PortfolioProjectId {
  id: number;
}

// 프로젝트 정보 타입 (포트폴리오 상세 조회용)
interface ProjectInfo {
  id: number;
  title: string;
  thumbnailUrl: string;
  projectCategory: string;
  viewCount: number;
  likeCount: number;
  nickname: string;
  isPublic: boolean;
  popularityScore: number;
}

// 백엔드에서 보낼 수 있는 데이터 타입들을 정의 (기존 문자열 형태용)
type BackendArrayData =
  | string // 원본 문자열: "test^test^2025-08-10|test2^test2^2022-11-31"
  | string[] // 1차원 배열: ["test^test^2025-08-10", "test2^test2^2022-11-31"]
  | string[][] // 2차원 배열: [["test","test","2025-08-10"], ["test2","test2","2022-11-31"]]
  | null
  | undefined;

// 백엔드 DTO 타입들 (실제 응답 구조)
interface EduAndActDTO {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface CertAndLangDTO {
  name: string;
  date: string;
  certificateIssuer: string;
}

// 포트폴리오 생성 요청 타입
interface CreatePortfolioRequest {
  name: string;
  introduce: string;
  githubUrl?: string;
  blogUrl?: string;
  phoneNumber: string;
  email?: string;
  techList?: string[];
  education?: string;
  language?: string;
  projectList?: PortfolioProjectId[]; // ProjectInfo 대신 PortfolioProjectId 사용
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

// 포트폴리오 상세 응답 타입 (실제 백엔드 응답에 맞게 수정)
interface PortfolioDetailResponseDTO {
  portfolioId: number;
  name: string;
  phoneNumber: string;
  email: string;
  blogUrl: string;
  githubUrl: string;
  introduce: string;
  techList: string[];
  language: CertAndLangDTO[]; // 자격증/어학 객체 배열
  education: EduAndActDTO[]; // 교육/활동 객체 배열
  certificate?: BackendArrayData; // 자격증 (아직 구현되지 않음)
  activity?: BackendArrayData; // 교육활동 (아직 구현되지 않음)
  memberId: number;
  projectList: ProjectInfo[];
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
// interface CreateProjectRequest {
//   title: string;
//   content: string;
//   projectCategory: ProjectCategoryEnum;
//   techCodeIds: number[];
//   githubUrl: string;
//   youtubeUrl: string;
//   isPublic: boolean;
//   thumbnailFile?: File | null;
//   imageFiles?: File[];
// }

// // 프로젝트 응답 타입
// interface ProjectResponse {
//   id: number; // ID 필드 추가
//   projectList: number;
//   title: string;
//   content: string;
//   projectCategory: ProjectCategoryEnum;
//   techCodeIds: number[];
//   githubUrl: string;
//   youtubeUrl: string;
//   isPublic: boolean;
//   memberId: number;
//   createdAt: string;
//   updatedAt: string;
//   thumbnailUrl?: string;
//   imageUrls?: string[];
// }

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

// 프로젝트 생성 (portfolioApi에서는 제거, projectApi만 사용)
// export const createProject = async (
//   projectData: CreateProjectRequest
// ): Promise<ProjectResponse> => {
//   // 이 함수는 projectApi.ts의 createProject를 사용하세요
// };

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
  projectList: PortfolioProjectId[] = [] // ProjectInfo 대신 PortfolioProjectId 사용
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
    // 서버에서 문자열 JSON 형태로 파싱되므로 빈 문자열도 "[]"로
    language: portfolioData.language ? `${portfolioData.language}` : "",
    education: portfolioData.education ? `${portfolioData.education}` : "",
    // projectList는 이미 배열이면 그대로, 빈 배열도 안전하게 전달
    projectList: projectList,
  };
};

// 타입들을 export (컴포넌트에서 사용하기 위해)
export type {
  BackendArrayData,
  PortfolioDetailResponseDTO,
  EduAndActDTO,
  CertAndLangDTO,
  PortfolioProjectId,
  ProjectInfo, // ProjectInfo 타입도 export
};
