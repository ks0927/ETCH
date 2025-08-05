import type { ButtonProps } from "../../../atoms/button";
import ProjectCheckButton from "../../../molecules/project/projectCheckButton";

interface Props {
  categoryData: ButtonProps[];
}

function ProjectCategory({ categoryData }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
      {categoryData.map((data, index) => (
        <ProjectCheckButton key={index} {...data} />
      ))}
    </div>
  );
}

export default ProjectCategory;
