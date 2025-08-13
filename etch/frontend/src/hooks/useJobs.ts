import React, { useState } from "react";
import { getJobsList } from "../api/jobApi";
import type { Job } from "../types/job";
import type { JobItemProps } from "../components/atoms/listItem";

// Job API 데이터를 JobItemProps로 변환하는 함수
const convertJobToJobItem = (job: Job): JobItemProps => ({
  id: job.id.toString(),
  companyName: job.companyName,
  companyId: job.companyId,
  regions: job.regions,
  industries: job.industries,
  jobCategories: job.jobCategories,
  workType: job.workType,
  educationLevel: job.educationLevel,
  openingDate: job.openingDate,
  expirationDate: job.expirationDate
});

export const useJobs = () => {
  console.log('[useJobs] Hook initialized');
  const [jobs, setJobs] = useState<JobItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // 채용공고 데이터 로드 함수
  const loadJobs = async (startDate: Date, endDate: Date) => {
    console.log('[loadJobs] Called with dates:', {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
      currentLoading: loading
    });
    
    // 이미 로딩 중이면 새로운 요청을 무시
    if (loading) {
      console.log('[loadJobs] Already loading, skipping request');
      return;
    }
    
    try {
      console.log('[loadJobs] Starting API request');
      setLoading(true);
      setError(null);
      
      const jobsData = await getJobsList({
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      });
      
      console.log('[loadJobs] API response received:', jobsData);
      
      const convertedJobs = jobsData.map(convertJobToJobItem);
      console.log('[loadJobs] Jobs converted:', convertedJobs);
      
      setJobs(convertedJobs);
      console.log('[loadJobs] Jobs state updated');
    } catch (err) {
      console.error('[loadJobs] API 요청 실패:', err);
      setError('채용공고를 불러오는데 실패했습니다.');
    } finally {
      console.log('[loadJobs] Loading finished');
      setLoading(false);
    }
  };

  // 달력 날짜 범위 변경 시 호출 함수
  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    console.log('[handleDateRangeChange] Called with:', {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      hasInitialLoad
    });
    setHasInitialLoad(true);
    setIsInitializing(false);
    loadJobs(startDate, endDate);
  };

  // 초기 로드 (CalendarView가 마운트되지 않을 경우 대비)
  React.useEffect(() => {
    console.log('[useEffect] Initial load check:', { hasInitialLoad });
    if (!hasInitialLoad) {
      console.log('[useEffect] Setting up fallback timer');
      const timer = setTimeout(() => {
        console.log('[useEffect] Timer fired, checking hasInitialLoad:', hasInitialLoad);
        if (!hasInitialLoad) {
          console.log('[useEffect] No initial load detected, triggering fallback');
          const today = new Date();
          const endDate = new Date(today);
          endDate.setDate(today.getDate() + 30);
          handleDateRangeChange(today, endDate);
        }
      }, 1000); // 1초 후에도 로드되지 않으면 수동 로드
      
      return () => {
        console.log('[useEffect] Cleanup timer');
        clearTimeout(timer);
      };
    }
  }, [hasInitialLoad]);

  return {
    jobs,
    loading: loading || isInitializing,
    error,
    loadJobs,
    handleDateRangeChange
  };
};