import { useState, useEffect, useCallback } from "react"; // Import useCallback
import { getCoverLetters } from "../api/coverLetterApi";
import type { CoverLetterListResponse } from "../types/coverLetter";
import { mockPortfolios } from "../types/mock/mockDocumentsData"; // Using mock for portfolios for now

type PortfolioListResponse = any[];

interface MyDocumentsHookResult {
  coverLetters: CoverLetterListResponse[];
  portfolios: PortfolioListResponse;
  isLoading: boolean;
  error: string | null;
  refetchCoverLetters: () => void; // Add refetch function
}

export const useMyDocuments = (): MyDocumentsHookResult => {
  const [coverLetters, setCoverLetters] = useState<CoverLetterListResponse[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioListResponse>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch cover letters
  const fetchCoverLetters = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedCoverLetters = await getCoverLetters();
      setCoverLetters(fetchedCoverLetters);
    } catch (err) {
      console.error("Failed to fetch cover letters:", err);
      setError("자기소개서를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies, so it's stable

  useEffect(() => {
    fetchCoverLetters();
    setPortfolios(mockPortfolios); // Set mock data for portfolios once
  }, [fetchCoverLetters]); // Depend on fetchCoverLetters

  return { coverLetters, portfolios, isLoading, error, refetchCoverLetters: fetchCoverLetters }; // Return refetch function
};