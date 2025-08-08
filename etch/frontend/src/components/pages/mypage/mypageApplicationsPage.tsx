import ApplicationStats from "../../organisms/mypage/applicationStats";
import ApplicationList from "../../organisms/mypage/applicationList";
import UpcomingDeadlines from "../../organisms/mypage/upcomingDeadlines";
import { mockApplicationStats } from "../../../types/mock/mockApplicationStats";
import { mockApplications } from "../../../types/mock/mockApplicationData";
import { mockDeadlines } from "../../../types/mock/mockDeadlineData";

function MypageApplicationsPage() {
  const handleStatusChange = (id: string) => {
    console.log(`Status change requested for application: ${id}`);
  };

  const handleItemClick = (id: string) => {
    console.log(`Item clicked: ${id}`);
  };

  return (
    <div className="space-y-6">
      <ApplicationStats stats={mockApplicationStats} />
      <ApplicationList
        applications={mockApplications}
        onStatusChange={handleStatusChange}
        onClick={handleItemClick}
      />
      <UpcomingDeadlines deadlines={mockDeadlines} onClick={handleItemClick} />
    </div>
  );
}
export default MypageApplicationsPage;
