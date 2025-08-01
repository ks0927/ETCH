import TestImg from "../assets/testImg.png";

export interface mockProjectData {
  id: number;
  title: string;
  content: string;
  img: string; // 이미지 경로(import한 이미지도 string으로 처리됨)
}
export const mockProjects: mockProjectData[] = [
  {
    id: 1,
    title: "Test Title1",
    content: "Test Content1",
    img: TestImg,
  },
  {
    id: 2,
    title: "Test Title2",
    content: "Test Content2",
    img: TestImg,
  },
  {
    id: 3,
    title: "Test Title3",
    content: "Test Content3",
    img: TestImg,
  },
  {
    id: 4,
    title: "Test Title4",
    content: "Test Content4",
    img: TestImg,
  },
  {
    id: 5,
    title: "Test Title5",
    content: "Test Content5",
    img: TestImg,
  },
];
