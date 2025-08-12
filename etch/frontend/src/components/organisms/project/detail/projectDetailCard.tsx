import type {
  ProjectData,
  ProjectModalData,
} from "../../../../types/project/projectDatas";
import ProjectModalCard from "../../../molecules/project/projectModalCard";

interface Props {
  project: ProjectData;
}

function ProjectDetailCard({ project }: Props) {
  // ProjectData를 ProjectModalData로 변환 (type만 추가)
  const modalProject: ProjectModalData = {
    ...project,
    type: "project",
  };

  return (
    <div className="flex flex-col gap-4">
      <ProjectModalCard {...modalProject} />
    </div>
  );
}

export default ProjectDetailCard;
