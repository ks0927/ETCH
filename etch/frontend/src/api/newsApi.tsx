/* eslint-disable react-refresh/only-export-components */

import axios from "axios";
import { BASE_API } from "./BASE_API";
import { getCompany } from "./companyApi";
import type { TopCompany } from "../types/topCompanies";
import type { News, NewsPageData } from "../types/newsTypes";

// API 응답을 위한 Wrapper 타입 정의
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// 백엔드 CompanyNewsDTO 타입 (내부 사용)
interface CompanyNewsDTO {
  id: number;
  thumbnailUrl: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

// 백엔드 PageResponseDTO 타입
interface PageResponseDTO<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  isLast: boolean;
}

export async function LatestNewsData() {
  const res = await axios.get(`${BASE_API}/news/latest`);
  return res.data.data;
}

// 특정 기업의 뉴스 목록 조회 (Company 정보와 함께 News 타입으로 반환)
export async function getCompanyNews(
  companyId: number,
  page: number = 1,
  pageSize: number = 10
): Promise<News[]> {
  try {
    // 1. 기업 뉴스 목록 조회
    const newsResponse = await axios.get<
      ApiResponse<PageResponseDTO<CompanyNewsDTO>>
    >(
      `${BASE_API}/news/companies/${companyId}?page=${page}&pageSize=${pageSize}`
    );

    // 2. 기업 정보 조회
    const company = await getCompany(companyId);

    // 3. CompanyNewsDTO를 News 타입으로 변환
    const newsList: News[] = newsResponse.data.data.content.map((newsItem) => ({
      id: newsItem.id,
      thumbnailUrl: newsItem.thumbnailUrl,
      title: newsItem.title,
      description: newsItem.description,
      url: newsItem.url,
      publishedAt: newsItem.publishedAt,
      company: company,
    }));

    return newsList;
  } catch (error) {
    console.error(`Company ${companyId} 뉴스 조회 실패:`, error);
    throw error;
  }
}

// 기존 함수 (호환성 유지)
export async function CompanyNewsData(companyId: number) {
  const res = await axios.get(`${BASE_API}/news/companies/${companyId}`);
  return res.data.data;
}

export async function TopCompaniesData(): Promise<TopCompany[]> {
  const res = await axios.get<ApiResponse<TopCompany[]>>(
    `${BASE_API}/news/top-companies`
  );
  return res.data.data;
}
