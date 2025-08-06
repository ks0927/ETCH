export interface DocumentItem {
  id: number;
  title: string;
  date: string;
  type: "coverLetter" | "portfolio";
}

export const mockCoverLetters: DocumentItem[] = [
  {
    id: 1,
    title: "네이버 백엔드 개발자 지원서",
    date: "2024-01-15",
    type: "coverLetter"
  },
  {
    id: 2, 
    title: "카카오 프론트엔드 개발자 지원서",
    date: "2024-01-10", 
    type: "coverLetter"
  }
];

export const mockPortfolios: DocumentItem[] = [
  {
    id: 3,
    title: "풀스택 개발자 포트폴리오",
    date: "2024-01-20",
    type: "portfolio"
  },
  {
    id: 4,
    title: "백엔드 개발자 포트폴리오", 
    date: "2024-01-18",
    type: "portfolio"
  }
];