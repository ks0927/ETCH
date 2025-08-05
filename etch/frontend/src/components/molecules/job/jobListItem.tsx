import type { JobItemProps } from "../../atoms/listItem";

export default function JobListItem({
  id,
  company,
  location,
  deadline,
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
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
      <div className="mb-3">
        <span className="text-sm text-gray-500">마감: {deadline}</span>
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