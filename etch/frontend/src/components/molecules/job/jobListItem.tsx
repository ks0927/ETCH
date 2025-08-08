import type { JobItemProps } from "../../atoms/listItem";
import BookmarkSVG from "../../svg/bookmarkSVG";

export default function JobListItem({
  id,
  company,
  location,
  opening_date,
  expiration_date,
  tags,
  onClick
}: JobItemProps) {
  return (
    <div 
      onClick={() => onClick?.(id)}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{company}</h3>
          <span className="text-gray-600 text-sm">{location}</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <BookmarkSVG />
        </button>
      </div>
      <div className="mb-3">
        <div className="text-sm text-gray-500">시작일: {opening_date}</div>
        <div className="text-sm text-gray-500">마감일: {expiration_date}</div>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span 
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}