import StatsCard from "../../molecules/mypage/statsCard";
import { mockStatsData } from "../../../types/mockStatsData";

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {mockStatsData.map((stats, index) => (
        <StatsCard
          key={index}
          title={stats.title}
          type={stats.type}
          value={stats.value}
          icon={stats.icon}
          color={stats.color}
        />
      ))}
    </div>
  );
};

export default StatsCards;