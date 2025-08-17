import TestImg from "../../assets/testImg.png";

export interface mockNewsData {
  id: number;
  title: string;
  content: string;
  mediaCompany: string;
  createTime: Date;
  link: string;
  img: string;
}
export const mockNews: mockNewsData[] = [
  {
    id: 1,
    title: "Test Title1",
    content: "Test Content1",
    mediaCompany: "Test Company1",
    createTime: new Date(),
    link: "https://m.sports.naver.com/esports/article/005/0001792262?sid3=79b",
    img: TestImg,
  },
  {
    id: 2,
    title: "Test Title2",
    content: "Test Content1",
    mediaCompany: "Test Company2",
    createTime: new Date(),
    link: "https://m.sports.naver.com/esports/article/005/0001792262?sid3=79b",
    img: TestImg,
  },
  {
    id: 3,
    title: "Test Title3",
    content: "Test Content1",
    mediaCompany: "Test Company3",
    createTime: new Date(),
    link: "https://m.sports.naver.com/esports/article/005/0001792262?sid3=79b",
    img: TestImg,
  },
  {
    id: 4,
    title: "Test Title4",
    content: "Test Content1",
    mediaCompany: "Test Company4",
    createTime: new Date(),
    link: "https://m.sports.naver.com/esports/article/005/0001792262?sid3=79b",
    img: TestImg,
  },
  {
    id: 5,
    title: "Test Title5",
    content: "Test Content1",
    mediaCompany: "Test Company5",
    createTime: new Date(),
    link: "https://m.sports.naver.com/esports/article/005/0001792262?sid3=79b",
    img: TestImg,
  },
];
