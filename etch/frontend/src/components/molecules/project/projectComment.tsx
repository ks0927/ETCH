import type { CommentProps } from "../../atoms/comment";

function ProjectComment({
  commentText,
  createTime,
  writer,
  writerImg,
}: CommentProps) {
  // 시간 포맷팅 함수
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      );

      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(
          (now.getTime() - date.getTime()) / (1000 * 60)
        );
        return diffInMinutes <= 0 ? "방금 전" : `${diffInMinutes}분 전`;
      } else if (diffInHours < 24) {
        return `${diffInHours}시간 전`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) {
          return `${diffInDays}일 전`;
        } else {
          return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        }
      }
    } catch {
      return timeString;
    }
  };

  return (
    <div className="flex gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      {/* 프로필 이미지 */}
      <div className="flex-shrink-0">
        <img
          src={writerImg}
          alt={`${writer}의 프로필`}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
        />
      </div>

      {/* 댓글 내용 */}
      <div className="flex-1 min-w-0">
        {/* 작성자 정보 */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-gray-900 text-sm">{writer}</span>
          <span className="text-xs text-gray-500">
            {formatTime(createTime)}
          </span>
        </div>

        {/* 댓글 텍스트 */}
        <div className="text-gray-700 text-sm leading-relaxed break-words">
          {commentText}
        </div>
      </div>
    </div>
  );
}

export default ProjectComment;
