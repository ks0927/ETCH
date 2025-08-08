import type { FavoriteProjectProps } from "../../../../atoms/list";

interface Props extends FavoriteProjectProps {
  onCardClick?: (projectId: number) => void;
}

function FavoriteProjectCard({
  id,
  projectName,
  writer,
  img,
  writerImg,
  onCardClick,
}: Props) {
  const handleClick = () => {
    onCardClick?.(id);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-gray-200"
    >
      {/* 이미지 섹션 */}
      <div className="relative overflow-hidden bg-gray-100">
        <img
          src={img}
          alt={projectName}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* 콘텐츠 섹션 */}
      <div className="p-4 sm:p-5">
        {/* 프로젝트명 */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {projectName}
        </h3>

        {/* 작성자 */}
        <div className="flex items-center text-sm text-gray-600">
          <img
            src={writerImg}
            alt={writer}
            className="w-6 h-6 rounded-full object-cover mr-2 border border-gray-200"
          />
          <span className="truncate">{writer}</span>
        </div>
      </div>
    </div>
  );
}

export default FavoriteProjectCard;
