import type { JobItemProps } from "../../atoms/listItem";
import BookmarkSVG from "../../svg/bookmarkSVG";

export default function JobListItem({
  id,
  title,
  companyName,
  regions,
  industries,
  jobCategories,
  workType,
  educationLevel,
  openingDate,
  expirationDate,
  onClick,
}: JobItemProps) {
  // 태그들을 조합 (배열이 아닐 수 있으므로 안전하게 처리)
  const safeRegions = Array.isArray(regions) ? regions : [];
  const safeJobCategories = Array.isArray(jobCategories) ? jobCategories : [];
  const safeIndustries = Array.isArray(industries) ? industries : [];
  const allTags = [
    ...safeJobCategories,
    ...safeIndustries,
    workType,
    educationLevel,
  ].filter(Boolean);

  return (
    <div
      onClick={() => onClick?.(id)}
      className="p-4 transition-shadow bg-white border border-gray-200 rounded-lg cursor-pointer hover:shadow-md h-48 flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="mb-1 text-lg font-semibold text-gray-900 truncate">
            {title || companyName}
          </h3>
          <span className="text-sm text-gray-600 truncate block">
            {companyName}
          </span>
          <span className="text-xs text-gray-500 truncate block">
            {safeRegions.join(", ") || "위치 정보 없음"}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
          <BookmarkSVG />
        </button>
      </div>
      <div className="mb-3">
        <div className="text-sm text-gray-500">
          시작일: {new Date(openingDate).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-500">
          마감일: {new Date(expirationDate).toLocaleDateString()}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-auto overflow-hidden" style={{ maxHeight: '60px' }}>
        {allTags.slice(0, 4).map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-md whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
        {allTags.length > 4 && (
          <span className="px-2 py-1 text-xs text-gray-600 bg-gray-300 rounded-md">
            +{allTags.length - 4}
          </span>
        )}
      </div>
    </div>
  );
}
