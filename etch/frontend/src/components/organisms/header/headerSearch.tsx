import React, { useState } from "react";
import searchIcon from "../../../assets/search.png";
import { useNavigate } from "react-router";
import HeaderButton from "../../molecules/header/headerButton";
import HeaderInput from "../../molecules/header/headerInput";

function HeaderSearch() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleChange = (value: string) => {
    setKeyword(value);
  };

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      navigate(`/search?q=${encodeURIComponent(trimmedKeyword)}`);
      setKeyword(""); // 검색 후 입력창 초기화
    }
  };

  const handleSearchClick = () => {
    handleSearch();
  };

  const handleKeyEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch(); // Enter 키로 검색 실행
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <HeaderInput
        value={keyword}
        type="text"
        placeholderText="검색어를 입력하세요"
        onChange={handleChange}
        onKeyEnter={handleKeyEnter} // 키보드 이벤트 핸들러 추가
      />
      <HeaderButton img={searchIcon} onClick={handleSearchClick} />
    </div>
  );
}

export default HeaderSearch;
