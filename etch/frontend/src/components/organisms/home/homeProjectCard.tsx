import type { ProjectCardProps } from "../../atoms/card.tsx";
import ProcjectCard from "../../molecules/home/projectCard.tsx";

interface Props {
  mockProjects: ProjectCardProps[];
}
function HomeProjectCard({ mockProjects }: Props) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-4">
      {mockProjects.slice(0, 4).map((project) => (
        <ProcjectCard {...project} type="project" />
      ))}
    </div>
  );
}
export default HomeProjectCard;
