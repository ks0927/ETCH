import { useState } from "react";
import JobHeader from "../../organisms/job/jobHeader";
import JobList from "../../organisms/job/jobList";
import { mockJobList } from "../../../types/mock/mockJobListData";
import CalendarView from "../../organisms/job/calendarView";

export default function JobPage() {
  const [currentView, setCurrentView] = useState<"list" | "calendar">(
    "calendar"
  );

  const handleViewChange = (view: "list" | "calendar") => {
    setCurrentView(view);
  };

  const handleFilterClick = () => {
    console.log("필터 클릭됨");
  };

  const handleJobClick = (jobId: string) => {
    console.log("채용공고 클릭됨:", jobId);
  };

  return (
    <div>
      <JobHeader
        currentView={currentView}
        onViewChange={handleViewChange}
        onFilterClick={handleFilterClick}
      />
      {currentView === "list" && (
        <JobList jobs={mockJobList} onJobClick={handleJobClick} />
      )}
      {currentView === "calendar" && (
        <CalendarView jobList={mockJobList} onEventClick={handleJobClick} />
      )}
    </div>
  );
}
