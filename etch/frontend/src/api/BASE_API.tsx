// BASE_API 임시 변경
export const BASE_API = import.meta.env.DEV
  ? "http://localhost:8080" // 프록시 우회, 직접 연결
  : "https://etch.it.kr/api/v1";
