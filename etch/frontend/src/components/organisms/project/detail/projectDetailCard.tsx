import type {
  ProjectData,
  ProjectModalData,
} from "../../../../types/project/projectDatas";
import ProjectModalCard from "../../../molecules/project/projectModalCard";

// 🎯 Props 인터페이스 통합 및 onLike 추가
interface Props {
  project: ProjectData;
  onLike?: () => void; // 좋아요 핸들러 추가
}

function ProjectDetailCard({ project, onLike }: Props) {
  // ProjectData를 ProjectModalData로 변환 (type만 추가)
  const modalProject: ProjectModalData = {
    ...project,
    type: "project",
    // 🎯 onLike 핸들러도 추가 (ProjectModalData 타입에 있다면)
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 🎯 onLike를 ProjectModalCard에 전달 */}
      <ProjectModalCard
        {...modalProject}
        onLike={onLike} // 좋아요 핸들러 전달
      />
    </div>
  );
}

export default ProjectDetailCard;
