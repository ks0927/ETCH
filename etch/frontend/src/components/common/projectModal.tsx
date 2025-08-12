import { useEffect } from "react";
import ProjectDetailComment from "../organisms/project/detail/projectDetailComment";
import type { ProjectData } from "../../types/project/projectDatas";
import ProjectDetailCard from "../organisms/project/detail/projectDetailCard";

interface Props {
  project: ProjectData; // ProjectCardProps → ProjectData로 변경
  onClose: () => void;
}

function ProjectModal({ project, onClose }: Props) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // 배경 클릭으로 모달 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl flex w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="모달 닫기"
        >
          ✕
        </button>

        {/* 왼쪽: 프로젝트 정보 */}
        <div className="w-[60%] flex flex-col p-6 overflow-y-auto">
          <ProjectDetailCard project={project} />
        </div>

        {/* 오른쪽: 댓글 섹션 */}
        <div className="w-[40%] border-l border-gray-200 flex flex-col p-5 overflow-y-auto bg-gray-50">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            댓글 (0) {/* ProjectData에 commentCount가 없으므로 기본값 */}
          </h2>
          <ProjectDetailComment
            comment={[]} // ProjectData에 comments가 없으므로 빈 배열
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
