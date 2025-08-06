import type { CommentProps } from "../../../atoms/comment";
import ProjectComment from "../../../molecules/project/projectComment";

interface Props {
  comment?: CommentProps[]; // optional로 변경
}

function ProjectDetailComment({ comment = [] }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {comment.map((comments, index) => (
        <ProjectComment
          key={comments.id || index} // id가 없을 경우 index 사용
          {...comments}
        />
      ))}
    </div>
  );
}

export default ProjectDetailComment;
