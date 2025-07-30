import { Link } from "react-router";
import type { ProjectCard } from "../atoms/card";

function ProcjectCard({ id, title, content, img }: ProjectCard) {
  return (
    <div className="overflow-hidden border border-gray-600 w-104 rounded-2xl">
      <Link to={`/projects/${id}`}>
        <section className="w-full h-80">
          <img className="object-cover h-full" src={img} alt="카드 이미지" />
        </section>
        <section className="p-4">
          <div className="text-2xl font-bold">{title}</div>
          <div className="text-base">{content}</div>
        </section>
      </Link>
    </div>
  );
}
export default ProcjectCard;
