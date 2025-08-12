import FavoriteProjectList from "../../organisms/mypage/favorite/favoriteProjectList";

function MypageFavoritePage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* 상단 영역: 관심 기업과 관심 공고 */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1">
          {/* <FavoriteCompanyList
            titleText="관심 기업"
            subText="팔로우한 기업들"
            // favoriteData prop 제거 - 컴포넌트 내부에서 API 호출
          /> */}
        </div>
        <div className="flex-1">
          {/* <FavoriteJobList
            titleText="관심 공고"
            subText="북마크한 채용공고"
            // favoriteData prop 제거 - 컴포넌트 내부에서 API 호출
          /> */}
        </div>
      </div>

      {/* 하단 영역: 관심 프로젝트 */}
      <div className="w-full">
        <FavoriteProjectList
          titleText="관심 프로젝트"
          subText="좋아요한 프로젝트"
          sliceCount={4}
          // favoriteData, mockProjects props 제거 - 컴포넌트 내부에서 API 호출
        />
      </div>
    </div>
  );
}

export default MypageFavoritePage;
