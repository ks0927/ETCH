import axios from "axios";

// 개발환경에서는 프록시 사용, 프로덕션에서는 직접 호출
const API_BASE = import.meta.env.DEV ? "/api/v1" : "https://etch.it.kr/api/v1";

export async function fetchLatestNews() {
  const res = await axios.get(`${API_BASE}/news/latest`);
  return res.data.data;
}

export async function fetchCompanyNews(companyId: number) {
  const res = await axios.get(`${API_BASE}/news/companies/${companyId}`);
  return res.data.data;
}

export async function fetchTopCompanies() {
  const res = await axios.get(`${API_BASE}/news/top-companies`);
  return res.data.data;
}
