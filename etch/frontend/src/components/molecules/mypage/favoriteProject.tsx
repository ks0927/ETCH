import type { FavoriteProjectProps } from "../../atoms/list";

interface Props extends FavoriteProjectProps {
  onCardClick: (id: number) => void; // 부모 컴포넌트에서 모달 상태를 관리
}

function FavoriteProject({ id, projectName, writer, img, onCardClick }: Props) {
  const handleClick = () => {
    onCardClick(id);
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group"
      onClick={handleClick}
    >
      {/* 프로젝트 이미지 */}
      <div className="relative w-full h-40 bg-gray-100">
        <img
          src={img}
          alt={projectName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* 프로젝트 정보 */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {projectName}
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
          <span className="truncate">{writer}</span>
        </div>
      </div>
    </div>
  );
}

export default FavoriteProject;
