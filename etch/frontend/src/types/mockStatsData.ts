import type { StatsCardData } from "../components/atoms/card";

export const mockStatsData: StatsCardData[] = [
  {
    title: "진행중인 지원",
    type: "stats",
    value: 3,
    icon: "🏢",
    color: "text-blue-600",
  },
  {
    title: "관심 기업",
    type: "stats",
    value: 12,
    icon: "❤️",
    color: "text-green-600",
  },
  {
    title: "등록한 프로젝트",
    type: "stats",
    value: 8,
    icon: "📁",
    color: "text-purple-600",
  },
];
