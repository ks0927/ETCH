type CardType = "job" | "project";

interface BaseCardProps {
  id: number;
  type: CardType;
  title: string;
}
export interface JobCard extends BaseCardProps {
  type: "job";
  createTime: Date;
}

export interface ProjectCard extends BaseCardProps {
  type: "project";
  img: string;
  content: string;
}
