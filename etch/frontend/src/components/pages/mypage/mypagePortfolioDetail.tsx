import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  getPortfolioDetail,
  type BackendArrayData,
  type PortfolioDetailResponseDTO,
  type EduAndActDTO,
  type CertAndLangDTO,
} from "../../../api/portfolioApi";
import { getMyProjects, type MyProjectResponse } from "../../../api/projectApi";
import type { ProjectData } from "../../../types/project/projectDatas";
import ProjectListCard from "../../organisms/project/list/projectListCard";

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

// 타입 가드 함수들 (기존과 동일)
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

// 백엔드에서 실제로 반환하는 데이터 타입들은 이제 API에서 import
type BackendEducationData = EduAndActDTO;
type BackendLanguageData = CertAndLangDTO;

// 현재 로그인한 사용자 ID를 가져오는 함수
const getCurrentUserId = (): number | null => {
  try {
    // 1. localStorage에서 user 정보 확인
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user && user.id) {
        return Number(user.id);
      }
    }

    // 2. localStorage에서 userId 직접 확인
    const userId = localStorage.getItem("userId");
    if (userId) {
      return Number(userId);
    }

    // 3. localStorage에서 memberId 확인
    const memberId = localStorage.getItem("memberId");
    if (memberId) {
      return Number(memberId);
    }

    // 4. 토큰에서 사용자 정보 파싱 (JWT라면)
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        // JWT 토큰의 payload 부분을 디코드 (간단한 방법)
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.userId) {
          return Number(payload.userId);
        }
        if (payload.memberId) {
          return Number(payload.memberId);
        }
        if (payload.id) {
          return Number(payload.id);
        }
      } catch (tokenError) {
        console.warn("토큰 파싱 실패:", tokenError);
      }
    }

    return null;
  } catch (error) {
    console.error("getCurrentUserId 오류:", error);
    return null;
  }
};

// 백엔드 데이터를 2차원 배열로 파싱하는 함수 (기존과 동일)
const parseBackendArrayData = (data: BackendArrayData): string[][] => {
  if (!data) return [];

  try {
    if (isStringArrayArray(data)) {
      return data;
    }

    if (isStringArray(data)) {
      return data
        .filter((item) => item.trim() !== "")
        .map((item) => item.split("^").map((subItem) => subItem.trim()));
    }

    if (isString(data)) {
      if (data.trim() === "") return [];

      return data
        .split("|")
        .map((item) => item.trim())
        .filter((item) => item !== "")
        .map((item) => {
          return item.split("^").map((subItem) => subItem.trim());
        });
    }

    return [];
  } catch (error) {
    console.error("parseBackendArrayData 에러:", error, "데이터:", data);
    return [];
  }
};

// 교육 데이터를 표시용 문자열로 변환 (기존과 동일)
const formatEducationData = (
  educationArray: BackendEducationData[]
): string[] => {
  return educationArray.map((edu) => {
    const companyName = edu.name || "";
    const active = edu.description || "";
    const startDate = edu.startDate;
    const endDate = edu.endDate;

    const formattedStartDate = startDate
      ? new Date(startDate).toLocaleDateString("ko-KR")
      : "";
    const formattedEndDate = endDate
      ? new Date(endDate).toLocaleDateString("ko-KR")
      : "";

    let result = "";

    if (companyName && active) {
      result = `${companyName} - ${active}`;
    } else if (companyName) {
      result = companyName;
    } else if (active) {
      result = active;
    }

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

// 어학 데이터를 표시용 문자열로 변환 (기존과 동일)
const formatLanguageData = (languageArray: BackendLanguageData[]): string[] => {
  return languageArray.map((lang) => {
    const licenseName = lang.name || "";
    const issuer = lang.certificateIssuer || "";
    const getAt = lang.date;

    const formattedDate = getAt
      ? new Date(getAt).toLocaleDateString("ko-KR")
      : "";

    let result = "";

    if (licenseName && issuer) {
      result = `${licenseName} (${issuer})`;
    } else if (licenseName) {
      result = licenseName;
    } else if (issuer) {
      result = issuer;
    }

    if (formattedDate) {
      result += ` - ${formattedDate}`;
    }

    return result || "정보 없음";
  });
};

const formatArrayDataForDisplay = (arrayData: string[][]): string[] => {
  return arrayData.map((item) => item.join(", "));
};

// ProjectInfo를 ProjectData로 변환하는 헬퍼 함수 (새로 추가)
const convertProjectInfoToProjectData = (project: ProjectInfo): ProjectData => {
  return {
    id: project.id,
    title: project.title,
    thumbnailUrl: project.thumbnailUrl || null,
    viewCount: project.viewCount,
    likeCount: project.likeCount,
    nickname: project.nickname,
    likedByMe: false, // 기본값, 필요시 추가 API 호출로 확인
    // ProjectData에 필요한 다른 필드들이 있다면 여기에 추가
    // 예: content, projectCategory, techList 등
    content: "", // 기본값
    projectCategory: project.projectCategory || "",
    isPublic: project.isPublic,
    popularityScore: project.popularityScore,
  } as ProjectData;
};

// MyProjectResponse를 ProjectData로 변환하는 헬퍼 함수 (수정)
const convertMyProjectToProjectData = (
  project: MyProjectResponse
): ProjectData => {
  return {
    id: project.id,
    title: project.title,
    thumbnailUrl: project.thumbnailUrl,
    viewCount: project.viewCount,
    likeCount: project.likeCount,
    nickname: project.nickname,
    isPublic: project.isPublic,
    popularityScore: project.popularityScore,
    likedByMe: false, // 기본값
    content: "", // 기본값
    projectCategory: "", // MyProjectResponse에는 카테고리가 없음
  } as ProjectData;
};

function MypagePortfolioDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState<PortfolioDetailResponseDTO | null>(
    null
  );
  const [myProjects, setMyProjects] = useState<MyProjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchPortfolioDetail = async () => {
      if (!userId) {
        setError("사용자 ID가 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log("=== 포트폴리오 조회 시작 ===");
        console.log("요청된 userId:", userId);

        // 1. 현재 로그인한 사용자 ID 확인
        const currentUserId = getCurrentUserId();
        console.log("현재 로그인한 사용자 ID:", currentUserId);

        // 2. 포트폴리오 조회
        const portfolioData = await getPortfolioDetail(Number(userId));
        console.log("포트폴리오 데이터:", portfolioData);
        console.log("포트폴리오 소유자 ID:", portfolioData.memberId);
        console.log("포트폴리오에 포함된 프로젝트:", portfolioData.projectList);

        // 🔥 포트폴리오 ID 디버깅 추가
        console.log("=== 포트폴리오 ID 디버깅 ===");
        console.log("portfolioData.portfolioId:", portfolioData.portfolioId);
        console.log("portfolioData.id:", (portfolioData as any).id);
        console.log("전체 포트폴리오 객체 키들:", Object.keys(portfolioData));

        setPortfolio(portfolioData);

        // 3. 소유자 여부 확인
        const ownerCheck =
          currentUserId &&
          portfolioData.memberId &&
          Number(currentUserId) === Number(portfolioData.memberId);
        console.log("소유자 여부:", ownerCheck);
        setIsOwner(ownerCheck || false);

        // 4. 소유자인 경우 모든 프로젝트 조회
        if (ownerCheck) {
          console.log("=== 내 프로젝트 조회 시작 ===");
          try {
            const allProjects = await getMyProjects();
            console.log("내 모든 프로젝트 조회 성공:", allProjects);
            console.log("프로젝트 개수:", allProjects.length);
            setMyProjects(allProjects);
          } catch (projectError) {
            console.error("내 프로젝트 조회 실패:", projectError);
            // 프로젝트 조회 실패해도 포트폴리오는 표시
            setMyProjects([]);
          }
        } else {
          console.log("소유자가 아니므로 내 프로젝트를 조회하지 않습니다.");
          setMyProjects([]);
        }
      } catch (err) {
        console.error("포트폴리오 상세 조회 실패:", err);
        setError("포트폴리오를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioDetail();
  }, [userId]);

  // 프로젝트 업데이트 핸들러 (새로 추가)
  const handleProjectUpdate = (updatedProject: ProjectData) => {
    console.log("프로젝트 업데이트:", updatedProject);
    // 필요시 프로젝트 리스트 업데이트 로직 추가
  };

  // 뒤로 가기 핸들러
  const handleGoBack = () => {
    navigate(-1); // 브라우저 히스토리에서 이전 페이지로
  };

  // 🔥 수정 페이지로 이동 핸들러 - 수정됨
  const handleEdit = () => {
    if (!portfolio) {
      console.error("포트폴리오 데이터가 없습니다.");
      return;
    }

    // 🔥 포트폴리오 ID를 찾는 로직 수정
    let portfolioId: number | null = null;

    // 1. portfolioId 필드 확인
    if (portfolio.portfolioId) {
      portfolioId = portfolio.portfolioId;
      console.log("portfolioId 필드 사용:", portfolioId);
    }
    // 2. id 필드 확인 (백엔드에서 다른 필드명을 사용할 가능성)
    else if ((portfolio as any).id) {
      portfolioId = (portfolio as any).id;
      console.log("id 필드 사용:", portfolioId);
    }
    // 3. URL 파라미터의 userId 사용 (최후의 수단)
    else if (userId) {
      portfolioId = Number(userId);
      console.log("URL userId 사용:", portfolioId);
    }

    if (portfolioId) {
      console.log("포트폴리오 수정 페이지로 이동:", portfolioId);
      navigate(`/mypage/portfolios/edit/${portfolioId}`);
    } else {
      console.error("포트폴리오 ID를 찾을 수 없습니다.");
      console.log("포트폴리오 객체:", portfolio);
      alert("포트폴리오 ID를 찾을 수 없습니다. 다시 시도해주세요.");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 bg-white">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-3"></div>
        포트폴리오 로딩 중...
      </div>
    );
  if (error)
    return <div className="text-red-600 text-center bg-white p-6">{error}</div>;
  if (!portfolio)
    return (
      <div className="text-center bg-white p-6">
        포트폴리오를 찾을 수 없습니다.
      </div>
    );

  // 타입 안전한 파싱 (기존과 동일)
  const educationList: string[] = Array.isArray(portfolio.education)
    ? formatEducationData(portfolio.education as BackendEducationData[])
    : [];

  const languageList: string[] = Array.isArray(portfolio.language)
    ? formatLanguageData(portfolio.language as BackendLanguageData[])
    : [];

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

  // 프로젝트 목록을 ProjectData 타입으로 변환
  const displayProjects: ProjectData[] = (() => {
    if (isOwner && myProjects.length > 0) {
      console.log(
        "소유자이며 내 프로젝트 데이터 사용:",
        myProjects.length,
        "개"
      );
      return myProjects.map(convertMyProjectToProjectData);
    } else if (portfolio.projectList && portfolio.projectList.length > 0) {
      console.log(
        "포트폴리오의 프로젝트 데이터 사용:",
        portfolio.projectList.length,
        "개"
      );
      return portfolio.projectList.map(convertProjectInfoToProjectData);
    } else {
      console.log("표시할 프로젝트가 없음");
      return [];
    }
  })();

  console.log("=== 최종 표시할 프로젝트 ===");
  console.log("개수:", displayProjects.length);
  console.log("프로젝트 목록:", displayProjects);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* 기본 정보 */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-100">
          기본 정보
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="font-semibold text-gray-600 w-24 flex-shrink-0">
                이름
              </span>
              <span className="text-gray-900 font-medium">
                {portfolio.name || "-"}
              </span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold text-gray-600 w-24 flex-shrink-0">
                이메일
              </span>
              <span className="text-gray-900">{portfolio.email || "-"}</span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold text-gray-600 w-24 flex-shrink-0">
                전화번호
              </span>
              <span className="text-gray-900">
                {portfolio.phoneNumber || "-"}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="font-semibold text-gray-600 w-24 flex-shrink-0">
                GitHub
              </span>
              {portfolio.githubUrl ? (
                <a
                  href={portfolio.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200 break-all"
                >
                  {portfolio.githubUrl}
                </a>
              ) : (
                <span className="text-gray-900">-</span>
              )}
            </div>
            <div className="flex items-start">
              <span className="font-semibold text-gray-600 w-24 flex-shrink-0">
                블로그
              </span>
              {portfolio.blogUrl ? (
                <a
                  href={portfolio.blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200 break-all"
                >
                  {portfolio.blogUrl}
                </a>
              ) : (
                <span className="text-gray-900">-</span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="mb-3">
            <span className="font-semibold text-gray-600">자기소개</span>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <p className="text-gray-800 whitespace-pre-line leading-relaxed text-base">
              {portfolio.introduce || "자기소개가 등록되지 않았습니다."}
            </p>
          </div>
        </div>
      </div>

      {/* 기술 스택 */}
      {portfolio.techList && portfolio.techList.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-100">
            기술 스택
          </h2>
          <div className="flex flex-wrap gap-3">
            {portfolio.techList.map((tech, idx) => (
              <span
                key={idx}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200 rounded-full text-sm font-semibold hover:from-blue-100 hover:to-blue-200 transition-all duration-200 transform hover:scale-105"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 프로젝트 - ProjectListCard 사용 */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">프로젝트</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 font-medium">
              총 {displayProjects.length}개
            </span>
            {isOwner && (
              <span className="text-xs bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full font-semibold shadow-sm">
                내 모든 프로젝트 표시
              </span>
            )}
          </div>
        </div>

        <ProjectListCard
          projects={displayProjects}
          onProjectUpdate={handleProjectUpdate}
        />
      </div>

      {/* 데이터가 없는 경우 안내 메시지 */}
      {educationList.length === 0 &&
        languageList.length === 0 &&
        certificateList.length === 0 &&
        activityList.length === 0 &&
        displayProjects.length === 0 && (
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-12 text-center text-gray-500 mb-8 shadow-sm">
            <div className="text-6xl mb-4 opacity-60">📝</div>
            <p className="text-xl font-semibold mb-3 text-gray-600">
              추가 정보가 등록되지 않았습니다
            </p>
            <p className="text-base text-gray-500">
              학력, 어학, 자격증, 활동, 프로젝트 정보를 등록해보세요.
            </p>
          </div>
        )}

      {/* 교육/활동 */}
      {educationList.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-100">
            교육/활동
          </h2>
          <div className="space-y-4">
            {educationList.map((edu, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-r-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200"
              >
                <span className="text-blue-600 text-xl">📚</span>
                <span className="text-gray-800 font-medium text-base leading-relaxed">
                  {edu}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 자격증/어학 */}
      {languageList.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-100">
            자격증/어학
          </h2>
          <div className="space-y-4">
            {languageList.map((lang, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-r-xl hover:from-green-100 hover:to-green-200 transition-all duration-200"
              >
                <span className="text-gray-800 font-medium text-base leading-relaxed">
                  {lang}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 자격증 */}
      {certificateList.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-100">
            자격증
          </h2>
          <div className="space-y-4">
            {certificateList.map((cert, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500 rounded-r-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-200"
              >
                <span className="text-gray-800 font-medium text-base leading-relaxed">
                  {cert}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 교육/활동 */}
      {activityList.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-100">
            교육/활동
          </h2>
          <div className="space-y-4">
            {activityList.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 rounded-r-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-200"
              >
                <span className="text-orange-600 text-xl">🎯</span>
                <span className="text-gray-800 font-medium text-base leading-relaxed">
                  {activity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 버튼 섹션 */}
      <div className="flex justify-between items-center pt-8 pb-4">
        <button
          onClick={handleGoBack}
          className="px-8 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          뒤로 가기
        </button>

        {isOwner && (
          <button
            onClick={handleEdit}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            수정하기
          </button>
        )}
      </div>
    </div>
  );
}

export default MypagePortfolioDetail;
