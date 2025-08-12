import type { Company } from "../../types/companyData";
import type { CommentProps } from "./comment";
import type { ProjectCategoryEnum } from "../../types/project/projectCategroyData";

type CardType = "job" | "project" | "news" | "company" | "stats" | "question";

interface BaseCardProps {
  type: CardType;
}

export interface JobCardProps extends BaseCardProps {
  id: number;
  createTime: Date;
  title: string;
}

// ProjectData와 완전히 일치하는 ProjectCardProps
export interface ProjectCardProps extends BaseCardProps {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string; // ProjectData와 일치
  youtubeUrl: string; // 추가 (ProjectData에 있음)
  viewCount: number;
  projectCategory: ProjectCategoryEnum | "";
  createdAt: string;
  updatedAt: string; // 추가 (ProjectData에 있음)
  isDeleted: boolean; // 추가 (ProjectData에 있음)
  githubUrl: string;
  isPublic: boolean;
  nickname: string;
  onClose?: () => void;
  likedByMe?: boolean; // 🎯 추가
  onLike?: () => void;
  member: {
    // ProjectData와 일치
    id: number;
  };
  files: File[]; // ProjectData와 일치
  projectTechs: number[]; // ProjectData와 일치

  // 추가 필드들 (UI용)
  likeCount: number;
  writerImg?: string;
  commentCount?: number;
  comments?: CommentProps[];
  onCardClick?: (id: number) => void;
}

export interface NewsCardProps extends BaseCardProps {
  id: number;
  thumbnailUrl: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  company: Company;
}

export interface CompanyCardProps extends BaseCardProps {
  like: number;
  companyName: string;
  img?: string;
  rank?: number;
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
