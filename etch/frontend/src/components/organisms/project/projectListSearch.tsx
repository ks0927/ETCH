import { useState } from "react";
import { useNavigate } from "react-router";
import ProjectSearchInput from "../../molecules/project/projectSearchInput";
import ProjectSearchButton from "../../molecules/project/projectSearchButton";

function ProjectProjectSearch() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleChange = (value: string) => {
    setKeyword(value);
  };

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      navigate(`/project/search?q=${encodeURIComponent(trimmedKeyword)}`);
      setKeyword("");
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex gap-3">
        <div className="flex-1">
          <ProjectSearchInput
            value={keyword}
            type="text"
            placeholder="프로젝트, 기술 스택, 개발자 검색..."
            onChange={handleChange}
            onKeyEnter={handleKeyEnter}
          />
        </div>
        <ProjectSearchButton
          text="검색"
          color="bg-[#007DFC]"
          textColor="text-white"
          onClick={handleSearchClick}
        />
      </div>
    </div>
  );
}

export default ProjectProjectSearch;
