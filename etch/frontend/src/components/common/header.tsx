import { Link } from "react-router";
import HeaderSearch from "../organisms/headerSearch";
import LogoImg from "../../assets/logo.png";

function Header() {
  return (
    <>
      <header className="bg-white ">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* 왼쪽 메뉴 */}
          <div className="flex flex-col items-center gap-4 space-x-5 md:flex-row">
            <Link to={"/"}>
              <img src={LogoImg} alt="로고" className="w-36" />
            </Link>
            <Link to={"/jobs"} className="text-sm md:text-base ">
              채용공고
            </Link>
            <Link to={"/news"} className="text-sm md:text-base ">
              뉴스
            </Link>
            <Link to={"/project"} className="text-sm md:text-base">
              프로젝트
            </Link>
          </div>

          {/* 오른쪽 검색 + 프로필 */}
          <div className="flex flex-col items-center w-full gap-4 md:flex-row md:w-auto">
            <HeaderSearch />
            <Link to={"/mypage"}>
              <img src="src/assets/profile.png" className="w-10" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
