import CodeSVG from "../../components/svg/codeSVG";
import DatabaseSVG from "../../components/svg/databaseSVG";
import ServerSVG from "../../components/svg/serverSVG";
import ProtectSVG from "../../components/svg/protectSVG";
import MobileSVG from "../../components/svg/mobileSVG";
import DevOpsSVG from "../../components/svg/devOpsSVG";

export type ProjectCategoryEnum =
  | "WEB"
  | "MOBILE"
  | "SECURITY"
  | "DEVOPS"
  | "SERVER"
  | "DATABASE";

export interface ProjectCategoryData {
  category: ProjectCategoryEnum;
  text: string;
  icon: React.ReactNode;
}

export const ProjectWriteCategoryData: ProjectCategoryData[] = [
  {
    category: "WEB",
    text: "웹 개발",
    icon: <CodeSVG />,
  },
  {
    category: "MOBILE",
    text: "모바일 앱",
    icon: <MobileSVG />,
  },
  {
    category: "SECURITY",
    text: "보안",
    icon: <ProtectSVG />,
  },
  {
    category: "DEVOPS",
    text: "DevOps",
    icon: <DevOpsSVG />,
  },
  {
    category: "SERVER",
    text: "서버",
    icon: <ServerSVG />,
  },
  {
    category: "DATABASE",
    text: "데이터베이스",
    icon: <DatabaseSVG />,
  },
];
