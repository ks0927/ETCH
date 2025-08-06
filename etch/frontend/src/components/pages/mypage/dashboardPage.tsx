import StatsCards from "../../organisms/mypage/statsCards";
import MyDocuments from "../../organisms/mypage/myDocuments";

const DashboardPage = () => {
  return (
    <div>
      <div>
        <StatsCards />
      </div>
      <div>
        <MyDocuments />
      </div>
      <div>
        <h1>추천 채용공고</h1>
      </div>
    </div>
  );
};

export default DashboardPage;
