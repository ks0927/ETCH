import type { ButtonProps } from "../components/atoms/button";
import CodeSVG from "../components/svg/codeSVG";
import DatabaseSVG from "../components/svg/databaseSVG";
import ServerSVG from "../components/svg/serverSVG";
import ProtectSVG from "../components/svg/protectSVG";
import MobileSVG from "../components/svg/mobileSVG";
import DevOpsSVG from "../components/svg/devOpsSVG";

export const ProjectWriteCategoryData: ButtonProps[] = [
  {
    text: "웹 개발",
    icon: <CodeSVG />,
    checked: false,
  },
  {
    text: "모바일 앱",
    icon: <MobileSVG />,
    checked: false,
  },
  {
    text: "보안",
    icon: <ProtectSVG />,
    checked: false,
  },
  {
    text: "DevOps",
    icon: <DevOpsSVG />,
    checked: false,
  },
  {
    text: "서버",
    icon: <ServerSVG />,
    checked: false,
  },
  {
    text: "데이터베이스",
    icon: <DatabaseSVG />,
    checked: false,
  },
];
