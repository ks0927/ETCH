import { useState } from "react";
import JobHeader from "../../organisms/job/jobHeader";
import JobList from "../../organisms/job/jobList";
import CalendarView from "../../organisms/job/calendarView";
import JobDetailModal from "../../organisms/job/jobDetailModal";
import { useJobs } from "../../../hooks/useJobs";

export default function JobPage() {
  console.log('[JobPage] Component rendered');
  
  const [currentView, setCurrentView] = useState<"list" | "calendar">(
    "calendar"
  );
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  // custom hook 사용
  const { jobs, loading, error, handleDateRangeChange } = useJobs();
  
  console.log('[JobPage] Current state:', {
    currentView,
    selectedJobId,
    jobsCount: jobs.length,
    loading,
    error
  });

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

  const selectedJob = jobs.find((job) => job.id === selectedJobId);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <JobHeader
        currentView={currentView}
        onViewChange={handleViewChange}
        onFilterClick={handleFilterClick}
      />

      {/* 로딩 상태 표시 */}
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="text-lg text-gray-600">채용공고를 불러오는 중...</div>
        </div>
      )}

      {currentView === "list" && (
        <JobList jobs={jobs} onJobClick={handleJobClick} />
      )}
      {currentView === "calendar" && (
        <CalendarView
          jobList={jobs}
          onEventClick={handleJobClick}
          onDateRangeChange={handleDateRangeChange}
        />
      )}

      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={handleCloseModal} />
      )}
    </div>
  );
}
