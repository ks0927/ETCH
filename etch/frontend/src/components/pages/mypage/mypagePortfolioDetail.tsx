import { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  getPortfolioDetail,
  type BackendArrayData,
  type PortfolioDetailResponseDTO,
} from "../../../api/portfolioApi";

// API에서 반환하는 타입
export interface ProjectInfo {
  id: number;
  title: string;
  thumbnailUrl: string;
  projectCategory: string;
  viewCount: number;
  likeCount: number;
  nickname: string;
  isPublic: boolean;
  popularityScore: number;
}

// 타입 가드 함수들
const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

const isStringArray = (value: unknown): value is string[] => {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
};

const isStringArrayArray = (value: unknown): value is string[][] => {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        Array.isArray(item) &&
        item.every((subItem) => typeof subItem === "string")
    )
  );
};

// 백엔드 데이터를 2차원 배열로 파싱하는 함수
const parseBackendArrayData = (data: BackendArrayData): string[][] => {
  // null, undefined 체크
  if (!data) return [];

  try {
    // 이미 2차원 배열인 경우
    if (isStringArrayArray(data)) {
      return data;
    }

    // 1차원 문자열 배열인 경우 (각 항목을 ^ 기준으로 분리)
    if (isStringArray(data)) {
      return data
        .filter((item) => item.trim() !== "")
        .map((item) => item.split("^").map((subItem) => subItem.trim()));
    }

    // 문자열인 경우
    if (isString(data)) {
      if (data.trim() === "") return [];

      // | 기준으로 먼저 분리 (각 항목)
      return data
        .split("|")
        .map((item) => item.trim())
        .filter((item) => item !== "")
        .map((item) => {
          // ^ 기준으로 세부 항목 분리
          return item.split("^").map((subItem) => subItem.trim());
        });
    }

    return [];
  } catch (error) {
    console.error("parseBackendArrayData 에러:", error, "데이터:", data);
    return [];
  }
};

// 교육/언어 데이터를 표시용 문자열로 변환
const formatArrayDataForDisplay = (arrayData: string[][]): string[] => {
  return arrayData.map((item) => item.join(", "));
};

function MypagePortfolioDetail() {
  const { userId } = useParams<{ userId: string }>();

  const [portfolio, setPortfolio] = useState<PortfolioDetailResponseDTO | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioDetail = async () => {
      if (!userId) {
        setError("포트폴리오 ID가 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getPortfolioDetail(Number(userId));

        // 디버깅 로그 추가
        console.log("=== 포트폴리오 데이터 디버깅 ===");
        console.log("전체 데이터:", data);
        console.log(
          "education 타입:",
          typeof data.education,
          "값:",
          data.education
        );
        console.log(
          "language 타입:",
          typeof data.language,
          "값:",
          data.language
        );
        console.log("===========================");

        setPortfolio(data);
      } catch (err) {
        console.error("포트폴리오 상세 조회 실패:", err);
        setError("포트폴리오를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioDetail();
  }, [userId]);

  if (isLoading) return <div>포트폴리오 로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!portfolio) return <div>포트폴리오를 찾을 수 없습니다.</div>;

  // 타입 안전한 파싱
  const educationArray: string[][] = parseBackendArrayData(portfolio.education);
  const languageArray: string[][] = parseBackendArrayData(portfolio.language);

  // 표시용 문자열 배열 (기존 방식과 호환)
  const educationList: string[] = formatArrayDataForDisplay(educationArray);
  const languageList: string[] = formatArrayDataForDisplay(languageArray);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 디버깅 정보 (개발 환경에서만) */}

      {/* 기본 정보 */}
      <div className="bg-white border p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
        <p>이름: {portfolio.name || "-"}</p>
        <p>이메일: {portfolio.email || "-"}</p>
        <p>전화번호: {portfolio.phoneNumber || "-"}</p>
        <p>자기소개: {portfolio.introduce || "-"}</p>
      </div>

      {/* 학력 */}
      {educationList.length > 0 && (
        <div className="bg-white border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">학력</h2>
          <ul className="space-y-2">
            {educationList.map((edu, idx) => (
              <li key={idx}>{edu}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 어학 */}
      {languageList.length > 0 && (
        <div className="bg-white border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">어학</h2>
          <ul className="space-y-2">
            {languageList.map((lang, idx) => (
              <li key={idx}>{lang}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 프로젝트 */}
      {portfolio.projectList.length > 0 && (
        <div className="bg-white border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">프로젝트</h2>
          {portfolio.projectList.map((project) => (
            <div key={project.id} className="mb-4 border p-3 rounded">
              <h3>{project.title}</h3>
              <p>카테고리: {project.projectCategory}</p>
              <p>조회수: {project.viewCount}</p>
              <p>좋아요: {project.likeCount}</p>
              <p>작성자: {project.nickname}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MypagePortfolioDetail;
