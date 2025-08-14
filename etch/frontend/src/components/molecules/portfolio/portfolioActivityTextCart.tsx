import type { education } from "../../../types/portfolio/portfolioDatas";

function PortfolioEducationTextCard({
  education,
  onRemove,
}: {
  education: education[];
  onRemove?: (index: number) => void;
}) {
  if (education.length === 0) {
    return (
      <div className="text-gray-500 p-4 text-center">
        등록된 활동이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {education.map((education, index) => (
        <div
          key={index}
          className="relative p-4 bg-blue-50 border-l-4 border-blue-400 rounded"
        >
          <div className="font-semibold text-blue-700">
            {education.companyName}
          </div>
          <div className="text-sm font-medium text-blue-600">
            {education.active}
          </div>
          <div className="text-sm text-gray-600">
            {education.startAt} ~ {education.endAt}
          </div>
          {onRemove && (
            <button
              onClick={() => onRemove(index)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
            >
              삭제
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default PortfolioEducationTextCard;
