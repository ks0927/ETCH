import { mockFavoriteCompanyData } from "../../../../types/mockFavoriteCompanyData";
import DetailCompanyList from "../../../organisms/mypage/favorite/detail/detailCompanyList";

function DetailFavoriteCompany() {
  return (
    <div>
      <DetailCompanyList
        titleText="관심 기업"
        subText="팔로우한 기업들"
        favoriteData={mockFavoriteCompanyData}
      />
    </div>
  );
}

export default DetailFavoriteCompany;
