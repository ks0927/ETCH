import React, { useState } from "react";
import Input from "../atoms/input";
import Button from "../atoms/button";
import searchIcon from "../../assets/search.png";

interface HeaderSearchProps {
  onSearch: (keyword: string) => void;
}

function HeaderSearch({ onSearch }: HeaderSearchProps) {
  const [keyword, setKeyword] = useState("");

  const handleChange = (value: string) => {
    setKeyword(value);
  };

  const handleSearchClick = () => {
    onSearch(keyword);
    setKeyword(""); // 검색 후 입력창 초기화
  };

  const handleKeyEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSearch(keyword); // Enter 키로 검색 실행
      setKeyword(""); // 검색 후 입력창 초기화
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Input
        value={keyword}
        type="text"
        placeholder="검색어를 입력하세요"
        onChange={handleChange}
        onKeyEnter={handleKeyEnter} // 키보드 이벤트 핸들러 추가
      />
      <Button img={searchIcon} onClick={handleSearchClick} />
    </div>
  );
}

export default HeaderSearch;
