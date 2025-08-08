import StatsCard from "../../molecules/mypage/statsCard";
import type { StatsCardData } from "../../atoms/card";

interface ApplicationStatsProps {
  stats: StatsCardData[];
}

const ApplicationStats = ({ stats }: ApplicationStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default ApplicationStats;