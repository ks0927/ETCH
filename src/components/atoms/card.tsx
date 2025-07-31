type CardType = "job" | "project" | "news";

interface BaseCardProps {
  id: number;
  type: CardType;
  title: string;
}
export interface JobCardProps extends BaseCardProps {
  type: "job";
  createTime: Date;
}

export interface ProjectCardProps extends BaseCardProps {
  type: "project";
  img: string;
  content: string;
}
export interface NewsCardProps extends BaseCardProps {
  type: "news";
  createTime: Date;
  company: string;
}
