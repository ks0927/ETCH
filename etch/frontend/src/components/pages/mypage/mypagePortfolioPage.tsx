import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  createPortfolio,
  updatePortfolio,
  getPortfolioDetail,
} from "../../../api/portfolioApi";
import { getMyProjects, type MyProjectResponse } from "../../../api/projectApi";

interface PortfolioFormData {
  name: string;
  introduce: string;
  githubUrl: string;
  blogUrl: string;
  phoneNumber: string;
  email: string;
  techList: string[];
  education: string;
  language: string;
  selectedProjectIds: number[];
}

interface ProjectCardProps {
  project: MyProjectResponse;
  selected: boolean;
  onSelect: (projectId: number, selected: boolean) => void;
}

const ProjectCard = ({ project, selected, onSelect }: ProjectCardProps) => {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        selected
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
      onClick={() => onSelect(project.id, !selected)}
    >
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(project.id, e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
          onClick={(e) => e.stopPropagation()}
        />

        <div className="flex-1 min-w-0">
          {project.thumbnailUrl && (
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="w-full h-24 object-cover rounded mb-2"
            />
          )}

          <h4 className="font-semibold text-lg mb-1 truncate">
            {project.title}
          </h4>

          <div className="text-sm text-gray-600 space-y-1">
            <p>작성자: {project.nickname}</p>
            <div className="flex justify-between items-center">
              <span>조회수: {project.viewCount}</span>
              <span>좋아요: {project.likeCount}</span>
            </div>

            <div className="flex items-center space-x-2">
              {!project.isPublic && (
                <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                  비공개
                </span>
              )}
              <span className="text-xs text-gray-500">
                인기도: {project.popularityScore}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function PortfolioForm() {
  const navigate = useNavigate();
  const { portfolioId } = useParams<{ portfolioId?: string }>();
  const isEdit = Boolean(portfolioId);

  // 폼 데이터 상태
  const [formData, setFormData] = useState<PortfolioFormData>({
    name: "",
    introduce: "",
    githubUrl: "",
    blogUrl: "",
    phoneNumber: "",
    email: "",
    techList: [],
    education: "",
    language: "",
    selectedProjectIds: [],
  });

  // 프로젝트 관련 상태
  const [myProjects, setMyProjects] = useState<MyProjectResponse[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // 로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState("");

  // 기술 스택 옵션 (예시)
  const techOptions = [
    "JavaScript",
    "TypeScript",
    "React",
    "Vue.js",
    "Angular",
    "Node.js",
    "Python",
    "Java",
    "Spring",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "AWS",
    "Git",
  ];

  // 내 프로젝트 목록 조회
  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        setProjectsLoading(true);
        const projects = await getMyProjects();
        setMyProjects(projects);
        console.log("내 프로젝트 조회 성공:", projects.length, "개");
      } catch (error) {
        console.error("내 프로젝트 조회 실패:", error);
        setError("프로젝트 목록을 불러오는데 실패했습니다.");
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchMyProjects();
  }, []);

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEdit && portfolioId) {
      const fetchPortfolioData = async () => {
        try {
          setIsLoading(true);
          const portfolioData = await getPortfolioDetail(Number(portfolioId));

          setFormData({
            name: portfolioData.name || "",
            introduce: portfolioData.introduce || "",
            githubUrl: portfolioData.githubUrl || "",
            blogUrl: portfolioData.blogUrl || "",
            phoneNumber: portfolioData.phoneNumber || "",
            email: portfolioData.email || "",
            techList: portfolioData.techList || [],
            education: "", // 필요에 따라 파싱 로직 추가
            language: "", // 필요에 따라 파싱 로직 추가
            selectedProjectIds:
              portfolioData.projectList?.map((p) => p.id) || [],
          });
        } catch (error) {
          console.error("포트폴리오 데이터 로드 실패:", error);
          setError("포트폴리오 데이터를 불러오는데 실패했습니다.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchPortfolioData();
    }
  }, [isEdit, portfolioId]);

  // 입력값 변경 핸들러 - 타입 안전하게 개선
  const handleInputChange = <K extends keyof PortfolioFormData>(
    field: K,
    value: PortfolioFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 기술 스택 추가
  const addTechStack = () => {
    if (selectedTech && !formData.techList.includes(selectedTech)) {
      handleInputChange("techList", [...formData.techList, selectedTech]);
      setSelectedTech("");
    }
  };

  // 기술 스택 제거
  const removeTechStack = (tech: string) => {
    handleInputChange(
      "techList",
      formData.techList.filter((t) => t !== tech)
    );
  };

  // 프로젝트 선택 핸들러
  const handleProjectSelect = (projectId: number, selected: boolean) => {
    if (selected) {
      handleInputChange("selectedProjectIds", [
        ...formData.selectedProjectIds,
        projectId,
      ]);
    } else {
      handleInputChange(
        "selectedProjectIds",
        formData.selectedProjectIds.filter((id) => id !== projectId)
      );
    }
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      // API 요청 데이터 구성
      const requestData = {
        name: formData.name,
        introduce: formData.introduce,
        githubUrl: formData.githubUrl,
        blogUrl: formData.blogUrl,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        techList: formData.techList,
        education: formData.education,
        language: formData.language,
        projectList: formData.selectedProjectIds.map((id) => ({ id })),
      };

      if (isEdit && portfolioId) {
        await updatePortfolio(Number(portfolioId), requestData);
        alert("포트폴리오가 수정되었습니다.");
      } else {
        await createPortfolio(requestData);
        alert("포트폴리오가 생성되었습니다.");
      }

      navigate("/mypage/portfolios");
    } catch (error) {
      console.error("포트폴리오 저장 실패:", error);
      setError(
        isEdit
          ? "포트폴리오 수정에 실패했습니다."
          : "포트폴리오 생성에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (projectsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">프로젝트 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? "포트폴리오 수정" : "포트폴리오 생성"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">기본 정보</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">이름 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                전화번호 *
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">이메일</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/username"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                블로그 URL
              </label>
              <input
                type="url"
                value={formData.blogUrl}
                onChange={(e) => handleInputChange("blogUrl", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://blog.example.com"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">자기소개 *</label>
            <textarea
              value={formData.introduce}
              onChange={(e) => handleInputChange("introduce", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="자신을 소개해주세요..."
              required
            />
          </div>
        </div>

        {/* 기술 스택 */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">기술 스택</h2>

          <div className="flex gap-2 mb-4">
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">기술 스택을 선택하세요</option>
              {techOptions.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addTechStack}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              추가
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.techList.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechStack(tech)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 프로젝트 선택 */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            프로젝트 선택
            <span className="text-sm text-gray-500 ml-2">
              ({formData.selectedProjectIds.length}개 선택됨)
            </span>
          </h2>

          {myProjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>등록된 프로젝트가 없습니다.</p>
              <p className="text-sm mt-2">먼저 프로젝트를 등록해주세요.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                포트폴리오에 포함할 프로젝트를 선택하세요. (총{" "}
                {myProjects.length}개 프로젝트)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {myProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    selected={formData.selectedProjectIds.includes(project.id)}
                    onSelect={handleProjectSelect}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* 교육/경력 정보 */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">추가 정보</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                교육 이력
              </label>
              <textarea
                value={formData.education}
                onChange={(e) => handleInputChange("education", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="교육 이력을 입력하세요..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                자격증/어학
              </label>
              <textarea
                value={formData.language}
                onChange={(e) => handleInputChange("language", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="자격증이나 어학 능력을 입력하세요..."
              />
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/mypage/portfolios")}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading
              ? isEdit
                ? "수정 중..."
                : "생성 중..."
              : isEdit
              ? "포트폴리오 수정"
              : "포트폴리오 생성"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PortfolioForm;
