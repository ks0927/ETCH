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

// 백엔드에서 반환하는 실제 데이터 타입들
interface BackendEducationData {
  companyName?: string;
  startAt?: string;
  endAt?: string;
  active?: string;
  startDate?: string; // 실제 응답에서 사용되는 필드명
  endDate?: string; // 실제 응답에서 사용되는 필드명
}

interface BackendLanguageData {
  licenseName?: string;
  getAt?: string;
  issuer?: string;
  date?: string; // 실제 응답에서 사용되는 필드명
}

// 백엔드 데이터를 2차원 배열로 파싱하는 함수 (기존 문자열 형태용)
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

// 교육 데이터를 표시용 문자열로 변환
const formatEducationData = (
  educationArray: BackendEducationData[]
): string[] => {
  return educationArray.map((edu) => {
    const companyName = edu.companyName || "";
    const active = edu.active || "";
    const startDate = edu.startAt || edu.startDate;
    const endDate = edu.endAt || edu.endDate;

    const formattedStartDate = startDate
      ? new Date(startDate).toLocaleDateString("ko-KR")
      : "";
    const formattedEndDate = endDate
      ? new Date(endDate).toLocaleDateString("ko-KR")
      : "";

    let result = "";

    // 회사명과 활동 내용
    if (companyName && active) {
      result = `${companyName} - ${active}`;
    } else if (companyName) {
      result = companyName;
    } else if (active) {
      result = active;
    }

    // 날짜 정보 추가
    if (formattedStartDate && formattedEndDate) {
      result += ` (${formattedStartDate} ~ ${formattedEndDate})`;
    } else if (formattedStartDate) {
      result += ` (${formattedStartDate} ~)`;
    } else if (formattedEndDate) {
      result += ` (~ ${formattedEndDate})`;
    }

    return result || "정보 없음";
  });
};

// 어학 데이터를 표시용 문자열로 변환
const formatLanguageData = (languageArray: BackendLanguageData[]): string[] => {
  return languageArray.map((lang) => {
    const licenseName = lang.licenseName || "";
    const issuer = lang.issuer || "";
    const getAt = lang.getAt || lang.date;

    const formattedDate = getAt
      ? new Date(getAt).toLocaleDateString("ko-KR")
      : "";

    let result = "";

    // 자격증명과 발급기관
    if (licenseName && issuer) {
      result = `${licenseName} (${issuer})`;
    } else if (licenseName) {
      result = licenseName;
    } else if (issuer) {
      result = issuer;
    }

    // 취득 날짜 추가
    if (formattedDate) {
      result += ` - ${formattedDate}`;
    }

    return result || "정보 없음";
  });
};

// 교육/언어/자격증/활동 데이터를 표시용 문자열로 변환 (기존 문자열 형태용)
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
        console.log(
          "certificate 타입:",
          typeof data.certificate,
          "값:",
          data.certificate
        );
        console.log(
          "activity 타입:",
          typeof data.activity,
          "값:",
          data.activity
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
  const educationList: string[] = Array.isArray(portfolio.education)
    ? formatEducationData(portfolio.education as BackendEducationData[])
    : [];

  const languageList: string[] = Array.isArray(portfolio.language)
    ? formatLanguageData(portfolio.language as BackendLanguageData[])
    : [];

  // certificate와 activity는 아직 구현되지 않은 것 같으므로 빈 배열로 처리
  const certificateList: string[] = portfolio.certificate
    ? Array.isArray(portfolio.certificate)
      ? formatArrayDataForDisplay(parseBackendArrayData(portfolio.certificate))
      : []
    : [];

  const activityList: string[] = portfolio.activity
    ? Array.isArray(portfolio.activity)
      ? formatArrayDataForDisplay(parseBackendArrayData(portfolio.activity))
      : []
    : [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 기본 정보 */}
      <div className="bg-white border p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2">
              <span className="font-medium">이름:</span> {portfolio.name || "-"}
            </p>
            <p className="mb-2">
              <span className="font-medium">이메일:</span>{" "}
              {portfolio.email || "-"}
            </p>
            <p className="mb-2">
              <span className="font-medium">전화번호:</span>{" "}
              {portfolio.phoneNumber || "-"}
            </p>
          </div>
          <div>
            <p className="mb-2">
              <span className="font-medium">GitHub:</span>
              {portfolio.githubUrl ? (
                <a
                  href={portfolio.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  {portfolio.githubUrl}
                </a>
              ) : (
                " -"
              )}
            </p>
            <p className="mb-2">
              <span className="font-medium">블로그:</span>
              {portfolio.blogUrl ? (
                <a
                  href={portfolio.blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  {portfolio.blogUrl}
                </a>
              ) : (
                " -"
              )}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="font-medium">자기소개:</p>
          <p className="mt-2 text-gray-700 whitespace-pre-line">
            {portfolio.introduce || "-"}
          </p>
        </div>
      </div>

      {/* 기술 스택 */}
      {portfolio.techList && portfolio.techList.length > 0 && (
        <div className="bg-white border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">기술 스택</h2>
          <div className="flex flex-wrap gap-2">
            {portfolio.techList.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 학력 */}
      {educationList.length > 0 && (
        <div className="bg-white border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">학력</h2>
          <ul className="space-y-3">
            {educationList.map((edu, idx) => (
              <li key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                {edu}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 어학 */}
      {languageList.length > 0 && (
        <div className="bg-white border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">어학</h2>
          <ul className="space-y-3">
            {languageList.map((lang, idx) => (
              <li key={idx} className="border-l-4 border-green-500 pl-4 py-2">
                {lang}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 자격증 */}
      {certificateList.length > 0 && (
        <div className="bg-white border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">자격증</h2>
          <ul className="space-y-3">
            {certificateList.map((cert, idx) => (
              <li key={idx} className="border-l-4 border-purple-500 pl-4 py-2">
                {cert}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 교육/활동 */}
      {activityList.length > 0 && (
        <div className="bg-white border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">교육/활동</h2>
          <ul className="space-y-3">
            {activityList.map((activity, idx) => (
              <li key={idx} className="border-l-4 border-orange-500 pl-4 py-2">
                {activity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 프로젝트 */}
      {portfolio.projectList.length > 0 && (
        <div className="bg-white border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">프로젝트</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolio.projectList.map((project) => (
              <div
                key={project.id}
                className="border p-4 rounded-lg hover:shadow-md transition-shadow"
              >
                {project.thumbnailUrl && (
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                )}
                <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">카테고리:</span>{" "}
                    {project.projectCategory}
                  </p>
                  <p>
                    <span className="font-medium">작성자:</span>{" "}
                    {project.nickname}
                  </p>
                  <div className="flex justify-between mt-2">
                    <span>조회수: {project.viewCount}</span>
                    <span>좋아요: {project.likeCount}</span>
                  </div>
                  {!project.isPublic && (
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                      비공개
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 데이터가 없는 경우 안내 메시지 */}
      {educationList.length === 0 &&
        languageList.length === 0 &&
        certificateList.length === 0 &&
        activityList.length === 0 &&
        portfolio.projectList.length === 0 && (
          <div className="bg-gray-50 border p-6 rounded-lg text-center text-gray-600">
            <p>추가 정보가 등록되지 않았습니다.</p>
            <p className="text-sm mt-2">
              학력, 어학, 자격증, 활동, 프로젝트 정보를 등록해보세요.
            </p>
          </div>
        )}
    </div>
  );
}

export default MypagePortfolioDetail;
