import { useState, useEffect } from "react";
import type { JobItemProps } from "../../atoms/listItem";
import JobDetailTabs from "../../molecules/job/jobDetailTabs";
import JobDetailTabContent from "../../molecules/job/jobDetailTabContent";
import { useJobDetail } from "../../../hooks/useJobDetail";
import { applyJob } from "../../../api/appliedJobApi";
import { likeApi } from "../../../api/likeApi";

interface JobDetailModalProps {
  job: JobItemProps;
  onClose: () => void;
}

export default function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "company" | "news">(
    "details"
  );
  const [isApplying, setIsApplying] = useState(false);
  const [isAddingToFavorite, setIsAddingToFavorite] = useState(false);

  // 새로운 useJobDetail hook 사용
  const {
    jobDetail,
    companyInfo,
    companyNews,
    isLoading,
    jobError,
    companyError,
    newsError,
  } = useJobDetail(job.id, job.companyId);

  // 지원하기 버튼 핸들러
  const handleApplyJob = async () => {
    try {
      setIsApplying(true);
      await applyJob(Number(job.id));
      alert("마이페이지의 지원현황에 추가되었습니다!");
    } catch (error: any) {
      console.error("지원하기 실패:", error);
      if (error.response?.data.message === "이미 지원한 공고입니다.") {
        alert("이미 지원한 공고입니다.");
      } else {
        alert("지원하기에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsApplying(false);
    }
  };

  // 관심기업 등록 핸들러
  const handleAddToFavorite = async () => {
    try {
      setIsAddingToFavorite(true);
      await likeApi.companies.addLike(Number(job.companyId));
      alert("관심기업으로 등록되었습니다!");
    } catch (error: any) {
      console.error("관심기업 등록 실패:", error);
      if (error.response?.data.message === "이미 좋아요를 누른 콘텐츠입니다.") {
        alert("이미 관심기업으로 등록된 회사입니다.");
      } else {
        alert("관심기업 등록에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsAddingToFavorite(false);
    }
  };

  // 모달 열릴 때 body 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 헤더 - 파란색 그라데이션 */}
        <div className="relative px-6 py-4 text-white bg-gradient-to-r from-blue-500 to-blue-600">
          <h2 className="text-xl font-bold">{job.title}</h2>
          <p className="mt-1 font-medium text-blue-100">{job.companyName}</p>
          <button
            onClick={onClose}
            className="absolute text-2xl text-white top-4 right-6 hover:text-blue-100"
          >
            ×
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <JobDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 탭 컨텐츠 */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-lg text-gray-600">
                데이터를 불러오는 중...
              </div>
            </div>
          ) : (
            <JobDetailTabContent
              activeTab={activeTab}
              job={job}
              jobDetail={jobDetail}
              companyInfo={companyInfo}
              companyNews={companyNews}
              errors={{
                jobError,
                companyError,
                newsError,
              }}
            />
          )}
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            닫기
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleAddToFavorite}
              disabled={isAddingToFavorite}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
                isAddingToFavorite
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-pink-600 border-pink-200 hover:bg-pink-50"
              }`}
            >
              {isAddingToFavorite ? "⏳" : "❤️"}
              {isAddingToFavorite ? "등록 중..." : "관심기업 등록"}
            </button>
            <button
              onClick={handleApplyJob}
              disabled={isApplying}
              className={`px-6 py-2 text-white rounded-lg ${
                isApplying
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isApplying ? "⏳ 지원 중..." : "📝 지원하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
