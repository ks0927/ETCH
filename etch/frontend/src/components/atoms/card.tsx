type CardType = "job" | "project" | "news" | "company" | "stats";

interface BaseCardProps {
  type: CardType;
}
export interface JobCardProps extends BaseCardProps {
  id: number;
  type: "job";
  createTime: Date;
  title: string;
}

export interface ProjectCardProps extends BaseCardProps {
  id: number;
  type: "project";
  img: string;
  content: string;
  title: string;
}
export interface NewsCardProps extends BaseCardProps {
  type: "news";
  link: string;
  createTime: Date;
  mediaCompany: string;
  content?: string;
  img?: string;
  title: string;
}

export interface CompanyCardProps extends BaseCardProps {
  type: "company";
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
