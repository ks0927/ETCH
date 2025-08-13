import DeadlineItem from "../../../molecules/mypage/deadlineItem";
import type { DeadlineItemProps } from "../../../atoms/listItem";

interface UpcomingDeadlinesProps {
  deadlines: DeadlineItemProps[];
  onClick?: (id: string) => void;
}

const UpcomingDeadlines = ({ deadlines, onClick }: UpcomingDeadlinesProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-red-600">⚠️</span>
          <h3 className="text-lg font-semibold text-red-600">
            다가오는 마감일
          </h3>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {deadlines.map((deadline) => (
            <DeadlineItem key={deadline.id} {...deadline} onClick={onClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingDeadlines;
