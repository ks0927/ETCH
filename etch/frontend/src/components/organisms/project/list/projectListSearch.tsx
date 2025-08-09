import { useState } from "react";
import { useNavigate } from "react-router";
import ProjectInput from "../../../molecules/project/projectInput";
import ProjectButton from "../../../molecules/project/projectButton";

function ProjectListSearch() {
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
          <ProjectInput
            value={keyword}
            type="text"
            placeholderText="프로젝트, 기술 스택, 개발자 검색..."
            onChange={handleChange}
            onKeyEnter={handleKeyEnter}
          />
        </div>
        <ProjectButton
          text="검색"
          bgColor="bg-[#007DFC]"
          textColor="text-white"
          onClick={handleSearchClick}
          css="px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
        />
      </div>
    </div>
  );
}

export default ProjectListSearch;
