import type { ButtonProps } from "../../../atoms/button";
import ProjectCheckButton from "../../../molecules/project/projectCheckButton";

interface Props {
  categoryData: ButtonProps[];
}

function ProjectCategory({ categoryData }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      {categoryData.map((data, index) => (
        <ProjectCheckButton key={index} {...data} />
      ))}
    </div>
  );
}

export default ProjectCategory;
