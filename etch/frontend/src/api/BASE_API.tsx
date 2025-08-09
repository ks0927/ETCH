// 개발환경에서는 프록시 사용, 프로덕션에서는 직접 호출
export const BASE_API = import.meta.env.DEV
  ? "/api/v1"
  : "https://etch.it.kr/api/v1";
