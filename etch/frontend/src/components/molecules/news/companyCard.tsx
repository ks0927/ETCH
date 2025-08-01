import { Link } from "react-router";
import type { CompanyCardProps } from "../../atoms/card";
import TestImg from "../../../assets/testImg.png";

function CompanyCard({ img, companyName, like }: CompanyCardProps) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full min-w-0">
      <Link to={`/search?q=${companyName}`}>
        {/* 상단 이미지 영역 - 반응형 높이 */}
        <div className="w-full h-20 xs:h-24 sm:h-28 md:h-32 lg:h-36 bg-gray-50 flex items-center justify-center p-2 sm:p-3 lg:p-4">
          <img
            src={img || TestImg}
            alt={`${companyName} 로고`}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* 하단 정보 영역 - 반응형 패딩 */}
        <div className="p-2 sm:p-3 lg:p-4">
          {/* 회사명 - 반응형 텍스트 크기 */}
          <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mb-1 sm:mb-2 text-gray-800 text-center truncate">
            {companyName}
          </div>

          {/* 좋아요 - 반응형 아이콘 및 텍스트 */}
          <div className="flex items-center justify-center text-xs sm:text-sm lg:text-base text-gray-600">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1 fill-red-500"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="font-medium">{like}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CompanyCard;
