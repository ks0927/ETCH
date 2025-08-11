import { useState } from "react";
import { ProjectIsPublicData } from "../../../types/project/proejctIsPublicData";
import {
  ProjectWriteCategoryData,
  type ProjectCategoryEnum,
} from "../../../types/project/projectCategroyData";
import ProjectIsPublic from "../../organisms/project/write/projectIsPublic";
import CategorySVG from "../../svg/categorySVG";
import IsPublicSVG from "../../svg/isPublicSVG";
import ProjectSVG from "../../svg/projectSVG";
import {
  ProjectState,
  type ProjectData,
} from "../../../types/project/projectDatas";
import ProjectCategory from "../../organisms/project/write/projectCategory";
import ProjectWriteInput from "../../organisms/project/write/projectWriteInput";
import ProjectStack from "../../organisms/project/write/projectStack";
import {
  ProejctWriteTechData,
  type ProjectTechEnum,
} from "../../../types/project/projecStackData";
import ProjectWriteSubmitButton from "../../organisms/project/write/projectWriteSubmitButton";
import ProjectFileUpload from "../../organisms/project/write/projectFileUpload";
import StackSVG from "../../svg/stackSVG";
import { createProjectWithFiles } from "../../../api/projectApi";

function ProjectWritePage() {
  const [projectData, setProjectData] = useState<ProjectData>({
    ...ProjectState,
    // projectTechs를 빈 배열로 초기화 (타입에 맞게)
  });

  const handleFileUpload = (newFiles: File[]) => {
    setProjectData((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles].slice(0, 5), // 최대 5개까지
    }));

    console.log("파일 추가 됨");
  };

  const handleFileRemove = (index: number) => {
    setProjectData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
    console.log("파일 제거 됨");
  };

  // 제목 변경 핸들러
  const handleTitleChange = (value: string) => {
    setProjectData((prev) => ({
      ...prev,
      title: value,
    }));
    console.log("현재 제목 : ", value);
  };

  // 설명(내용) 변경 핸들러
  const handleContentChange = (value: string) => {
    setProjectData((prev) => ({
      ...prev,
      content: value,
    }));
    console.log("현재 내용 : ", value);
  };

  // 기술 스택 변경 핸들러 (중복 선택 가능)
  const handleStacksChange = (stack: ProjectTechEnum) => {
    setProjectData((prev) => {
      const currentStacks = prev.projectTechs; // stack -> projectTechs
      const isSelected = currentStacks.includes(stack);

      let newStacks;
      if (isSelected) {
        // 이미 선택된 스택이면 제거
        newStacks = currentStacks.filter((s) => s !== stack);
      } else {
        // 선택되지 않은 스택이면 추가
        newStacks = [...currentStacks, stack];
      }

      console.log("현재 스택들 : ", newStacks);

      return {
        ...prev,
        projectTechs: newStacks, // stack -> projectTechs
      };
    });
  };

  // 프로젝트 제출 핸들러
  const handleSubmit = async () => {
    try {
      // 유효성 검사
      if (!projectData.title.trim()) {
        alert("프로젝트 제목을 입력해주세요.");
        return;
      }

      if (!projectData.content.trim()) {
        alert("프로젝트 설명을 입력해주세요.");
        return;
      }

      if (!projectData.category) {
        alert("프로젝트 카테고리를 선택해주세요.");
        return;
      }

      console.log("=== 제출할 데이터 상세 ===");
      console.log("title:", projectData.title);
      console.log("content:", projectData.content);
      console.log("category:", projectData.category);
      console.log("youtubeUrl:", projectData.youtubeUrl);
      console.log("githubUrl:", projectData.githubUrl);
      console.log("isPublic:", projectData.isPublic);
      console.log("projectTechs:", projectData.projectTechs);
      console.log("files:", projectData.files);
      console.log("전체 projectData:", projectData);

      // 실제 API 호출
      const projectId = await createProjectWithFiles(projectData);

      console.log("프로젝트 생성 성공! ID:", projectId);

      // 성공 처리
      alert("프로젝트가 성공적으로 등록되었습니다!");

      // 프로젝트 상세 페이지로 이동하거나 목록 페이지로 이동
      // navigate(`/projects/${projectId}`); // react-router 사용 시
      // 또는
      // window.location.href = `/projects/${projectId}`;
    } catch (error) {
      // 에러 처리
      console.error("프로젝트 생성 실패:", error);

      // 에러 메시지 추출
      let errorMessage = "프로젝트 등록 중 오류가 발생했습니다.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // axios 에러인 경우
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: { message?: string };
          };
        };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      alert(errorMessage);
    }
  };

  // 시연 영상 URL 변경 핸들러
  const handleVideoUrlChange = (value: string) => {
    setProjectData((prev) => ({
      ...prev,
      youtubeUrl: value, // videoUrl -> youtubeUrl
    }));

    console.log("현재 유튜브 주소 : ", value);
  };

  // GitHub URL 변경 핸들러
  const handleGithubUrlChange = (value: string) => {
    setProjectData((prev) => ({
      ...prev,
      githubUrl: value,
    }));

    console.log("현재 깃허브 주소 : ", value);
  };

  // 카테고리 선택 핸들러
  const handleCategoryChange = (category: ProjectCategoryEnum) => {
    setProjectData((prev) => ({
      ...prev,
      category,
    }));
    console.log("현재 카테고리 : ", category);
  };

  // 공개 설정 핸들러
  const handleIsPublicChange = (isPublic: boolean) => {
    setProjectData((prev) => ({
      ...prev,
      isPublic: isPublic,
    }));
    console.log("현재 공개 설정 : ", isPublic);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* 메인 헤더 섹션 */}
        <section className="mb-6 sm:mb-8 lg:mb-12">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              새 프로젝트 만들기
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              당신의 창의적인 작품을 전 세계와 공유하세요. 프로젝트의 모든
              세부사항을 입력하고 최고의 작품을 업로드하세요.
            </p>
          </div>
        </section>

        {/* 메인 콘텐츠 - 이제 단일 컬럼 */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          <section>
            {/* 파일 업로드 섹션 */}
            <ProjectFileUpload
              uploadedFiles={projectData.files} // files로 수정
              onFileUpload={handleFileUpload}
              onFileRemove={handleFileRemove}
              maxFiles={10}
              maxFileSize={10 * 1024 * 1024}
              acceptedTypes={["image/png", "image/jpeg", "application/pdf"]}
            />
          </section>

          {/* 프로젝트 상세 정보 섹션 */}
          <section>
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <ProjectSVG />
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    프로젝트 상세 정보
                  </h2>
                  <p className="text-sm text-gray-600">
                    프로젝트의 기본 정보를 입력해주세요.
                  </p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <ProjectWriteInput
                  inputText="프로젝트 제목"
                  placeholderText="프로젝트 제목을 입력해주세요"
                  type="text"
                  value={projectData.title}
                  onChange={handleTitleChange}
                />
                <ProjectWriteInput
                  inputText="프로젝트 설명"
                  placeholderText="프로젝트 설명을 입력해주세요"
                  type="text"
                  value={projectData.content}
                  onChange={handleContentChange}
                />

                <ProjectWriteInput
                  inputText="시연 영상 URL"
                  placeholderText="http://www.youtube.com/yourvideo"
                  type="url"
                  value={projectData.youtubeUrl} // youtubeUrl로 수정
                  onChange={handleVideoUrlChange}
                />

                <ProjectWriteInput
                  inputText="GitHub URL"
                  placeholderText="http://github.com/username/repository"
                  type="url"
                  value={projectData.githubUrl}
                  onChange={handleGithubUrlChange}
                />
              </div>
            </div>
          </section>
          <section>
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <StackSVG />
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    기술 스택 선택
                  </h2>
                  <p className="text-sm text-gray-600">
                    사용한 기술을 선택해주세요.
                  </p>
                </div>
              </div>
              <div></div>
              <ProjectStack
                isStackData={ProejctWriteTechData}
                isSelect={projectData.projectTechs} // stack -> projectTechs
                onStackChange={handleStacksChange}
              />
            </div>
          </section>
          <section>
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <CategorySVG />
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    카테고리 선택
                  </h2>
                  <p className="text-sm text-gray-600">
                    프로젝트 카테고리를 선택해주세요.
                  </p>
                </div>
              </div>
              <div>
                <ProjectCategory
                  isCategoryData={ProjectWriteCategoryData}
                  isSelect={projectData.category}
                  onCategoryChange={handleCategoryChange}
                />
              </div>
            </div>
          </section>

          {/* 공개 설정 섹션 - 사이드바에서 메인으로 이동 */}
          <section>
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <IsPublicSVG />
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    공개 설정
                  </h2>
                  <p className="text-sm text-gray-600">
                    프로젝트 공개 범위를 설정해주세요.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <ProjectIsPublic
                  isPublicData={ProjectIsPublicData}
                  isPublic={projectData.isPublic}
                  onIsPublicChange={handleIsPublicChange}
                />
              </div>
            </div>
          </section>
        </div>
        <section className="mt-6 sm:mt-8 lg:mt-12">
          <div className="flex justify-center">
            <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
              <ProjectWriteSubmitButton
                onSubmit={handleSubmit}
                isDisabled={!projectData.title || !projectData.content}
              />
            </div>

            <div className="hidden sm:block w-full max-w-md">
              <ProjectWriteSubmitButton
                onSubmit={handleSubmit}
                isDisabled={!projectData.title || !projectData.content}
              />
            </div>
          </div>
        </section>
        {/* 모바일에서 하단 여백 확보 */}
        <div className="h-20 sm:hidden"></div>
      </div>
    </div>
  );
}
export default ProjectWritePage;
