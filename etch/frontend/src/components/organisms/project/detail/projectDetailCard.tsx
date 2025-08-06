import type { ProjectCardProps } from "../../../atoms/card";
import ProjectModalCard from "../../../molecules/project/projectModalCard";

interface Props {
  project: ProjectCardProps;
}

function ProjectDetailCard({ project }: Props) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <ProjectModalCard {...project} />
      </div>
    </>
  );
}

export default ProjectDetailCard;
