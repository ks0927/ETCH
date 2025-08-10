import { useState, useEffect } from "react";
import type { JobItemProps } from "../../atoms/listItem";
import JobDetailTabs from "../../molecules/job/jobDetailTabs";
import JobDetailTabContent from "../../molecules/job/jobDetailTabContent";

interface JobDetailModalProps {
  job: JobItemProps;
  onClose: () => void;
}

export default function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "company" | "news">(
    "details"
  );

  // 모달 열릴 때 body 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
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
          <h2 className="text-xl font-bold">{job.company}</h2>
          <p className="mt-1 text-blue-100">{job.location}</p>
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
          <JobDetailTabContent activeTab={activeTab} job={job} />
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            닫기
          </button>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-pink-600 border border-pink-200 rounded-lg hover:bg-pink-50">
              ❤️ 관심기업 등록
            </button>
            <button className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              📝 지원하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
