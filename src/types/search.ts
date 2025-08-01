// 검색 결과
export interface SearchResultItem {
  type: "job" | "news" | "project";
  id: string;
  title: string;
  summary: string;
  url: string;
  score: number;
  date: string;
}

// 검색 집계 정보 타입
export interface SearchAggregations {
  type: {
    news: number;
    job: number;
    project: number;
  };
}

// 전체 검색 응답 타입
export interface SearchResponse {
  total: number;
  page: number;
  size: number;
  results: SearchResultItem[];
  aggregations: SearchAggregations;
}

// 검색 요청 파라미터 타입
export interface SearchParams {
  query: string;
  page?: number;
  size?: number;
}
