import axios from "axios";

// 개발환경에서는 프록시 사용, 프로덕션에서는 직접 호출
const API_BASE = import.meta.env.DEV ? "/api/v1" : "https://etch.it.kr/api/v1";

export async function LatestNewsData() {
  const res = await axios.get(`${API_BASE}/news/latest`);
  return res.data.data;
}

export async function CompanyNewsData(companyId: number) {
  const res = await axios.get(`${API_BASE}/news/companies/${companyId}`);
  return res.data.data;
}

export async function TopCompaniesData() {
  const res = await axios.get(`${API_BASE}/news/top-companies`);
  return res.data.data;
}
