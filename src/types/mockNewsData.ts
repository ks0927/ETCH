export interface mockNewsData {
  id: number;
  title: string;
  company: string;
  createTime: Date;
}
export const mockNews: mockNewsData[] = [
  {
    id: 1,
    title: "Test Title1",
    company: "Test Company1",
    createTime: new Date(),
  },
  {
    id: 2,
    title: "Test Title2",
    company: "Test Company2",
    createTime: new Date(),
  },
  {
    id: 3,
    title: "Test Title3",
    company: "Test Company3",
    createTime: new Date(),
  },
  {
    id: 4,
    title: "Test Title4",
    company: "Test Company4",
    createTime: new Date(),
  },
  {
    id: 5,
    title: "Test Title5",
    company: "Test Company5",
    createTime: new Date(),
  },
];
