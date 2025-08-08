import type { Company } from "./companyData";

export interface News {
  id: number;
  thumbnailUrl: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string; // LocalDate는 문자열로 옴
  company: Company;
}
