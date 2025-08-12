import { useState } from "react";
import { useNavigate } from "react-router";
import ProjectInput from "../../../molecules/project/projectInput";
import ProjectButton from "../../../molecules/project/projectButton";

interface Props {
  onSearch: (searchTerm: string) => void;
}

function ProjectListSearch({ onSearch }: Props) {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleChange = (value: string) => {
    setKeyword(value);
    // 실시간 검색: 입력할 때마다 검색 실행
    onSearch(value);
  };

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();
    onSearch(trimmedKeyword);

    // 검색 페이지로 이동도 유지 (선택사항)
    if (trimmedKeyword) {
      navigate(`/project/search?q=${encodeURIComponent(trimmedKeyword)}`);
    }
  };

  const handleSearchClick = () => {
    handleSearch();
  };

  const handleKeyEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setKeyword("");
    onSearch(""); // 검색 초기화
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <ProjectInput
            value={keyword}
            type="text"
            placeholderText="프로젝트, 기술 스택, 개발자 검색..."
            onChange={handleChange}
            onKeyEnter={handleKeyEnter}
          />
          {/* 검색어 지우기 버튼 */}
          {keyword && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="검색어 지우기"
            >
              ✕
            </button>
          )}
        </div>
        <ProjectButton
          text="검색"
          bgColor="bg-[#007DFC]"
          textColor="text-white"
          onClick={handleSearchClick}
          css="px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
        />
      </div>

      {/* 검색 결과 안내 */}
      {keyword && (
        <div className="mt-3 text-sm text-gray-600">'{keyword}' 검색 중...</div>
      )}
    </div>
  );
}

export default ProjectListSearch;
