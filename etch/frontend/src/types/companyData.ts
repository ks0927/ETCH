// company.ts
export interface Company {
  id: number;
  name: string;
  industry: string;
  mainProducts: string;
  ceoName: string;
  summary: string;
  stock: string;
  businessNo: string;
  address: string;
  homepageUrl: string;
  foundedDate: string; // LocalDate → 문자열
  totalEmployees: number;
  maleEmployees: number;
  femaleEmployees: number;
  maleRatio: number;
  femaleRatio: number;
  salary: number;
  serviceYear: number;
}
