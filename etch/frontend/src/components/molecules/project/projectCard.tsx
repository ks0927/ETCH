import type { ProjectCardProps } from "../../atoms/card";

interface Props extends ProjectCardProps {
  onCardClick: (id: number) => void; // 부모 컴포넌트에서 모달 상태를 관리
  type: "project";
}

function ProjectCard({ id, title, content, img, onCardClick }: Props) {
  const handleClick = () => {
    onCardClick(id);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <section className="w-full h-36">
        <img
          className="w-full object-cover h-full"
          src={img}
          alt="카드 이미지"
        />
      </section>
      <section className="p-3 sm:p-4">
        <div className="text-lg sm:text-xl lg:text-2xl font-bold line-clamp-2 text-gray-800 mb-2">
          {title}
        </div>
        <div className="text-sm sm:text-base text-gray-600 line-clamp-2">
          {content}
        </div>
      </section>
    </div>
  );
}

export default ProjectCard;
