import type { CommentProps } from "./comment";

type CardType = "job" | "project" | "news" | "company" | "stats" | "question";

interface BaseCardProps {
  type: CardType;
}
export interface JobCardProps extends BaseCardProps {
  id: number;
  createTime: Date;
  title: string;
}

export interface ProjectCardProps extends BaseCardProps {
  id: number;
  img: string;
  content: string;
  title: string;
  stack: string[];
  category: string;
  github: string;
  release: boolean;
  createTime: string;
  viewCount: number;
  likeCount: number;
  writer: string;
  writerImg: string;
  commentCount?: number;
  comments?: CommentProps[];
  onCardClick?: (id: number) => void;
}
export interface NewsCardProps extends BaseCardProps {
  link: string;
  createTime: Date;
  mediaCompany: string;
  content?: string;
  img?: string;
  title: string;
}

export interface CompanyCardProps extends BaseCardProps {
  like: number;
  companyName: string;
  img?: string;
}

export interface StatsCardData extends BaseCardProps {
  title: string;
  type: "stats";
  value: number;
  icon: string;
  color: string;
}

export interface QuestionCardProps extends BaseCardProps {
  questionNumber: number;
  questionTitle: string;
  structure: string;
  tips: string;
  keywords: string;
  answer: string;
  onAnswerChange: (answer: string) => void;
}
