import type { PortfolioProject } from "../../../types/portfolio/portfolioDatas";

function PortfolioProjectTextCard({
  projects,
  onRemove,
}: {
  projects: PortfolioProject[];
  onRemove?: (index: number) => void;
}) {
  if (projects.length === 0) {
    return (
      <div className="text-gray-500 p-4 text-center">등록된 없습니다.</div>
    );
  }

  return (
    <div className="space-y-2">
      {projects.map((project, index) => (
        <div
          key={index}
          className="relative p-4 bg-blue-50 border-l-4 border-blue-400 rounded"
        >
          <div className="font-semibold text-blue-700">
            {project.projectName}
          </div>
          <div className="text-sm font-medium text-blue-600">
            {project.comment}
          </div>
          <div className="text-sm font-medium text-blue-600">
            {project.content}
          </div>
          <div className="text-sm font-medium text-blue-600">
            {project.githubURL}
          </div>
          <div className="text-sm text-gray-600">
            {project.startAt} ~ {project.endAt}
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

export default PortfolioProjectTextCard;
