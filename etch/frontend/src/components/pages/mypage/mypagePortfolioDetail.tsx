import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getPortfolioDetail } from "../../../api/portfolioApi";

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

// ^ 기준으로 분리하고 순서 유지, 필요 시 | 기준은 UI에서 분리
const parseCustomString = (str: string | null | undefined): string[] => {
  if (!str || str.trim() === "") return [];
  return str
    .split("^") // ^ 기준으로 분리
    .map((item) => item.trim()) // 공백 제거
    .filter((item) => item !== ""); // 빈 문자열 제거
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

  // ^ 순서를 유지한 배열 생성
  const educationList = parseCustomString(portfolio.education);
  const languageList = parseCustomString(portfolio.language);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
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
              <li key={idx}>{edu.split("|").join(", ")}</li> // UI에서 |를 쉼표로 변환
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
              <li key={idx}>{lang.split("|").join(", ")}</li> // UI에서 |를 쉼표로 변환
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
