import { Link } from "react-router";
import type { NewsCardProps } from "../../atoms/card";

function NewsCard({ id, title, company, createTime }: NewsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-3 sm:p-4">
        <Link to={`/news/${id}`}>
          <div className="text-base sm:text-lg font-bold mb-2 line-clamp-2 text-gray-800">
            {title}
          </div>
          <div className="flex justify-between items-start text-gray-500 text-sm">
            <div className="flex-1 mr-2 line-clamp-1">{company}</div>
            <div className="text-xs sm:text-sm whitespace-nowrap">
              {createTime.toLocaleDateString()}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default NewsCard;
