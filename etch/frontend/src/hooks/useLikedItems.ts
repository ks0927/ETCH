import { useState, useEffect } from 'react';
import { likeApi } from '../api/likeApi';

// 관심 공고 훅
export const useLikedJobs = () => {
  const [likedJobIds, setLikedJobIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLikedJobs = async () => {
      try {
        setIsLoading(true);
        const likedJobs = await likeApi.jobs.getLikes();
        setLikedJobIds(new Set(likedJobs.map(job => job.id)));
      } catch (error: any) {
        console.error('Failed to fetch liked jobs:', error);
        // 400 에러는 데이터가 없음을 의미
        if (error.response?.status === 400) {
          setLikedJobIds(new Set());
        } else {
          setLikedJobIds(new Set());
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedJobs();
  }, []);

  const addLikedJob = (jobId: number) => {
    setLikedJobIds(prev => new Set([...prev, jobId]));
  };

  const removeLikedJob = (jobId: number) => {
    setLikedJobIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(jobId);
      return newSet;
    });
  };

  const isJobLiked = (jobId: number) => likedJobIds.has(jobId);

  return {
    likedJobIds,
    isLoading,
    addLikedJob,
    removeLikedJob,
    isJobLiked,
  };
};

// 관심 뉴스 훅
export const useLikedNews = () => {
  const [likedNewsIds, setLikedNewsIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLikedNews = async () => {
      try {
        setIsLoading(true);
        const likedNews = await likeApi.news.getLikes();
        setLikedNewsIds(new Set(likedNews.map(news => news.id)));
      } catch (error: any) {
        console.error('Failed to fetch liked news:', error);
        // 400 에러는 데이터가 없음을 의미
        if (error.response?.status === 400) {
          setLikedNewsIds(new Set());
        } else {
          setLikedNewsIds(new Set());
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedNews();
  }, []);

  const addLikedNews = (newsId: number) => {
    setLikedNewsIds(prev => new Set([...prev, newsId]));
  };

  const removeLikedNews = (newsId: number) => {
    setLikedNewsIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(newsId);
      return newSet;
    });
  };

  const isNewsLiked = (newsId: number) => likedNewsIds.has(newsId);

  return {
    likedNewsIds,
    isLoading,
    addLikedNews,
    removeLikedNews,
    isNewsLiked,
  };
};

// 관심 기업 훅
export const useLikedCompanies = () => {
  const [likedCompanyIds, setLikedCompanyIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLikedCompanies = async () => {
      try {
        setIsLoading(true);
        const likedCompanies = await likeApi.companies.getLikes();
        setLikedCompanyIds(new Set(likedCompanies.map(company => company.id)));
      } catch (error: any) {
        console.error('Failed to fetch liked companies:', error);
        // 400 에러는 데이터가 없음을 의미
        if (error.response?.status === 400) {
          setLikedCompanyIds(new Set());
        } else {
          setLikedCompanyIds(new Set());
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedCompanies();
  }, []);

  const addLikedCompany = (companyId: number) => {
    setLikedCompanyIds(prev => new Set([...prev, companyId]));
  };

  const removeLikedCompany = (companyId: number) => {
    setLikedCompanyIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(companyId);
      return newSet;
    });
  };

  const isCompanyLiked = (companyId: number) => likedCompanyIds.has(companyId);

  return {
    likedCompanyIds,
    isLoading,
    addLikedCompany,
    removeLikedCompany,
    isCompanyLiked,
  };
};