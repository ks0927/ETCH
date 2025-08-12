import axios from "axios";
import { BASE_API } from "./BASE_API";
import type { TopCompany } from "../types/topCompanies";

// API 응답을 위한 Wrapper 타입 정의 (authApi.tsx와 동일하게)
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function LatestNewsData() {
  const res = await axios.get(`${BASE_API}/news/latest`);
  return res.data.data;
}

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
