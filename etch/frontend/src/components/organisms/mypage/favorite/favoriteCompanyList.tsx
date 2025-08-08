import { Link } from "react-router";
import type { FavoriteCompanyProps } from "../../../atoms/list";
import FavoriteCompany from "../../../molecules/mypage/favorite/favoriteCompany";
import SeeMore from "../../../svg/seeMore";

interface Props {
  titleText: string;
  subText: string;
  favoriteData: FavoriteCompanyProps[];
}

function FavoriteCompanyList({ titleText, subText, favoriteData }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit space-y-3">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {titleText} ({favoriteData.length})
          </h1>
          <p className="text-sm text-gray-500">{subText}</p>
        </div>
        <div className="flex items-center h-full">
          <Link to={"/mypage/favorites/companies"}>
            <SeeMore />
          </Link>
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-3">
        {favoriteData.length > 0 ? (
          favoriteData
            .slice(0, 5)
            .map((data) => <FavoriteCompany key={data.id} {...data} />)
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">
              관심 기업이 없습니다
            </p>
            <p className="text-gray-400 text-xs mt-1">
              관심있는 기업을 팔로우해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoriteCompanyList;
