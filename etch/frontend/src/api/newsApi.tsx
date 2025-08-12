/* eslint-disable react-refresh/only-export-components */

import axios from "axios";
import { BASE_API } from "./BASE_API";
import type { TopCompany } from "../types/topCompanies";
import type { News, NewsPageData } from "../types/newsTypes";

// API 응답을 위한 Wrapper 타입 정의
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// 페이지네이션 응답 타입 추가
interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  isLast: boolean;
}

// 🔥 기존 함수 (호환성 유지용) - 첫 페이지만 반환
export async function LatestNewsData(): Promise<News[]> {
  try {
    const res = await axios.get(`${BASE_API}/news/latest`);
    console.log("최신 뉴스 응답:", res.data);

    // 🔥 페이지네이션 응답에서 content 배열 추출
    const pageData = res.data.data;
    return pageData.content || [];
  } catch (error) {
    console.error("최신 뉴스 조회 실패:", error);
    throw error;
  }
}

// 🔥 새로 추가: 페이지네이션 지원 최신 뉴스 함수
// newsApi.tsx
export async function getLatestNewsPaginated(
  page: number = 1,
  size: number = 10
): Promise<NewsPageData> {
  try {
    // 🔥 page 값을 그대로 전송 (백엔드에서 -1 처리함)
    const res = await axios.get(
      `${BASE_API}/news/latest?page=${page}&size=${size}`
    );
    console.log("페이지네이션된 최신 뉴스 응답:", res.data);

    return res.data.data;
  } catch (error) {
    console.error("페이지네이션된 최신 뉴스 조회 실패:", error);
    throw error;
  }
}

export async function CompanyNewsData(companyId: number): Promise<News[]> {
  try {
    const res = await axios.get(`${BASE_API}/news/companies/${companyId}`);
    console.log("회사 뉴스 응답:", res.data);

    // 🔥 페이지네이션 응답에서 content 배열 추출
    const pageData = res.data.data;
    return pageData.content || [];
  } catch (error) {
    console.error("회사 뉴스 조회 실패:", error);
    throw error;
  }
}

// 🔥 새로 추가: 페이지네이션 지원 회사 뉴스 함수
export async function getCompanyNewsPaginated(
  companyId: number,
  page: number = 0,
  size: number = 10
): Promise<NewsPageData> {
  try {
    const res = await axios.get(
      `${BASE_API}/news/companies/${companyId}?page=${page}&size=${size}`
    );
    console.log("페이지네이션된 회사 뉴스 응답:", res.data);

    // 전체 페이지네이션 정보 반환
    return res.data.data;
  } catch (error) {
    console.error("페이지네이션된 회사 뉴스 조회 실패:", error);
    throw error;
  }
}

export async function TopCompaniesData(): Promise<TopCompany[]> {
  try {
    const res = await axios.get<ApiResponse<PageResponse<TopCompany>>>(
      `${BASE_API}/news/top-companies`
    );
    console.log("상위 회사 응답:", res.data);

    // 🔥 페이지네이션이 적용되었다면 content 추출, 아니라면 그대로 반환
    const data = res.data.data;

    // data가 배열이면 그대로 반환, 페이지네이션 객체면 content 추출
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === "object" && "content" in data) {
      return data.content || [];
    }

    return [];
  } catch (error) {
    console.error("상위 회사 조회 실패:", error);
    throw error;
  }
}
