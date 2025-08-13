import { useRef } from "react";
import JobListItem from "../../molecules/job/jobListItem";
import type { JobItemProps } from "../../atoms/listItem";
import { useLikedJobs } from "../../../hooks/useLikedItems";

interface ExpiringJobsCarouselProps {
  jobs: JobItemProps[];
  onJobClick?: (jobId: string) => void;
  loading?: boolean;
}

export default function ExpiringJobsCarousel({ 
  jobs, 
  onJobClick, 
  loading = false 
}: ExpiringJobsCarouselProps) {
  const { isJobLiked, addLikedJob, removeLikedJob } = useLikedJobs();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleLikeStateChange = (jobId: number, isLiked: boolean) => {
    if (isLiked) {
      addLikedJob(jobId);
    } else {
      removeLikedJob(jobId);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -416, behavior: 'smooth' }); // 카드 + gap (400 + 16)
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 416, behavior: 'smooth' }); // 카드 + gap (400 + 16)
    }
  };

  // 로딩 스켈레톤 UI
  if (loading) {
    return (
      <div className="relative">
        <div className="flex gap-4 overflow-hidden">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[400px] h-48 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // 데이터가 없을 때
  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="mb-2 text-2xl">📅</div>
          <div className="text-sm">마감 임박한 채용공고가 없습니다</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 좌측 네비게이션 버튼 */}
      {jobs.length > 3 && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* 캐러셀 컨테이너 */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {jobs.map((job) => (
          <div key={job.id} className="flex-shrink-0 w-[400px]">
            <JobListItem 
              {...job} 
              onClick={onJobClick} 
              isLiked={isJobLiked(Number(job.id))}
              onLikeStateChange={handleLikeStateChange}
            />
          </div>
        ))}
      </div>

      {/* 우측 네비게이션 버튼 */}
      {jobs.length > 3 && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}