import { useState } from "react";
import type { InputProps } from "../../types/input";
import type { ButtonProps } from "../../types/button";
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
  };

  const inputProps: InputProps = {
    value: keyword,
    type: "text",
    placeholder: "검색어를 입력하세요",
    onChange: handleChange,
  };

  const buttonProps: ButtonProps = {
    img: searchIcon,
    onClick: handleSearchClick,
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Input {...inputProps} />
      <Button {...buttonProps} />
    </div>
  );
}

export default HeaderSearch;
