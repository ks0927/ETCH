import { useState, useEffect } from 'react';
import { getJob } from '../api/jobApi';
import { getCompany } from '../api/companyApi';
import { getCompanyNews } from '../api/newsApi';
import type { Job } from '../types/job';
import type { Company } from '../types/companyData';
import type { News } from '../types/newsTypes';

interface UseJobDetailReturn {
  // 데이터
  jobDetail: Job | null;
  companyInfo: Company | null;
  companyNews: News[];
  
  // 로딩 상태
  jobLoading: boolean;
  companyLoading: boolean;
  newsLoading: boolean;
  
  // 에러 상태
  jobError: string | null;
  companyError: string | null;
  newsError: string | null;
  
  // 전체 로딩 상태 (3개 API 중 하나라도 로딩 중이면 true)
  isLoading: boolean;
}

export const useJobDetail = (jobId: string, companyId: number): UseJobDetailReturn => {
  // 데이터 상태
  const [jobDetail, setJobDetail] = useState<Job | null>(null);
  const [companyInfo, setCompanyInfo] = useState<Company | null>(null);
  const [companyNews, setCompanyNews] = useState<News[]>([]);
  
  // 로딩 상태
  const [jobLoading, setJobLoading] = useState(false);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);
  
  // 에러 상태
  const [jobError, setJobError] = useState<string | null>(null);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [newsError, setNewsError] = useState<string | null>(null);

  // 1. 채용공고 상세 정보 로드
  const loadJobDetail = async () => {
    if (!jobId) return;
    
    try {
      setJobLoading(true);
      setJobError(null);
      console.log(`[useJobDetail] Loading job detail: ${jobId}`);
      
      const job = await getJob(Number(jobId));
      setJobDetail(job);
      console.log(`[useJobDetail] Job detail loaded:`, job);
    } catch (error) {
      console.error(`[useJobDetail] Job detail loading failed:`, error);
      setJobError('채용공고 정보를 불러오는데 실패했습니다.');
    } finally {
      setJobLoading(false);
    }
  };

  // 2. 기업 정보 로드
  const loadCompanyInfo = async () => {
    if (!companyId) return;
    
    try {
      setCompanyLoading(true);
      setCompanyError(null);
      console.log(`[useJobDetail] Loading company info: ${companyId}`);
      
      const company = await getCompany(companyId);
      setCompanyInfo(company);
      console.log(`[useJobDetail] Company info loaded:`, company);
    } catch (error) {
      console.error(`[useJobDetail] Company info loading failed:`, error);
      setCompanyError('기업 정보를 불러오는데 실패했습니다.');
    } finally {
      setCompanyLoading(false);
    }
  };

  // 3. 기업 뉴스 로드
  const loadCompanyNews = async () => {
    if (!companyId) return;
    
    try {
      setNewsLoading(true);
      setNewsError(null);
      console.log(`[useJobDetail] Loading company news: ${companyId}`);
      
      const news = await getCompanyNews(companyId, 1, 5); // 최신 5개만
      setCompanyNews(news);
      console.log(`[useJobDetail] Company news loaded:`, news);
    } catch (error) {
      console.error(`[useJobDetail] Company news loading failed:`, error);
      setNewsError('기업 뉴스를 불러오는데 실패했습니다.');
    } finally {
      setNewsLoading(false);
    }
  };

  // jobId나 companyId가 변경되면 데이터 로드
  useEffect(() => {
    if (jobId && companyId) {
      console.log(`[useJobDetail] Starting to load data for job: ${jobId}, company: ${companyId}`);
      
      // 3개 API를 병렬로 호출
      Promise.all([
        loadJobDetail(),
        loadCompanyInfo(),
        loadCompanyNews()
      ]).then(() => {
        console.log(`[useJobDetail] All data loaded successfully`);
      });
    }
  }, [jobId, companyId]);

  // 전체 로딩 상태 계산
  const isLoading = jobLoading || companyLoading || newsLoading;

  return {
    // 데이터
    jobDetail,
    companyInfo,
    companyNews,
    
    // 개별 로딩 상태
    jobLoading,
    companyLoading,
    newsLoading,
    
    // 개별 에러 상태
    jobError,
    companyError,
    newsError,
    
    // 전체 로딩 상태
    isLoading
  };
};