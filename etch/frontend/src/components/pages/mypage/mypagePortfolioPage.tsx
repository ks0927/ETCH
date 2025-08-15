import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  PortfolioWriteStackData,
  type PortfolioStackEnum,
} from "../../../types/portfolio/portfolioStack";
import {
  PortfolioState,
  type portfolioDatas,
  type education,
  type language,
} from "../../../types/portfolio/portfolioDatas";
import PortfolioWriteInput from "../../organisms/portfolio/portfolioWriteInput";
import PortfolioSubmitButton from "../../organisms/portfolio/portfolioSubmitButton";
import PortfolioStackSelect from "../../organisms/portfolio/portfolioStackSelect";
// import type { ProjectCategoryEnum } from "../../../types/project/projectCategroyData";
import PortfolioWriteTextCard from "../../organisms/portfolio/portfolioTextCard";
import {
  convertPortfolioDataToRequest,
  createPortfolio,
  type PortfolioProjectId,
} from "../../../api/portfolioApi";
import { getMyProjects, type MyProjectResponse } from "../../../api/projectApi";

// 프로젝트 데이터 타입 정의
// interface ProjectData {
//   title: string;
//   content: string;
//   projectCategory: ProjectCategoryEnum | "";
//   githubUrl: string;
//   youtubeUrl: string;
//   isPublic: boolean;
//   projectTechs: number[];
//   files: File[];
//   thumbnailFile: File | null;
// }

// 에러 응답 타입 정의
interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

// 초기 프로젝트 상태
// const initialProjectData: ProjectData = {
//   title: "",
//   content: "",
//   projectCategory: "",
//   githubUrl: "",
//   youtubeUrl: "",
//   isPublic: true,
//   projectTechs: [],
//   files: [],
//   thumbnailFile: null,
// };

function MypagePortfolioPage() {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState<portfolioDatas>({
    ...PortfolioState,
    stack: [] as PortfolioStackEnum[],
  });

  // 프로젝트 관련 상태들 - 기존 프로젝트 선택 방식으로 변경
  const [myProjects, setMyProjects] = useState<MyProjectResponse[]>([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);
  const [projectsLoading, setProjectsLoading] = useState<boolean>(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  // 교육/활동과 자격증 폼 토글 상태들
  const [showEducationForm, setShowEducationForm] = useState<boolean>(false);
  const [showLanguageForm, setShowLanguageForm] = useState<boolean>(false);

  // 제출 상태 관리
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 내 프로젝트 목록 조회
  useEffect(() => {
    const fetchMyProjects = async (): Promise<void> => {
      try {
        setProjectsLoading(true);
        setProjectsError(null);
        const projects = await getMyProjects();
        setMyProjects(projects);
        console.log("내 프로젝트 조회 성공:", projects.length, "개");
      } catch (error) {
        console.error("내 프로젝트 조회 실패:", error);
        setProjectsError("프로젝트 목록을 불러오는데 실패했습니다.");
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchMyProjects();
  }, []);

  // 문자열을 배열로 파싱 (화면 표시용)
  const parseEducationData = (educationString: string): education[] => {
    if (!educationString) return [];

    const educationItems = educationString
      .split("|")
      .filter((item) => item.trim());
    return educationItems.map((item) => {
      const [companyName, active, startAt, endAt] = item.split("^");
      return {
        companyName: companyName || "",
        active: active || "",
        startAt: startAt || "",
        endAt: endAt || "",
      };
    });
  };

  const parseLanguageData = (languageString: string): language[] => {
    if (!languageString) return [];

    const languageItems = languageString
      .split("|")
      .filter((item) => item.trim());
    return languageItems.map((item) => {
      const [licenseName, getAt, issuer] = item.split("^");
      return {
        licenseName: licenseName || "",
        getAt: getAt || "",
        issuer: issuer || "",
      };
    });
  };

  // 배열을 문자열로 변환 (삭제 기능용만)
  const arrayToEducationString = (educations: education[]): string => {
    return educations
      .map(
        (edu) => `${edu.companyName}^${edu.active}^${edu.startAt}^${edu.endAt}`
      )
      .join("|");
  };

  const arrayToLanguageString = (languages: language[]): string => {
    return languages
      .map((lang) => `${lang.licenseName}^${lang.getAt}^${lang.issuer}`)
      .join("|");
  };

  // ============== 기본 정보 핸들러들 - 타입 안전하게 개선 ==============

  const handleStacksChange = (stack: PortfolioStackEnum): void => {
    setPortfolioData((prev) => {
      const currentStacks = prev.stack;
      const isSelected = currentStacks.includes(stack);

      let newStacks: PortfolioStackEnum[];
      if (isSelected) {
        newStacks = currentStacks.filter((s) => s !== stack);
      } else {
        newStacks = [...currentStacks, stack];
      }

      console.log("현재 스택들 : ", newStacks);

      return {
        ...prev,
        stack: newStacks,
      };
    });
  };

  const handleNameChange = (value: string): void => {
    setPortfolioData((prev) => ({
      ...prev,
      name: value,
    }));
  };

  const handlePhoneNumberChange = (value: string): void => {
    setPortfolioData((prev) => ({
      ...prev,
      phoneNumber: value,
    }));
  };

  const handleEmailChange = (value: string): void => {
    setPortfolioData((prev) => ({
      ...prev,
      email: value,
    }));
  };

  const handleGithubUrlChange = (value: string): void => {
    setPortfolioData((prev) => ({
      ...prev,
      githubUrl: value,
    }));
  };

  const handleBlogUrlChange = (value: string): void => {
    setPortfolioData((prev) => ({
      ...prev,
      blogUrl: value,
    }));
  };

  const handleIntroChange = (value: string): void => {
    setPortfolioData((prev) => ({
      ...prev,
      introduce: value,
    }));
  };

  // ============== 프로젝트 선택 관련 핸들러들 ==============

  // 프로젝트 선택/해제 핸들러
  const handleProjectSelect = (projectId: number, selected: boolean): void => {
    if (selected) {
      setSelectedProjectIds((prev) => [...prev, projectId]);
    } else {
      setSelectedProjectIds((prev) => prev.filter((id) => id !== projectId));
    }
  };

  // 전체 선택/해제
  const handleSelectAllProjects = (): void => {
    if (selectedProjectIds.length === myProjects.length) {
      // 전체 해제
      setSelectedProjectIds([]);
    } else {
      // 전체 선택
      setSelectedProjectIds(myProjects.map((project) => project.id));
    }
  };

  // ============== 교육/자격증 관련 핸들러들 - 타입 안전하게 개선 ==============

  const handleActivityAdd = (educationString: string): void => {
    // 기존 문자열에 새 항목 추가
    const newEducationString = portfolioData.education
      ? `${portfolioData.education}|${educationString}`
      : educationString;

    setPortfolioData((prev) => ({
      ...prev,
      education: newEducationString,
    }));

    // 폼 닫기
    setShowEducationForm(false);
    console.log("교육/활동 추가됨:", educationString);
  };

  const handleLicenseAdd = (languageString: string): void => {
    // 기존 문자열에 새 항목 추가
    const newLanguageString = portfolioData.language
      ? `${portfolioData.language}|${languageString}`
      : languageString;

    setPortfolioData((prev) => ({
      ...prev,
      language: newLanguageString,
    }));

    // 폼 닫기
    setShowLanguageForm(false);
    console.log("자격증 추가됨:", languageString);
  };

  const handleEducationRemove = (index: number): void => {
    // 파싱 → 삭제 → 다시 문자열 변환
    const parsedEducations = parseEducationData(portfolioData.education);
    const filteredEducations = parsedEducations.filter((_, i) => i !== index);
    const newEducationString = arrayToEducationString(filteredEducations);

    setPortfolioData((prev) => ({
      ...prev,
      education: newEducationString,
    }));
    console.log("교육/활동 삭제됨, 인덱스:", index);
  };

  const handleLanguageRemove = (index: number): void => {
    // 파싱 → 삭제 → 다시 문자열 변환
    const parsedLanguages = parseLanguageData(portfolioData.language);
    const filteredLanguages = parsedLanguages.filter((_, i) => i !== index);
    const newLanguageString = arrayToLanguageString(filteredLanguages);

    setPortfolioData((prev) => ({
      ...prev,
      language: newLanguageString,
    }));
    console.log("자격증 삭제됨, 인덱스:", index);
  };

  // ============== 타입 안전한 제출 핸들러 ==============
  const handleSubmit = async (): Promise<void> => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (!portfolioData.name?.trim()) {
        alert("이름을 입력해주세요.");
        return;
      }

      if (!portfolioData.phoneNumber?.trim()) {
        alert("연락처를 입력해주세요.");
        return;
      }

      if (!portfolioData.introduce?.trim()) {
        alert("자기소개를 입력해주세요.");
        return;
      }

      console.log("=== 제출 시작 ===");
      console.log("제출할 포트폴리오 데이터:", portfolioData);
      console.log("선택된 프로젝트 ID들:", selectedProjectIds);

      // 1. 선택된 프로젝트 ID들을 PortfolioProjectId 형태로 변환
      const projectIds: PortfolioProjectId[] = selectedProjectIds.map((id) => ({
        id,
      }));

      console.log("포트폴리오에 포함할 프로젝트들:", projectIds);

      // 2. portfolioData를 API 형식으로 변환
      const requestData = convertPortfolioDataToRequest(
        portfolioData,
        projectIds
      );

      // 3. 포트폴리오 생성 API 호출
      const portfolioResponse = await createPortfolio(requestData);
      console.log("포트폴리오 생성 성공:", portfolioResponse);

      alert(
        `포트폴리오가 성공적으로 등록되었습니다!\n-  포함된 프로젝트 수: ${selectedProjectIds.length}개`
      );

      navigate("/mypage");
    } catch (error) {
      console.error("=== 포트폴리오 등록 실패 ===", error);

      let errorMessage = "포트폴리오 등록 중 오류가 발생했습니다.";
      const err = error as ErrorResponse;

      if (err.response?.data?.message) {
        errorMessage = `등록 실패: ${err.response.data.message}`;
      } else if (err.response?.status) {
        errorMessage = `서버 오류 (${err.response.status}): 잠시 후 다시 시도해주세요.`;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-8">포트폴리오 작성</h1>

      {/* 기본 정보 섹션 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">기본 정보</h2>

        <PortfolioWriteInput
          inputText="이름"
          placeholderText="홍길동"
          type="text"
          value={portfolioData.name}
          onChange={handleNameChange}
        />

        <PortfolioWriteInput
          inputText="한 줄 자기소개"
          placeholderText="안녕하세요, 열정과 패기로 준비된 신입 개발자 홍길동입니다."
          type="text"
          value={portfolioData.introduce}
          onChange={handleIntroChange}
        />

        <PortfolioWriteInput
          inputText="연락처"
          placeholderText="010-1234-5678"
          type="tel"
          value={portfolioData.phoneNumber}
          onChange={handlePhoneNumberChange}
        />

        <PortfolioWriteInput
          inputText="이메일"
          placeholderText="etch@example.com"
          type="email"
          value={portfolioData.email}
          onChange={handleEmailChange}
        />

        <PortfolioWriteInput
          inputText="GitHub"
          placeholderText="http://github.com/username/repository"
          type="url"
          value={portfolioData.githubUrl}
          onChange={handleGithubUrlChange}
        />

        <PortfolioWriteInput
          inputText="블로그"
          placeholderText="http://blog.yourblog.com"
          type="url"
          value={portfolioData.blogUrl || ""}
          onChange={handleBlogUrlChange}
        />
      </div>

      {/* 기술 스택 섹션 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">보유 기술 스택</h2>
        <PortfolioStackSelect
          isStackData={PortfolioWriteStackData}
          isSelect={portfolioData.stack}
          onStackChange={handleStacksChange}
        />
      </div>

      {/* 프로젝트 선택 섹션 */}
      <section>
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">프로젝트 선택</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                ({selectedProjectIds.length}/{myProjects.length}개 선택됨)
              </span>
              {myProjects.length > 0 && (
                <button
                  onClick={handleSelectAllProjects}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  {selectedProjectIds.length === myProjects.length
                    ? "전체 해제"
                    : "전체 선택"}
                </button>
              )}
            </div>
          </div>
          <div className="border-b pb-2 mb-4"></div>

          {/* 프로젝트 로딩 상태 */}
          {projectsLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500">프로젝트 목록을 불러오는 중...</p>
            </div>
          )}

          {/* 프로젝트 에러 상태 */}
          {projectsError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {projectsError}
            </div>
          )}

          {/* 프로젝트 목록이 없는 경우 */}
          {!projectsLoading && !projectsError && myProjects.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-lg mb-2">등록된 프로젝트가 없습니다.</p>
              <p className="text-sm">먼저 프로젝트를 등록해주세요.</p>
            </div>
          )}

          {/* 내 프로젝트 목록 */}
          {!projectsLoading && !projectsError && myProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myProjects.map((project) => (
                <div
                  key={project.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedProjectIds.includes(project.id)
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                  onClick={() =>
                    handleProjectSelect(
                      project.id,
                      !selectedProjectIds.includes(project.id)
                    )
                  }
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedProjectIds.includes(project.id)}
                      onChange={(e) =>
                        handleProjectSelect(project.id, e.target.checked)
                      }
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

                        <div className="flex items-center space-x-2 mt-2">
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
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 교육/자격증 섹션 */}
      <section>
        <PortfolioWriteTextCard
          title="교육 / 수료 / 활동"
          type="education"
          education={parseEducationData(portfolioData.education)}
          onEducationAdd={handleActivityAdd}
          onEducationRemove={handleEducationRemove}
          showForm={showEducationForm}
          onToggleForm={() => setShowEducationForm(!showEducationForm)}
        />

        <PortfolioWriteTextCard
          title="자격증 및 어학"
          type="language"
          language={parseLanguageData(portfolioData.language)}
          onLanguageAdd={handleLicenseAdd}
          onLanguageRemove={handleLanguageRemove}
          showForm={showLanguageForm}
          onToggleForm={() => setShowLanguageForm(!showLanguageForm)}
        />
      </section>

      <PortfolioSubmitButton
        onSubmit={handleSubmit}
        isDisabled={
          isSubmitting || // 제출 중일 때 비활성화
          !portfolioData.name ||
          !portfolioData.phoneNumber ||
          !portfolioData.introduce
        }
      />

      {/* 제출 중 표시 */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>포트폴리오를 등록하고 있습니다...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MypagePortfolioPage;
