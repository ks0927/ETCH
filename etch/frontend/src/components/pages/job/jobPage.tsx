import { useState } from "react";
import JobHeader from "../../organisms/job/jobHeader";
import JobList from "../../organisms/job/jobList";
import { mockJobList } from "../../../types/mock/mockJobListData";
import CalendarView from "../../organisms/job/calendarView";
import JobDetailModal from "../../organisms/job/jobDetailModal";

export default function JobPage() {
  const [currentView, setCurrentView] = useState<"list" | "calendar">(
    "calendar"
  );
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const handleViewChange = (view: "list" | "calendar") => {
    setCurrentView(view);
  };

  const handleFilterClick = () => {
    console.log("필터 클릭됨");
  };

  const handleJobClick = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  const handleCloseModal = () => {
    setSelectedJobId(null);
  };

  const selectedJob = mockJobList.find(job => job.id === selectedJobId);

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
      
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
