import { useState } from "react";
import LikeSVG from "../../svg/likeSVG";
import ViewSVG from "../../svg/viewSVG";
import noImg from "../../../assets/noImg.png";
import { likeProject, unlikeProject } from "../../../api/projectApi";

// 필요한 필드만 선택적으로 받는 인터페이스
interface Props {
  id: number;
  title: string;
  thumbnailUrl?: string;
  type: "project";
  viewCount: number;
  likeCount: number;
  likedByMe?: boolean; // 현재 사용자가 좋아요했는지 여부
  nickname: string;
  onCardClick: (id: number) => void;
  onLikeUpdate?: (
    projectId: number,
    newLikeCount: number,
    isLiked: boolean
  ) => void; // 부모에게 좋아요 상태 변경 알림
}

function ProjectCard({
  id,
  title,
  thumbnailUrl,
  onCardClick,
  viewCount,
  nickname,
  likeCount: initialLikeCount,
  likedByMe = false,
  onLikeUpdate,
}: Props) {
  // 좋아요 상태 관리
  const [currentLikeCount, setCurrentLikeCount] = useState(
    initialLikeCount || 0
  );
  const [isLiked, setIsLiked] = useState(likedByMe);
  const [isLiking, setIsLiking] = useState(false);

  // 로그인 상태 확인
  const isLoggedIn = (): boolean => {
    const token = localStorage.getItem("access_token");
    return !!token;
  };

  const handleCardClick = () => {
    onCardClick(id);
  };

  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 버블링 방지

    if (isLiking) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    try {
      setIsLiking(true);

      // 먼저 UI 상태를 즉시 업데이트 (optimistic update)
      const newIsLiked = !isLiked;
      const newLikeCount = newIsLiked
        ? currentLikeCount + 1
        : currentLikeCount - 1;

      setIsLiked(newIsLiked);
      setCurrentLikeCount(newLikeCount);

      // API 호출
      try {
        if (newIsLiked) {
          await likeProject(id);
        } else {
          await unlikeProject(id);
        }

        // 부모 컴포넌트에 변경사항 알림
        if (onLikeUpdate) {
          onLikeUpdate(id, newLikeCount, newIsLiked);
        }
      } catch (error) {
        // API 호출 실패 시 상태 롤백
        setIsLiked(!newIsLiked);
        setCurrentLikeCount(currentLikeCount);
        throw error;
      }
    } catch (error: unknown) {
      console.error("좋아요 처리 실패:", error);

      if (error instanceof Error) {
        if (error.message?.includes("로그인")) {
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          localStorage.removeItem("access_token");
          window.location.href = "/login";
        } else {
          alert("좋아요 처리 중 오류가 발생했습니다.");
        }
      } else {
        alert("좋아요 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <section className="w-full h-36">
        <img
          className="w-full object-cover h-full"
          src={thumbnailUrl || noImg}
          alt="카드 이미지"
          onError={(e) => {
            e.currentTarget.src = noImg;
          }}
        />
      </section>
      <section className="p-3 sm:p-4">
        <div className="text-lg sm:text-xl lg:text-2xl font-bold line-clamp-2 text-gray-800 mb-2">
          {title || "제목 없음"}
        </div>
        <div className="text-sm sm:text-base text-gray-600 line-clamp-2">
          {nickname || "작성자 없음"}
        </div>
      </section>
      <section className="p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* 좋아요 버튼 */}
          <button
            onClick={handleLikeClick}
            disabled={isLiking || !isLoggedIn()}
            className={`flex items-center gap-1 text-sm transition-colors duration-200 ${
              !isLoggedIn()
                ? "text-gray-400 cursor-not-allowed"
                : isLiked
                ? "text-red-500 hover:text-red-600"
                : "text-gray-500 hover:text-red-500"
            } ${isLiking ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            title={!isLoggedIn() ? "로그인이 필요합니다" : ""}
          >
            <div
              className={`transition-transform duration-200 ${
                isLiked ? "scale-110" : "scale-100"
              }`}
            >
              <LikeSVG isLiked={isLiked} />
            </div>
            <span>{currentLikeCount}</span>
          </button>

          {/* 조회수 */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <ViewSVG />
            <span>{viewCount || 0}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProjectCard;
