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
  type ProjectInputData, // 추가
} from "../../../types/project/projectDatas";
import ProjectCategory from "../../organisms/project/write/projectCategory";
import ProjectWriteInput from "../../organisms/project/write/projectWriteInput";
import ProjectStack from "../../organisms/project/write/projectStack";
import ProjectWriteSubmitButton from "../../organisms/project/write/projectWriteSubmitButton";
import ProjectFileUpload from "../../organisms/project/write/projectFileUpload";
import StackSVG from "../../svg/stackSVG";
import { createProject } from "../../../api/projectApi";
import { useNavigate } from "react-router";
import { ProjectWriteTechData } from "../../../types/project/projecTechData";

// 기존 ProjectData 사용 (단순하게!)
function ProjectWritePage() {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState<ProjectData>({
    ...ProjectState,
  });

  const handleFileUpload = (newFiles: File[]) => {
    setProjectData((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles].slice(0, 5),
    }));
    console.log("파일 추가됨");
  };

  const handleFileRemove = (index: number) => {
    setProjectData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
    console.log("파일 제거됨");
  };

  const handleTitleChange = (value: string) => {
    setProjectData((prev) => ({
      ...prev,
      title: value,
    }));
  };

  const handleContentChange = (value: string) => {
    setProjectData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  // ID 기반으로 수정된 기술 스택 핸들러
  const handleStacksChange = (techId: number) => {
    setProjectData((prev) => {
      const currentIds = prev.projectTechs;
      const isSelected = currentIds.includes(techId);

      let newIds;
      if (isSelected) {
        newIds = currentIds.filter((id) => id !== techId);
      } else {
        newIds = [...currentIds, techId];
      }

      console.log("현재 기술 스택 ID:", newIds);

      return {
        ...prev,
        projectTechs: newIds,
      };
    });
  };

  // 파일 분류 함수
  const categorizeFiles = (files: File[]) => {
    let thumbnailFile: File | undefined;
    const imageFiles: File[] = [];
    let pdfFile: File | undefined;

    files.forEach((file, index) => {
      if (file.type.startsWith("image/")) {
        if (index === 0) {
          thumbnailFile = file;
        } else {
          imageFiles.push(file);
        }
      } else if (file.type === "application/pdf") {
        pdfFile = file;
      }
    });

    return { thumbnailFile, imageFiles, pdfFile };
  };

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

      // 파일 분류
      const { thumbnailFile, imageFiles, pdfFile } = categorizeFiles(
        projectData.files
      );

      // ProjectInputData 형태로 API 호출
      const projectInput: ProjectInputData = {
        title: projectData.title,
        content: projectData.content,
        category: projectData.category as ProjectCategoryEnum,
        techCodeIds: projectData.projectTechs, // number[] 그대로 사용
        githubUrl: projectData.githubUrl || "",
        youtubeUrl: projectData.youtubeUrl || "",
        isPublic: projectData.isPublic,
        thumbnailFile,
        imageFiles,
        pdfFile,
      };

      console.log("=== 제출할 데이터 ===");
      console.log("projectInput:", projectInput);

      // API 호출
      const projectId = await createProject(projectInput);

      console.log("프로젝트 생성 성공! ID:", projectId);
      alert("프로젝트가 성공적으로 등록되었습니다!");

      // 성공 후 /projects 페이지로 이동
      navigate("/projects");
    } catch (error) {
      console.error("프로젝트 생성 실패:", error);
      alert("프로젝트 등록 중 오류가 발생했습니다.");
    }
  };

  const handleVideoUrlChange = (value: string) => {
    setProjectData((prev) => ({
      ...prev,
      youtubeUrl: value,
    }));
  };

  const handleGithubUrlChange = (value: string) => {
    setProjectData((prev) => ({
      ...prev,
      githubUrl: value,
    }));
  };

  const handleCategoryChange = (category: ProjectCategoryEnum) => {
    setProjectData((prev) => ({
      ...prev,
      category,
    }));
    console.log("현재 카테고리 스택 ID:", category);
  };

  const handleIsPublicChange = (isPublic: boolean) => {
    setProjectData((prev) => ({
      ...prev,
      isPublic: isPublic,
    }));
    console.log("현재 공개 상태(true: 공개):", isPublic);
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

        {/* 메인 콘텐츠 */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          <section>
            <ProjectFileUpload
              uploadedFiles={projectData.files}
              onFileUpload={handleFileUpload}
              onFileRemove={handleFileRemove}
              maxFiles={5}
              maxFileSize={5 * 1024 * 1024}
              acceptedTypes={["image/png", "image/jpeg", "application/pdf"]}
            />
          </section>

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
                  value={projectData.youtubeUrl}
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

              {/* 기존 방식 그대로 사용 */}
              <ProjectStack
                isStackData={ProjectWriteTechData}
                isSelect={projectData.projectTechs}
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
              <ProjectCategory
                isCategoryData={ProjectWriteCategoryData}
                isSelect={projectData.category}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </section>

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
              <ProjectIsPublic
                isPublicData={ProjectIsPublicData}
                isPublic={projectData.isPublic}
                onIsPublicChange={handleIsPublicChange}
              />
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

        <div className="h-20 sm:hidden"></div>
      </div>
    </div>
  );
}

export default ProjectWritePage;
