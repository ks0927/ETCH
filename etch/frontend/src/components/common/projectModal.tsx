import { useEffect } from "react";
import ProjectDetailComment from "../organisms/project/detail/projectDetailComment";
import type { ProjectData } from "../../types/project/projectDatas";
import ProjectDetailCard from "../organisms/project/detail/projectDetailCard";
// 🎯 필요한 API 함수들 import
import { likeProject, unlikeProject } from "../../api/projectApi";

interface Props {
  project: ProjectData;
  onClose: () => void;
  onProjectUpdate?: (updatedProject: ProjectData) => void; // 🎯 optional prop 추가
}

function ProjectModal({ project, onClose, onProjectUpdate }: Props) {
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

  // 🎯 좋아요 처리 함수
  const handleLike = async () => {
    try {
      console.log("좋아요 처리 시작:", project.likedByMe);

      if (project.likedByMe) {
        await unlikeProject(project.id);
        console.log("좋아요 취소 성공");

        // 상태 업데이트
        const updatedProject = {
          ...project,
          likedByMe: false,
          likeCount: project.likeCount - 1,
        };
        onProjectUpdate?.(updatedProject);
      } else {
        await likeProject(project.id);
        console.log("좋아요 추가 성공");

        // 상태 업데이트
        const updatedProject = {
          ...project,
          likedByMe: true,
          likeCount: project.likeCount + 1,
        };
        onProjectUpdate?.(updatedProject);
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
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
          {/* 🎯 좋아요 핸들러를 ProjectDetailCard에 전달 */}
          <ProjectDetailCard
            project={project}
            onLike={handleLike} // 좋아요 핸들러 전달
          />
        </div>

        {/* 오른쪽: 댓글 섹션 */}
        <div className="w-[40%] border-l border-gray-200 flex flex-col p-5 overflow-y-auto bg-gray-50">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            댓글 ({project.commentCount || 0}) {/* commentCount 사용 */}
          </h2>
          <ProjectDetailComment
            comment={[]} // 실제 댓글 데이터로 교체 필요
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
