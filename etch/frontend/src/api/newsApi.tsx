import axios from "axios";
import { BASE_API } from "./BASE_API";

export async function LatestNewsData() {
  const res = await axios.get(`${BASE_API}/news/latest`);
  return res.data.data;
}

export async function CompanyNewsData(companyId: number) {
  const res = await axios.get(`${BASE_API}/news/companies/${companyId}`);
  return res.data.data;
}

export async function TopCompaniesData() {
  const res = await axios.get(`${BASE_API}/news/top-companies`);
  return res.data.data;
}
