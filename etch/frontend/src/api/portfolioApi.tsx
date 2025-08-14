import { authInstance } from "./instances";
import type { portfolioDatas } from "../types/portfolio/portfolioDatas";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// 포트폴리오 생성 요청 타입
interface CreatePortfolioRequest {
  name: string;
  phoneNumber: string;
  email: string;
  blogUrl: string;
  githubUrl: string;
  introduce: string;
  stack: number[]; // 스택 ID 배열
  language: string; // 형식: "자격증명^발급기관^취득일/자격증명2^발급기관2^취득일2"
  education: string; // 형식: "회사명^활동명^시작일^종료일/회사명2^활동명2^시작일2^종료일2"
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
  stack: number[];
  language: string;
  education: string;
  createdAt: string;
  updatedAt: string;
}

// 포트폴리오 생성
export const createPortfolio = async (portfolioData: CreatePortfolioRequest): Promise<PortfolioResponse> => {
  const response = await authInstance.post<ApiResponse<PortfolioResponse>>("/portfolios", portfolioData);
  return response.data.data;
};

// 내 포트폴리오 조회
export const getMyPortfolio = async (): Promise<PortfolioResponse> => {
  const response = await authInstance.get<ApiResponse<PortfolioResponse>>("/portfolios/me");
  return response.data.data;
};

// 포트폴리오 수정
export const updatePortfolio = async (portfolioId: number, portfolioData: CreatePortfolioRequest): Promise<PortfolioResponse> => {
  const response = await authInstance.put<ApiResponse<PortfolioResponse>>(`/portfolios/${portfolioId}`, portfolioData);
  return response.data.data;
};

// 포트폴리오 삭제
export const deletePortfolio = async (portfolioId: number): Promise<void> => {
  await authInstance.delete(`/portfolios/${portfolioId}`);
};

// 특정 사용자의 포트폴리오 조회 (공개용)
export const getPortfolioByUserId = async (userId: number): Promise<PortfolioResponse> => {
  const response = await authInstance.get<ApiResponse<PortfolioResponse>>(`/portfolios/user/${userId}`);
  return response.data.data;
};

// portfolioDatas 타입을 API 요청 형태로 변환하는 헬퍼 함수
export const convertPortfolioDataToRequest = (portfolioData: portfolioDatas): CreatePortfolioRequest => {
  return {
    name: portfolioData.name,
    phoneNumber: portfolioData.phoneNumber,
    email: portfolioData.email,
    blogUrl: portfolioData.blogUrl,
    githubUrl: portfolioData.githubUrl,
    introduce: portfolioData.introduce,
    stack: portfolioData.stack.map(stackEnum => {
      // PortfolioStackEnum을 숫자 ID로 변환
      // 예시: "JAVASCRIPT" -> 1, "REACT" -> 2 등
      // 실제 백엔드 API 스펙에 맞게 수정 필요
      return typeof stackEnum === 'string' ? parseInt(stackEnum) || 0 : stackEnum;
    }),
    language: portfolioData.language,
    education: portfolioData.education,
  };
};