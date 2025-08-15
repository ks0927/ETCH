import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
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
import PortfolioWriteTextCard from "../../organisms/portfolio/portfolioTextCard";
import {
  convertPortfolioDataToRequest,
  updatePortfolio,
  getPortfolioDetail,
  type PortfolioProjectId,
  type PortfolioDetailResponseDTO,
  type EduAndActDTO,
  type CertAndLangDTO,
} from "../../../api/portfolioApi";
import {
  createProject,
  getMyProjects,
  type MyProjectResponse,
} from "../../../api/projectApi";
import PortfolioProjectPage from "./portfolioProjectPage";
import type { ProjectCategoryEnum } from "../../../types/project/projectCategroyData";

// 프로젝트 데이터 타입 정의
interface ProjectData {
  title: string;
  content: string;
  projectCategory: ProjectCategoryEnum | "";
  githubUrl: string;
  youtubeUrl: string;
  isPublic: boolean;
  projectTechs: number[];
  files: File[];
  thumbnailFile: File | null;
}

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
const initialProjectData: ProjectData = {
  title: "",
  content: "",
  projectCategory: "",
  githubUrl: "",
  youtubeUrl: "",
  isPublic: true,
  projectTechs: [],
  files: [],
  thumbnailFile: null,
};

function MypagePortfolioPageEdit() {
  const navigate = useNavigate();
  const { id: portfolioId } = useParams<{ id: string }>();

  const [portfolioData, setPortfolioData] = useState<portfolioDatas>({
    ...PortfolioState,
    stack: [] as PortfolioStackEnum[],
  });

  // 로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 프로젝트 관련 상태들
  const [myProjects, setMyProjects] = useState<MyProjectResponse[]>([]);
  const [originalSelectedProjectIds, setOriginalSelectedProjectIds] = useState<
    number[]
  >([]); // 원본 선택된 프로젝트들
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]); // 현재 선택된 프로젝트들
  const [tempDeletedProjectIds, setTempDeletedProjectIds] = useState<number[]>(
    []
  ); // 임시 삭제된 프로젝트들
  const [projectsLoading, setProjectsLoading] = useState<boolean>(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  // 새 프로젝트 등록 상태들
  const [showNewProjectForm, setShowNewProjectForm] = useState<boolean>(false);
  const [newProjectData, setNewProjectData] =
    useState<ProjectData>(initialProjectData);
  const [newProjectsCreated, setNewProjectsCreated] = useState<ProjectData[]>(
    []
  );

  // 교육/활동과 자격증 폼 토글 상태들
  const [showEducationForm, setShowEducationForm] = useState<boolean>(false);
  const [showLanguageForm, setShowLanguageForm] = useState<boolean>(false);

  // 제출 상태 관리
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 포트폴리오 ID 유효성 검사
  useEffect(() => {
    if (!portfolioId || isNaN(Number(portfolioId))) {
      setLoadError("유효하지 않은 포트폴리오 ID입니다.");
      setIsLoading(false);
      return;
    }
  }, [portfolioId]);

  // 기존 포트폴리오 데이터 로드
  useEffect(() => {
    const loadPortfolioData = async (): Promise<void> => {
      if (!portfolioId || isNaN(Number(portfolioId))) return;

      try {
        setIsLoading(true);
        setLoadError(null);

        console.log("포트폴리오 데이터 로드 중...", portfolioId);
        const portfolioDetail = await getPortfolioDetail(Number(portfolioId));

        console.log("로드된 포트폴리오 데이터:", portfolioDetail);

        // 백엔드 데이터를 프론트엔드 형식으로 변환
        const convertedData = convertBackendDataToFrontend(portfolioDetail);
        setPortfolioData(convertedData);

        // 기존 선택된 프로젝트 ID들 설정
        if (
          portfolioDetail.projectList &&
          portfolioDetail.projectList.length > 0
        ) {
          const existingProjectIds = portfolioDetail.projectList
            .map((project) =>
              typeof project === "object" ? project.id : project
            )
            .filter((id): id is number => typeof id === "number");

          setOriginalSelectedProjectIds(existingProjectIds); // 원본 저장
          setSelectedProjectIds(existingProjectIds); // 현재 선택된 것도 동일하게 설정
        }

        console.log("포트폴리오 데이터 로드 완료");
      } catch (error) {
        console.error("포트폴리오 데이터 로드 실패:", error);
        setLoadError("포트폴리오 데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolioData();
  }, [portfolioId]);

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

  // 백엔드 데이터를 프론트엔드 포트폴리오 데이터로 변환
  const convertBackendDataToFrontend = (
    backendData: PortfolioDetailResponseDTO
  ): portfolioDatas => {
    return {
      name: backendData.name || "",
      introduce: backendData.introduce || "",
      githubUrl: backendData.githubUrl || "",
      blogUrl: backendData.blogUrl || "",
      phoneNumber: backendData.phoneNumber || "",
      email: backendData.email || "",
      stack:
        backendData.techList?.map((tech) => tech as PortfolioStackEnum) || [],
      education: convertEduAndActDTOArrayToString(backendData.education || []),
      language: convertCertAndLangDTOArrayToString(backendData.language || []),
    };
  };

  // EduAndActDTO 배열을 문자열로 변환
  const convertEduAndActDTOArrayToString = (
    eduArray: EduAndActDTO[]
  ): string => {
    if (!Array.isArray(eduArray) || eduArray.length === 0) return "";

    return eduArray
      .map(
        (edu) =>
          `${edu.name}^${edu.description}^${edu.startDate}^${edu.endDate}`
      )
      .join("|");
  };

  // CertAndLangDTO 배열을 문자열로 변환
  const convertCertAndLangDTOArrayToString = (
    certArray: CertAndLangDTO[]
  ): string => {
    if (!Array.isArray(certArray) || certArray.length === 0) return "";

    return certArray
      .map((cert) => `${cert.name}^${cert.date}^${cert.certificateIssuer}`)
      .join("|");
  };

  // ============== 파싱 함수들 (화면 표시용만) ==============

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

  // ============== 기본 정보 핸들러들 ==============

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

  // ============== 기존 프로젝트 선택 관련 핸들러들 ==============

  const handleProjectSelect = (projectId: number, selected: boolean): void => {
    if (selected) {
      setSelectedProjectIds((prev) => [...prev, projectId]);
      // 임시 삭제 목록에서 제거
      setTempDeletedProjectIds((prev) => prev.filter((id) => id !== projectId));
    } else {
      setSelectedProjectIds((prev) => prev.filter((id) => id !== projectId));
      // 원래 선택되었던 프로젝트라면 임시 삭제 목록에 추가
      if (originalSelectedProjectIds.includes(projectId)) {
        setTempDeletedProjectIds((prev) => [...prev, projectId]);
      }
    }
  };

  const handleSelectAllProjects = (): void => {
    const availableProjects = myProjects.filter(
      (project) => !tempDeletedProjectIds.includes(project.id)
    );

    if (selectedProjectIds.length === availableProjects.length) {
      // 모든 선택 해제
      const originallySelected = selectedProjectIds.filter((id) =>
        originalSelectedProjectIds.includes(id)
      );
      setTempDeletedProjectIds((prev) => [...prev, ...originallySelected]);
      setSelectedProjectIds([]);
    } else {
      // 모든 선택
      setSelectedProjectIds(availableProjects.map((project) => project.id));
      setTempDeletedProjectIds([]);
    }
  };

  // ============== 임시 삭제 관련 핸들러들 ==============

  // ============== 포트폴리오에서 제외 관련 핸들러들 (텍스트 수정) ==============

  const handleTempDeleteSelectedProjects = (): void => {
    if (selectedProjectIds.length === 0) {
      alert("포트폴리오에서 제외할 프로젝트를 선택해주세요.");
      return;
    }

    const confirmMessage = `선택된 ${selectedProjectIds.length}개의 프로젝트를 이 포트폴리오에서 제외하시겠습니까?\n\n※ 프로젝트 자체는 삭제되지 않으며, 다른 포트폴리오에서 계속 사용할 수 있습니다.`;

    if (!confirm(confirmMessage)) {
      return;
    }

    // 원래 포트폴리오에 포함되었던 프로젝트들만 제외 목록에 추가
    const projectsToExclude = selectedProjectIds.filter((id) =>
      originalSelectedProjectIds.includes(id)
    );

    setTempDeletedProjectIds((prev) => [...prev, ...projectsToExclude]);
    setSelectedProjectIds([]);

    alert(
      `${selectedProjectIds.length}개의 프로젝트가 포트폴리오에서 제외되었습니다.\n※ 프로젝트는 삭제되지 않았습니다.`
    );
  };

  // 제외 취소 함수
  const handleCancelTempDelete = (projectId: number): void => {
    setTempDeletedProjectIds((prev) => prev.filter((id) => id !== projectId));
    setSelectedProjectIds((prev) => [...prev, projectId]);
  };

  // ============== 새 프로젝트 등록 관련 핸들러들 ==============

  const handleNewProjectDataChange = (
    newProjectData: Partial<ProjectData>
  ): void => {
    setNewProjectData((prev) => ({
      ...prev,
      ...newProjectData,
    }));
  };

  const handleRegisterNewProject = (): void => {
    // 프로젝트 유효성 검사
    if (!newProjectData.title.trim()) {
      alert("프로젝트 제목을 입력해주세요.");
      return;
    }

    if (!newProjectData.content.trim()) {
      alert("프로젝트 설명을 입력해주세요.");
      return;
    }

    if (!newProjectData.projectCategory) {
      alert("프로젝트 카테고리를 선택해주세요.");
      return;
    }

    // 새로 생성된 프로젝트 목록에 추가
    setNewProjectsCreated((prev) => [...prev, { ...newProjectData }]);

    // 프로젝트 데이터 초기화
    setNewProjectData(initialProjectData);

    // 프로젝트 폼 숨기기
    setShowNewProjectForm(false);

    alert("새 프로젝트가 임시 등록되었습니다!");
  };

  const handleRemoveNewProject = (index: number): void => {
    setNewProjectsCreated((prev) => prev.filter((_, i) => i !== index));
  };

  // ============== 교육/자격증 관련 핸들러들 ==============

  const handleActivityAdd = (educationString: string): void => {
    const newEducationString = portfolioData.education
      ? `${portfolioData.education}|${educationString}`
      : educationString;

    setPortfolioData((prev) => ({
      ...prev,
      education: newEducationString,
    }));

    setShowEducationForm(false);
  };

  const handleLicenseAdd = (languageString: string): void => {
    const newLanguageString = portfolioData.language
      ? `${portfolioData.language}|${languageString}`
      : languageString;

    setPortfolioData((prev) => ({
      ...prev,
      language: newLanguageString,
    }));

    setShowLanguageForm(false);
  };

  const handleEducationRemove = (index: number): void => {
    const parsedEducations = parseEducationData(portfolioData.education);
    const filteredEducations = parsedEducations.filter((_, i) => i !== index);
    const newEducationString = arrayToEducationString(filteredEducations);

    setPortfolioData((prev) => ({
      ...prev,
      education: newEducationString,
    }));
  };

  const handleLanguageRemove = (index: number): void => {
    const parsedLanguages = parseLanguageData(portfolioData.language);
    const filteredLanguages = parsedLanguages.filter((_, i) => i !== index);
    const newLanguageString = arrayToLanguageString(filteredLanguages);

    setPortfolioData((prev) => ({
      ...prev,
      language: newLanguageString,
    }));
  };

  // ============== 취소 핸들러 ==============
  const handleCancel = (): void => {
    if (confirm("수정을 취소하시겠습니까? 변경사항이 모두 사라집니다.")) {
      navigate("/mypage/portfolios");
    }
  };

  // ============== 제출 핸들러 (수정용) ==============
  // ============== 제출 핸들러 (수정된 버전 - 실제 프로젝트 삭제 제거) ==============
  const handleSubmit = async (): Promise<void> => {
    if (isSubmitting || !portfolioId) return;

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

      console.log("=== 포트폴리오 수정 시작 ===");
      console.log("포트폴리오 ID:", portfolioId);
      console.log("수정할 포트폴리오 데이터:", portfolioData);
      console.log("현재 선택된 프로젝트 ID들:", selectedProjectIds);
      console.log("새로 생성할 프로젝트들:", newProjectsCreated);
      console.log("포트폴리오에서 제외할 프로젝트들:", tempDeletedProjectIds);

      // 1. 새로 생성된 프로젝트들을 실제로 생성
      const createdNewProjectIds: number[] = [];

      for (const project of newProjectsCreated) {
        try {
          const projectInput = {
            title: project.title,
            content: project.content,
            projectCategory: project.projectCategory as ProjectCategoryEnum,
            techCodeIds: project.projectTechs,
            githubUrl: project.githubUrl,
            youtubeUrl: project.youtubeUrl,
            isPublic: project.isPublic,
            thumbnailFile: project.thumbnailFile || undefined,
            imageFiles: project.files.filter((file) =>
              file.type.startsWith("image/")
            ),
          };

          console.log(`새 프로젝트 "${project.title}" 생성 중...`);
          const createdProject = await createProject(projectInput);

          // createProject 응답에서 ID 추출
          let projectId: number | null = null;

          if (typeof createdProject === "number") {
            projectId = createdProject;
          } else if (createdProject && typeof createdProject === "object") {
            projectId =
              (createdProject as any).id ||
              (createdProject as any).projectId ||
              (createdProject as any).projectList;
          }

          if (projectId && typeof projectId === "number") {
            createdNewProjectIds.push(projectId);
            console.log(
              `새 프로젝트 "${project.title}" 생성 완료, ID: ${projectId}`
            );
          } else {
            console.error(
              `새 프로젝트 "${project.title}" ID 추출 실패:`,
              createdProject
            );
            alert(`새 프로젝트 "${project.title}"의 ID를 가져올 수 없습니다.`);
          }
        } catch (projectError) {
          console.error(
            `새 프로젝트 "${project.title}" 생성 실패:`,
            projectError
          );
          alert(
            `새 프로젝트 "${project.title}" 등록에 실패했습니다. 계속 진행합니다.`
          );
        }
      }

      // 2. 최종 포트폴리오에 포함할 프로젝트 ID들
      // 현재 선택된 프로젝트들 + 새로 생성된 프로젝트들
      const finalProjectIds = [...selectedProjectIds, ...createdNewProjectIds];
      const projectIds: PortfolioProjectId[] = finalProjectIds.map((id) => ({
        id,
      }));

      console.log("=== 🎯 최종 포트폴리오 프로젝트 구성 ===");
      console.log("원래 포함되었던 프로젝트들:", originalSelectedProjectIds);
      console.log("현재 선택된 기존 프로젝트들:", selectedProjectIds);
      console.log("새로 생성된 프로젝트들:", createdNewProjectIds);
      console.log("포트폴리오에서 제외될 프로젝트들:", tempDeletedProjectIds);
      console.log("최종 포트폴리오에 포함될 프로젝트들:", finalProjectIds);

      // 3. portfolioData를 API 형식으로 변환
      const requestData = convertPortfolioDataToRequest(
        portfolioData,
        projectIds
      );

      console.log("📨 포트폴리오 수정 API 요청 데이터:", requestData);

      // 4. 포트폴리오 수정 API 호출
      await updatePortfolio(Number(portfolioId), requestData);
      console.log("포트폴리오 수정 성공");

      // 성공 메시지
      const successMessage =
        `포트폴리오가 성공적으로 수정되었습니다!\n\n` +
        `📊 수정 내용:\n` +
        `- 기존 프로젝트 유지: ${selectedProjectIds.length}개\n` +
        `- 새로 추가된 프로젝트: ${createdNewProjectIds.length}개\n` +
        `- 포트폴리오에서 제외된 프로젝트: ${tempDeletedProjectIds.length}개\n` +
        `- 최종 포트폴리오 프로젝트 수: ${finalProjectIds.length}개\n\n` +
        `※ 제외된 프로젝트는 삭제되지 않았으며, 다른 포트폴리오에서 사용할 수 있습니다.`;

      alert(successMessage);
      navigate("/mypage");
    } catch (error) {
      console.error("=== 포트폴리오 수정 실패 ===", error);

      let errorMessage = "포트폴리오 수정 중 오류가 발생했습니다.";
      const err = error as ErrorResponse;

      if (err.response?.data?.message) {
        errorMessage = `수정 실패: ${err.response.data.message}`;
      } else if (err.response?.status) {
        errorMessage = `서버 오류 (${err.response.status}): 잠시 후 다시 시도해주세요.`;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 화면에 표시할 프로젝트들 필터링 (임시 삭제된 것들 제외)
  const displayProjects = myProjects.filter(
    (project) => !tempDeletedProjectIds.includes(project.id)
  );

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center bg-white">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p>포트폴리오 데이터를 불러오는 중...</p>
      </div>
    );
  }

  // 에러가 있을 때
  if (loadError) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center bg-white">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {loadError}
        </div>
        <button
          onClick={() => navigate("/mypage/portfolios")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          포트폴리오 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">포트폴리오 수정</h1>
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
      </div>

      {/* 기본 정보 섹션 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5 pb-2 border-b border-gray-200">
          기본 정보
        </h2>

        <div className="space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>

      {/* 기술 스택 섹션 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5 pb-2 border-b border-gray-200">
          보유 기술 스택
        </h2>
        <PortfolioStackSelect
          isStackData={PortfolioWriteStackData}
          isSelect={portfolioData.stack}
          onStackChange={handleStacksChange}
        />
      </div>

      {/* 프로젝트 섹션 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">프로젝트</h2>
          <div className="text-sm text-gray-500">
            선택된 기존: {selectedProjectIds.length}개, 새로 생성:{" "}
            {newProjectsCreated.length}개, 임시 삭제:{" "}
            {tempDeletedProjectIds.length}개
          </div>
        </div>

        {/* 임시 삭제된 프로젝트들 표시 */}
        {tempDeletedProjectIds.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-red-800 mb-3">
              임시 삭제된 프로젝트 ({tempDeletedProjectIds.length}개)
            </h3>
            <div className="space-y-2">
              {tempDeletedProjectIds.map((projectId) => {
                const project = myProjects.find((p) => p.id === projectId);
                if (!project) return null;

                return (
                  <div
                    key={projectId}
                    className="flex items-center justify-between bg-white border border-red-200 rounded-md p-3"
                  >
                    <div>
                      <span className="font-medium text-red-700">
                        {project.title}
                      </span>
                      <span className="text-sm text-red-600 ml-2">
                        (수정 완료 시 삭제됩니다)
                      </span>
                    </div>
                    <button
                      onClick={() => handleCancelTempDelete(projectId)}
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      삭제 취소
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 기존 프로젝트 선택 섹션 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium text-gray-900">
              기존 프로젝트 선택
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                ({selectedProjectIds.length}/{displayProjects.length}개 선택됨)
              </span>
              {displayProjects.length > 0 && (
                <>
                  <button
                    onClick={handleSelectAllProjects}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    {selectedProjectIds.length === displayProjects.length
                      ? "전체 해제"
                      : "전체 선택"}
                  </button>
                  {selectedProjectIds.length > 0 && (
                    <button
                      onClick={handleTempDeleteSelectedProjects}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      선택한 {selectedProjectIds.length}개 임시 삭제
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 프로젝트 로딩/에러/빈 상태 */}
          {projectsLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500">프로젝트 목록을 불러오는 중...</p>
            </div>
          )}

          {projectsError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {projectsError}
            </div>
          )}

          {!projectsLoading &&
            !projectsError &&
            displayProjects.length === 0 && (
              <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="mb-1">
                  {tempDeletedProjectIds.length > 0
                    ? "모든 프로젝트가 임시 삭제되었습니다."
                    : "등록된 프로젝트가 없습니다."}
                </p>
                <p className="text-sm">아래에서 새 프로젝트를 등록해보세요.</p>
              </div>
            )}

          {/* 기존 프로젝트 목록 */}
          {!projectsLoading && !projectsError && displayProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayProjects.map((project) => (
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

                      <h4 className="font-semibold text-base mb-1 text-gray-900 truncate">
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

        {/* 새 프로젝트 등록 섹션 */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-medium text-gray-900">
              새 프로젝트 등록
            </h3>
            <button
              onClick={() => setShowNewProjectForm(!showNewProjectForm)}
              className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              {showNewProjectForm ? "등록 폼 닫기" : "새 프로젝트 등록 +"}
            </button>
          </div>

          {/* 새 프로젝트 작성 폼 */}
          {showNewProjectForm && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
              <PortfolioProjectPage
                projectData={newProjectData}
                onProjectDataChange={handleNewProjectDataChange}
              />
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowNewProjectForm(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleRegisterNewProject}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  새 프로젝트 등록
                </button>
              </div>
            </div>
          )}

          {/* 새로 등록된 프로젝트 목록 */}
          {newProjectsCreated.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-base font-medium text-green-700">
                새로 등록된 프로젝트 ({newProjectsCreated.length}개)
              </h4>
              {newProjectsCreated.map((project, index) => (
                <div
                  key={index}
                  className="border border-green-200 rounded-lg p-4 bg-green-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-semibold text-base text-gray-900">
                        {project.title}
                      </h5>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {project.content}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        {project.githubUrl && (
                          <span>
                            GitHub: {project.githubUrl.substring(0, 30)}...
                          </span>
                        )}
                        {project.youtubeUrl && (
                          <span>
                            YouTube: {project.youtubeUrl.substring(0, 30)}...
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveNewProject(index)}
                      className="text-red-500 hover:text-red-700 text-sm ml-4 px-2 py-1"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 교육/자격증 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
      </div>

      {/* 제출 버튼 */}
      <div className="flex justify-center">
        <PortfolioSubmitButton
          onSubmit={handleSubmit}
          isDisabled={
            isSubmitting ||
            !portfolioData.name ||
            !portfolioData.phoneNumber ||
            !portfolioData.introduce
          }
        />
      </div>

      {/* 제출 중 표시 */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center max-w-sm mx-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-900 font-medium">
              포트폴리오를 수정하고 있습니다...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              새 프로젝트 생성, 프로젝트 삭제 및 포트폴리오 수정 중...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MypagePortfolioPageEdit;
