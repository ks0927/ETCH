import ApplicationItem from "../../../molecules/mypage/applicationItem";
import type { ApplicationItemProps } from "../../../atoms/listItem";

interface ApplicationListProps {
  applications: ApplicationItemProps[];
  onStatusChange?: (id: string) => void;
  onClick?: (id: string) => void;
}

const ApplicationList = ({
  applications,
  onStatusChange,
  onClick,
}: ApplicationListProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold">지원 현황</h3>
        <p className="text-sm text-gray-500">
          현재 지원한 채용 공고의 진행 상황을 확인하고 업데이트하세요
        </p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {applications.map((application) => (
            <ApplicationItem
              key={application.id}
              {...application}
              onClick={onClick}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationList;
