import { useState } from "react";
import ProjectInput from "../../../molecules/project/projectInput";

interface ProjectWriteInputProps {
  inputText: string;
  placeholderText?: string;
}

function ProjectWriteInput({
  inputText,
  placeholderText = "",
}: ProjectWriteInputProps) {
  const [keyword, setKeyword] = useState<string>("");

  const handleInputChange = (value: string) => {
    setKeyword(value);
  };

  return (
    <div>
      <div>{inputText}</div>
      <ProjectInput
        value={keyword}
        type="text"
        placeholder={placeholderText}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default ProjectWriteInput;
