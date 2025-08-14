import { authInstance } from "./instances";
import type { portfolioDatas } from "../types/portfolio/portfolioDatas";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// 포트폴리오 생성 요청 타입 (백엔드 컨트롤러에 맞게 수정)
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
  // memberId 제거 - 백엔드에서 @AuthenticationPrincipal로 자동 처리
  projectIds: number[];
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
  projectIds: number[];
  createdAt: string;
  updatedAt: string;
}

// 포트폴리오 생성
export const createPortfolio = async (
  portfolioData: CreatePortfolioRequest
): Promise<PortfolioResponse> => {
  console.log("=== 포트폴리오 생성 요청 ===");
  console.log("전송 데이터:", JSON.stringify(portfolioData, null, 2));

  try {
    const response = await authInstance.post<ApiResponse<PortfolioResponse>>(
      "/portfolios",
      portfolioData
    );

    console.log("=== 성공 응답 ===");
    console.log("상태 코드:", response.status);
    console.log("응답 데이터:", response.data);

    return response.data.data;
  } catch (error) {
    console.error("=== API 에러 ===");
    console.error("에러:", error);

    throw error;
  }
};

// 내 포트폴리오 조회
export const getMyPortfolio = async (): Promise<PortfolioResponse> => {
  const response = await authInstance.get<ApiResponse<PortfolioResponse>>(
    "/portfolios/me"
  );
  return response.data.data;
};

// 포트폴리오 수정
export const updatePortfolio = async (
  portfolioId: number,
  portfolioData: CreatePortfolioRequest
): Promise<PortfolioResponse> => {
  const response = await authInstance.put<ApiResponse<PortfolioResponse>>(
    `/portfolios/${portfolioId}`,
    portfolioData
  );
  return response.data.data;
};

// 포트폴리오 삭제
export const deletePortfolio = async (portfolioId: number): Promise<void> => {
  await authInstance.delete(`/portfolios/${portfolioId}`);
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

// portfolioDatas 타입을 API 요청 형태로 변환하는 헬퍼 함수 (수정)
export const convertPortfolioDataToRequest = (
  portfolioData: portfolioDatas,
  projectIds: number[] = [] // memberId 매개변수 제거
): CreatePortfolioRequest => {
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
    language: portfolioData.language || "",
    education: portfolioData.education || "",
    projectIds: projectIds,
    // memberId 제거 - 백엔드에서 자동 처리
  };

  console.log("=== 데이터 변환 결과 ===");
  console.log("원본 데이터:", portfolioData);
  console.log("변환된 데이터:", convertedData);

  return convertedData;
};
