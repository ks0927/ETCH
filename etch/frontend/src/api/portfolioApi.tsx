import { authInstance } from "./instances";
import type { portfolioDatas } from "../types/portfolio/portfolioDatas";
import type { ProjectCategoryEnum } from "../types/project/projectCategroyData";
import type { ProjectInfo } from "../components/pages/mypage/mypagePortfolioDetail";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// 포트폴리오에 포함할 프로젝트 ID 타입 (간단한 형태)
interface PortfolioProjectId {
  id: number;
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
  projectIds?: number[]; // 🔥 변경: PortfolioProjectId[] → number[]
}
interface PortfolioProjectId {
  id: number;
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
// portfolioDatas 타입을 API 요청 형태로 변환하는 헬퍼 함수 (수정된 버전)
export const convertPortfolioDataToRequest = (
  portfolioData: portfolioDatas,
  projectList: PortfolioProjectId[] = []
): CreatePortfolioRequest => {
  console.log("🔄 convertPortfolioDataToRequest 호출됨");
  console.log("📥 입력 projectList:", projectList);

  // 프로젝트 ID만 추출 (백엔드에서 기대하는 형태)
  const projectIds = projectList.map((project) => project.id);

  console.log("📤 변환된 projectIds:", projectIds);

  const convertedData = {
    name: portfolioData.name || "",
    introduce: portfolioData.introduce || "",
    githubUrl: portfolioData.githubUrl || "",
    blogUrl: portfolioData.blogUrl || "",
    phoneNumber: portfolioData.phoneNumber || "",
    email: portfolioData.email || "",
    techList: Array.isArray(portfolioData.stack)
      ? portfolioData.stack.map((stackEnum) => String(stackEnum))
      : [],
    language: portfolioData.language ? `${portfolioData.language}` : "",
    education: portfolioData.education ? `${portfolioData.education}` : "",

    // 🔥 핵심 수정: projectList 대신 projectIds로 변경
    projectIds: projectIds, // [67, 65, 66, 63, 62] 형태로 전송
  };

  console.log("📤 최종 변환된 데이터:", convertedData);

  return convertedData;
};

// 타입들을 export (컴포넌트에서 사용하기 위해)
export type {
  BackendArrayData,
  PortfolioDetailResponseDTO,
  EduAndActDTO,
  CertAndLangDTO,
  PortfolioProjectId, // 새로운 타입 export
};
