import mainInfo from "../assets/mainInfo.png";
import mainReport from "../assets/mainReport.png";
import mainPortfolio from "../assets/mianPortfolio.png";
import mainTeam from "../assets/mainTeam.png";

export interface funcComponentData {
  title: string;
  content: string;
  img: string;
}

export const funcData: funcComponentData[] = [
  {
    title: "맞춤형 채용 정보",
    content: "관심 직무와 기업에 맞는 채용 정보를 채계적으로 제공합니다.",
    img: mainInfo,
  },
  {
    title: "기업 분석 리포트",
    content: "지원하고자 하는 기업의 채용 정보와 면접 후기를 확인하세요.",
    img: mainReport,
  },
  {
    title: "포트폴리오 생성",
    content: "개인 정보와 프로젝트를 바탕으로 포트폴리오를 생성합니다.",
    img: mainPortfolio,
  },
  {
    title: "프로젝트 팀 구성",
    content: "다양한 팀 스택을 가진 개인 개발자들과 협업할 수 있습니다.",
    img: mainTeam,
  },
];
