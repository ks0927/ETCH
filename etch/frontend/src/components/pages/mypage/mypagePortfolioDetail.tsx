import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getPortfolioDetail } from "../../../api/portfolioApi";

// API에서 반환하는 타입 (portfolioApi.ts의 PortfolioDetailResponseDTO와 일치)
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

interface PortfolioDetailResponseDTO {
  portfolioId: number;
  name: string;
  phoneNumber: string;
  email: string;
  blogUrl: string;
  githubUrl: string;
  introduce: string;
  techList: string[];
  language: string;
  education: string;
  memberId: number;
  projectList: ProjectInfo[];
  createdAt: string;
  updatedAt: string;
}

const parseCustomString = (str: string | null | undefined): string[] => {
  if (!str || str.trim() === "") return [];
  return str
    .split("^") // ^ 기준으로 분리
    .flatMap((part) => part.split("|")) // | 기준으로 다시 분리
    .map((item) => item.trim()) // 공백 제거
    .filter((item) => item !== ""); // 빈 문자열 제거
};

function MypagePortfolioDetail() {
  // 라우터가 portfolios/:userId이므로 userId로 받아옴
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState<PortfolioDetailResponseDTO | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioDetail = async () => {
      console.log("=== 포트폴리오 상세 조회 시작 ===");
      console.log("URL에서 받은 userId:", userId);

      if (!userId) {
        setError("포트폴리오 ID가 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log("API 호출할 userId:", Number(userId));
        const data = await getPortfolioDetail(Number(userId));
        console.log("API 응답 데이터:", data);
        setPortfolio(data);
      } catch (err) {
        console.error("포트폴리오 상세 조회 실패:", err);

        // 타입 안전한 에러 처리
        if (err && typeof err === "object" && "response" in err) {
          const response = (
            err as { response?: { status?: number; data?: unknown } }
          ).response;

          console.error("에러 상태 코드:", response?.status);
          console.error("에러 응답 데이터:", response?.data);

          if (response?.status === 404) {
            setError(
              "해당 포트폴리오를 찾을 수 없습니다. 포트폴리오가 삭제되었거나 존재하지 않을 수 있습니다."
            );
          } else if (response?.status === 403) {
            setError("이 포트폴리오에 접근할 권한이 없습니다.");
          } else if (response?.status === 500) {
            setError(
              "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
            );
          } else if (response?.status) {
            setError(
              `포트폴리오를 불러오는데 실패했습니다. (에러 코드: ${response.status})`
            );
          } else {
            setError("포트폴리오를 불러오는데 실패했습니다.");
          }
        } else {
          setError(
            "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioDetail();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">포트폴리오 로딩 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="mb-4 text-4xl text-red-500">⚠️</div>
        <p className="font-medium text-red-600">{error}</p>
        <button
          onClick={() => navigate("/mypage")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          마이페이지로 돌아가기
        </button>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">포트폴리오를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate("/mypage")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          마이페이지로 돌아가기
        </button>
      </div>
    );
  }

  // JSON 문자열을 파싱하여 안전하게 렌더링
  const educationList = parseCustomString(portfolio.education);
  const languageList = parseCustomString(portfolio.language);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">포트폴리오 상세</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate(`/mypage/portfolios/edit/${userId}`)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            수정
          </button>
          <button
            onClick={() => navigate("/mypage")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            목록으로
          </button>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <p className="text-gray-900">{portfolio.name || "-"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <p className="text-gray-900">{portfolio.email || "-"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              전화번호
            </label>
            <p className="text-gray-900">{portfolio.phoneNumber || "-"}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              자기소개
            </label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
              {portfolio.introduce || "자기소개가 없습니다."}
            </p>
          </div>
        </div>
      </div>

      {/* 링크 정보 */}
      {(portfolio.githubUrl || portfolio.blogUrl) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">링크</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolio.githubUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub
                </label>
                <a
                  href={portfolio.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {portfolio.githubUrl}
                </a>
              </div>
            )}
            {portfolio.blogUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  블로그
                </label>
                <a
                  href={portfolio.blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {portfolio.blogUrl}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 기술 스택 */}
      {portfolio.techList && portfolio.techList.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">기술 스택</h2>
          <div className="flex flex-wrap gap-2">
            {portfolio.techList.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 학력 정보 */}
      {educationList.length > 0 && educationList[0] !== "" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">학력</h2>
          <div className="bg-gray-50 p-3 rounded-md space-y-2">
            {educationList.map((edu, index) => (
              <p key={index} className="text-gray-900">
                {edu}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 어학 정보 */}
      {languageList.length > 0 && languageList[0] !== "" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">어학</h2>
          <div className="bg-gray-50 p-3 rounded-md space-y-2">
            {languageList.map((lang, index) => (
              <p key={index} className="text-gray-900">
                {lang}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 프로젝트 정보 */}
      {portfolio.projectList && portfolio.projectList.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">프로젝트</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.projectList.map((project) => (
              <div
                key={project.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {project.thumbnailUrl && (
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-32 object-cover rounded-md mb-3"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {project.title}
                </h3>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>{project.projectCategory}</span>
                  <span>조회 {project.viewCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{project.nickname}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500">♥ {project.likeCount}</span>
                    {project.isPublic && (
                      <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">
                        공개
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">프로젝트</h2>
          <div className="text-center py-8 text-gray-500">
            <div className="mb-2">📁</div>
            <p>등록된 프로젝트가 없습니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MypagePortfolioDetail;
