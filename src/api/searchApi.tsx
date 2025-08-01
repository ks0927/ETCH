import type { SearchParams, SearchResponse } from "../types/search";

const mockSearchResponse: SearchResponse = {
  total: 100,
  page: 1,
  size: 10,
  results: [
    {
      type: "job",
      id: "1",
      title: "프론트 구해요",
      summary: "프론트 노예 구합니다.",
      url: "http://example.com/job/1",
      score: 95,
      date: "2023-10-01",
    },
    {
      type: "news",
      id: "2",
      title: "삼성 돈 많이 번대요",
      summary: "역시 테슬라다",
      url: "http://example.com/news/2",
      score: 90,
      date: "2023-10-02",
    },
    {
      type: "project",
      id: "3",
      title: "제 플젝 지려요",
      summary: "풀스택에 아키텍쳐 다했어요",
      url: "http://example.com/company/3",
      score: 85,
      date: "2023-10-03",
    },
  ],
  aggregations: {
    type: {
      news: 50,
      job: 30,
      project: 20,
    },
  },
};

export const API_SERVER_HOST = "http://localhost:8080";

// const prefix = `${API_SERVER_HOST}/api/search`;

export const searchApi = async (
  params: SearchParams
): Promise<SearchResponse> => {
  console.log("검색 요청 파라미터:", params);
  console.log("Mock 검색 응답:", mockSearchResponse);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSearchResponse);
    }, 500);
  });
};
