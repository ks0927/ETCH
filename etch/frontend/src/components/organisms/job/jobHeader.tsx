import JobViewToggle from "../../molecules/job/jobViewToggle";
import JobFilterButton from "../../molecules/job/jobFilterButton";

interface JobHeaderProps {
  currentView: "list" | "calendar";
  onViewChange: (view: "list" | "calendar") => void;
  onFilterClick: () => void;
}

export default function JobHeader({
  currentView,
  onViewChange,
  onFilterClick,
}: JobHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold">채용공고</h1>
      <div className="flex items-center gap-2">
        <JobViewToggle currentView={currentView} onViewChange={onViewChange} />
        <JobFilterButton onClick={onFilterClick} />
      </div>
    </div>
  );
}
