import type { mockProjectData } from "../../../types/mockProjectData.ts";
import ProcjectCard from "../../molecules/main/projectCard.tsx";

interface Props {
  mockProjects: mockProjectData[];
}
function MainProjectCard({ mockProjects }: Props) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-4">
      {mockProjects.slice(0, 4).map((project) => (
        <ProcjectCard
          key={project.id}
          id={project.id}
          img={project.img}
          title={project.title}
          content={project.content}
          type="project"
        />
      ))}
    </div>
  );
}
export default MainProjectCard;
