import type {
  ProejctStackData,
  ProjectStackEnum,
} from "../../../../types/project/projecStackData";
import ProjectStackButton from "../../../molecules/project/projectStackButton";

interface ProjectStackProps {
  isStackData: ProejctStackData[];
  isSelect: ProjectStackEnum[]; // 배열로 받음
  onStackChange: (stack: ProjectStackEnum) => void; // 개별 스택을 전달
}

function ProjectStack({
  isStackData,
  isSelect,
  onStackChange,
}: ProjectStackProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      {isStackData.map((data) => (
        <ProjectStackButton
          key={data.stack}
          {...data}
          isSelected={isSelect.includes(data.stack)} // 배열에서 포함 여부 확인
          onSelect={() => onStackChange(data.stack)} // 개별 스택 전달
        />
      ))}
    </div>
  );
}

export default ProjectStack;
