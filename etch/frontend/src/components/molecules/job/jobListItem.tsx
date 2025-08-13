import type { JobItemProps } from "../../atoms/listItem";
import BookmarkSVG from "../../svg/bookmarkSVG";

export default function JobListItem({
  id,
  companyName,
  regions,
  industries,
  jobCategories,
  workType,
  educationLevel,
  openingDate,
  expirationDate,
  onClick
}: JobItemProps) {
  // 태그들을 조합 (배열이 아닐 수 있으므로 안전하게 처리)
  const safeRegions = Array.isArray(regions) ? regions : [];
  const safeJobCategories = Array.isArray(jobCategories) ? jobCategories : [];
  const safeIndustries = Array.isArray(industries) ? industries : [];
  const allTags = [...safeJobCategories, ...safeIndustries, workType, educationLevel].filter(Boolean);
  
  return (
    <div 
      onClick={() => onClick?.(id)}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{companyName}</h3>
          <span className="text-gray-600 text-sm">{safeRegions.join(", ") || "위치 정보 없음"}</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <BookmarkSVG />
        </button>
      </div>
      <div className="mb-3">
        <div className="text-sm text-gray-500">시작일: {new Date(openingDate).toLocaleDateString()}</div>
        <div className="text-sm text-gray-500">마감일: {new Date(expirationDate).toLocaleDateString()}</div>
      </div>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag, index) => (
          <span 
            key={`${tag}-${index}`}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}