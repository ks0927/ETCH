import type { CommentProps } from "./comment";

type CardType = "job" | "project" | "news" | "company";

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
