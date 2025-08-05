import type { ButtonProps } from "../../../atoms/button";
import ProjectCheckButton from "../../../molecules/project/projectCheckButton";

interface Props {
  settingData: ButtonProps[];
}

function ProjectSetting({ settingData }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {settingData.map((data, index) => (
        <div key={index} className="flex-1">
          <ProjectCheckButton {...data} />
        </div>
      ))}
    </div>
  );
}

export default ProjectSetting;
