import { Link } from "react-router";
import type { NewsCardProps } from "../../atoms/card";

function NewsCard({ title, url, publishedAt, description }: NewsCardProps) {
  // 날짜 포맷팅 함수 (선택사항)
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString; // 파싱 실패시 원본 반환
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-3 sm:p-4">
        <Link to={url} target="_blank" rel="noopener noreferrer">
          <div className="text-base sm:text-lg font-bold mb-2 line-clamp-2 text-gray-800 hover:text-blue-600 transition-colors">
            {title}
          </div>

          {/* description이 있으면 표시 */}
          {description && (
            <div className="text-sm text-gray-600 mb-2 line-clamp-2">
              {description}
            </div>
          )}

          <div className="flex justify-between items-start text-gray-500 text-sm">
            {/* 발행일 */}
            <div className="text-xs sm:text-sm whitespace-nowrap">
              {formatDate(publishedAt)}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default NewsCard;
