export interface mockJobData {
  id: number;
  title: string;
  createTime: Date;
}
export const mockJobs: mockJobData[] = [
  {
    id: 1,
    title: "Test Title1",
    createTime: new Date(),
  },
  {
    id: 2,
    title: "Test Title2",
    createTime: new Date(),
  },
  {
    id: 3,
    title: "Test Title3",
    createTime: new Date(),
  },
  {
    id: 4,
    title: "Test Title4",
    createTime: new Date(),
  },
  {
    id: 5,
    title: "Test Title5",
    createTime: new Date(),
  },
];
