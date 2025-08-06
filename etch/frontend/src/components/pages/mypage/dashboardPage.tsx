import StatsCards from "../../organisms/mypage/statsCards";
import MyDocuments from "../../organisms/mypage/myDocuments";
import RecommendedJobs from "../../organisms/mypage/recommendedJobs";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <StatsCards />
      </div>
      <div>
        <MyDocuments />
      </div>
      <div>
        <RecommendedJobs />
      </div>
    </div>
  );
};

export default DashboardPage;
