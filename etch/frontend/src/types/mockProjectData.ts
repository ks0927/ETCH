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
  {
    id: 6,
    title: "Test Title6",
    content: "Test Content6",
    img: TestImg,
  },
  {
    id: 7,
    title: "Test Title7",
    content: "Test Content7",
    img: TestImg,
  },
  {
    id: 8,
    title: "Test Title8",
    content: "Test Content8",
    img: TestImg,
  },
  {
    id: 9,
    title: "Test Title9",
    content: "Test Content9",
    img: TestImg,
  },
  {
    id: 10,
    title: "Test Title10",
    content: "Test Content10",
    img: TestImg,
  },
  {
    id: 11,
    title: "Test Title11",
    content: "Test Content11",
    img: TestImg,
  },
  {
    id: 12,
    title: "Test Title12",
    content: "Test Content12",
    img: TestImg,
  },
  {
    id: 13,
    title: "Test Title13",
    content: "Test Content13",
    img: TestImg,
  },
];
