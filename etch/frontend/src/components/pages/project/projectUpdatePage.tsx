import { useState, useEffect } from "react";
import { ProjectIsPublicData } from "../../../types/project/proejctIsPublicData";
import {
  ProjectWriteCategoryData,
  type ProjectCategoryEnum,
} from "../../../types/project/projectCategroyData";
import ProjectIsPublic from "../../organisms/project/write/projectIsPublic";
import CategorySVG from "../../svg/categorySVG";
import IsPublicSVG from "../../svg/isPublicSVG";
import ProjectSVG from "../../svg/projectSVG";
import StackSVG from "../../svg/stackSVG";
import ProjectCategory from "../../organisms/project/write/projectCategory";
import ProjectWriteInput from "../../organisms/project/write/projectWriteInput";
import ProjectWriteText from "../../organisms/project/write/projectWriteText";
import ProjectStack from "../../organisms/project/write/projectStack";
import ProjectWriteSubmitButton from "../../organisms/project/write/projectWriteSubmitButton";
import ProjectFileUpload from "../../organisms/project/write/projectFileUpload";
import { getProjectById, updateProject } from "../../../api/projectApi";
import { ProjectWriteTechData } from "../../../types/project/projectTechData";
import type {
  BackendProjectResponse,
  ProjectUpdateRequest,
} from "../../../types/project/projectUpdateFileUploadProps";
import { useNavigate, useParams } from "react-router";

// 수정 페이지용 폼 데이터 타입
interface ProjectUpdateFormData {
  title: string;
  content: string;
  projectCategory: ProjectCategoryEnum | "";
  projectTechs: number[]; // 선택된 기술 스택 ID들
  githubUrl: string;
  youtubeUrl: string;
  isPublic: boolean;
  files: File[]; // 새로 추가할 파일들
}

// 기존 파일 타입
interface ExistingFile {
  id: number;
  fileName: string;
  fileUrl: string;
  isPdf: boolean;
}

function ProjectUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 로딩 상태
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 폼 데이터
  const [formData, setFormData] = useState<ProjectUpdateFormData>({
    title: "",
    content: "",
    projectCategory: "",
    projectTechs: [],
    githubUrl: "",
    youtubeUrl: "",
    isPublic: true,
    files: [],
  });

  // 파일 관련 상태
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<
    string | null
  >(null);
  const [removeThumbnail, setRemoveThumbnail] = useState(false);

  // 기존 파일들
  const [existingFiles, setExistingFiles] = useState<ExistingFile[]>([]);
  const [removeFileIds, setRemoveFileIds] = useState<number[]>([]);
  const [existingPdf, setExistingPdf] = useState<ExistingFile | null>(null);
  const [removePdf, setRemovePdf] = useState(false);
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null);

  // 1. 기존 프로젝트 데이터 로드
  useEffect(() => {
    const loadProjectData = async () => {
      if (!id) {
        alert("잘못된 프로젝트 ID입니다.");
        navigate("/projects");
        return;
      }

      try {
        setLoading(true);
        console.log("=== 프로젝트 데이터 로드 시작 ===");
        console.log("프로젝트 ID:", id);

        const project: BackendProjectResponse = await getProjectById(
          parseInt(id)
        );

        console.log("=== 로드된 프로젝트 전체 데이터 ===");
        console.log(JSON.stringify(project, null, 2));

        // 기술 스택 ID 추출 - BackendProjectResponse 타입 기준
        let techIds: number[] = [];

        console.log("=== 기술 스택 데이터 분석 ===");
        console.log("project.projectTechs:", project.projectTechs);

        if (project.projectTechs && Array.isArray(project.projectTechs)) {
          // BackendProjectResponse.projectTechs 구조 사용
          techIds = project.projectTechs.map((pt) => pt.techCode.id);
          console.log("추출된 기술 스택 ID들:", techIds);
        }

        console.log("추출된 기술 스택 ID들:", techIds);

        // 폼 데이터 설정
        const updatedFormData: ProjectUpdateFormData = {
          title: project.title || "",
          content: project.content || "",
          projectCategory: project.projectCategory || "",
          projectTechs: techIds,
          githubUrl: project.githubUrl || "",
          youtubeUrl: project.youtubeUrl || "",
          isPublic: project.isPublic ?? true,
          files: [], // 새로 추가할 파일들만
        };

        console.log("=== 설정될 폼 데이터 ===");
        console.log(JSON.stringify(updatedFormData, null, 2));

        setFormData(updatedFormData);

        // 기존 썸네일 설정
        if (project.thumbnailUrl) {
          console.log("기존 썸네일 URL:", project.thumbnailUrl);
          setExistingThumbnailUrl(project.thumbnailUrl);
        }

        // 기존 파일들 분리 (이미지 vs PDF)
        const images: ExistingFile[] = [];
        let pdfFile: ExistingFile | null = null;

        console.log("=== 파일 데이터 분석 ===");
        console.log("project.files:", project.files);

        if (project.files && Array.isArray(project.files)) {
          project.files.forEach((file, index) => {
            console.log(`파일 ${index}:`, file);

            const fileData: ExistingFile = {
              id: file.id,
              fileName: file.fileName,
              fileUrl: file.fileUrl,
              isPdf: file.isPdf || false,
            };

            console.log(`변환된 파일 데이터 ${index}:`, fileData);

            if (fileData.isPdf) {
              pdfFile = fileData;
            } else {
              images.push(fileData);
            }
          });
        }

        console.log("=== 최종 파일 분류 결과 ===");
        console.log("이미지 파일들:", images);
        console.log("PDF 파일:", pdfFile);

        setExistingFiles(images);
        setExistingPdf(pdfFile);

        console.log("=== 프로젝트 데이터 로드 완료 ===");
      } catch (error) {
        console.error("=== 프로젝트 로드 실패 ===", error);
        alert("프로젝트를 불러올 수 없습니다.");
        navigate("/projects");
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, [id, navigate]);

  // 2. 폼 입력 핸들러들
  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, title: value }));
  };

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleVideoUrlChange = (value: string) => {
    setFormData((prev) => ({ ...prev, youtubeUrl: value }));
  };

  const handleGithubUrlChange = (value: string) => {
    setFormData((prev) => ({ ...prev, githubUrl: value }));
  };

  const handleCategoryChange = (category: ProjectCategoryEnum) => {
    setFormData((prev) => ({ ...prev, projectCategory: category }));
  };

  const handleIsPublicChange = (isPublic: boolean) => {
    setFormData((prev) => ({ ...prev, isPublic }));
  };

  const handleStacksChange = (techId: number) => {
    setFormData((prev) => {
      const currentIds = prev.projectTechs;
      const isSelected = currentIds.includes(techId);

      let newIds;
      if (isSelected) {
        newIds = currentIds.filter((id) => id !== techId);
      } else {
        newIds = [...currentIds, techId];
      }

      console.log("기술 스택 변경:", {
        techId,
        isSelected,
        기존: currentIds,
        변경후: newIds,
      });

      return { ...prev, projectTechs: newIds };
    });
  };

  // 3. 파일 핸들러들
  const handleThumbnailUpload = (file: File) => {
    setThumbnailFile(file);
    setRemoveThumbnail(false);
  };

  const handleThumbnailRemove = () => {
    setThumbnailFile(null);
    if (existingThumbnailUrl) {
      setRemoveThumbnail(true);
      setExistingThumbnailUrl(null);
    }
  };

  const handleFileUpload = (newFiles: File[]) => {
    // 이미지 파일만 허용
    const imageFiles = newFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...imageFiles].slice(0, 10), // 최대 10개
    }));
  };

  const handleFileRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleExistingFileRemove = (fileId: number) => {
    setRemoveFileIds((prev) => [...prev, fileId]);
    setExistingFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handlePdfUpload = (file: File) => {
    if (file.type === "application/pdf") {
      setNewPdfFile(file);
      setRemovePdf(false);
    }
  };

  const handlePdfRemove = () => {
    setNewPdfFile(null);
    if (existingPdf) {
      setRemovePdf(true);
      setExistingPdf(null);
    }
  };

  // 4. 수정 제출
  const handleSubmit = async () => {
    if (!id) return;

    try {
      setSubmitting(true);

      // 유효성 검사
      if (!formData.title.trim()) {
        alert("프로젝트 제목을 입력해주세요.");
        return;
      }

      if (!formData.content.trim()) {
        alert("프로젝트 설명을 입력해주세요.");
        return;
      }

      if (!formData.projectCategory) {
        alert("프로젝트 카테고리를 선택해주세요.");
        return;
      }

      console.log("=== 수정 데이터 전송 ===");
      console.log("선택된 기술 스택 ID들:", formData.projectTechs);

      // 수정 데이터를 ProjectUpdateRequest 형태로 변환
      const projectInput: ProjectUpdateRequest = {
        title: formData.title,
        content: formData.content,
        projectCategory: formData.projectCategory as ProjectCategoryEnum,
        techCodeIds: formData.projectTechs,
        githubUrl: formData.githubUrl || "",
        youtubeUrl: formData.youtubeUrl || "",
        isPublic: formData.isPublic,

        // 파일들
        thumbnailFile: thumbnailFile || undefined,
        imageFiles: formData.files,
        pdfFile: newPdfFile || undefined,

        // 수정용 필드들
        removeThumbnail,
        removeFileIds,
        removePdf,
      };

      console.log("전송할 프로젝트 데이터:", projectInput);

      // API 호출
      await updateProject(parseInt(id), projectInput);

      alert("프로젝트가 성공적으로 수정되었습니다!");
      navigate(`/projects`);
    } catch (error) {
      console.error("프로젝트 수정 실패:", error);
      alert("프로젝트 수정 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">프로젝트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* 헤더 */}
        <section className="mb-6 sm:mb-8 lg:mb-12">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              프로젝트 수정
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              프로젝트의 정보를 수정하세요. 변경사항은 수정 완료 시 반영됩니다.
            </p>
          </div>
        </section>

        {/* 메인 콘텐츠 */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* 파일 업로드 섹션 */}
          <section>
            <ProjectFileUpload
              uploadedFiles={formData.files}
              onFileUpload={handleFileUpload}
              onFileRemove={handleFileRemove}
              thumbnailFile={thumbnailFile}
              onThumbnailUpload={handleThumbnailUpload}
              onThumbnailRemove={handleThumbnailRemove}
              maxFiles={10}
              maxFileSize={5 * 1024 * 1024}
              acceptedTypes={["image/png", "image/jpeg"]}
            />

            {/* PDF 업로드 섹션 (별도로 추가할 수 있다면) */}
            {!existingPdf && !newPdfFile && (
              <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  PDF 파일 업로드 (선택사항)
                </h3>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePdfUpload(file);
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            )}

            {/* 새로 업로드한 PDF 표시 */}
            {newPdfFile && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                      📄
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {newPdfFile.name}
                      </div>
                      <div className="text-xs text-gray-500">새 PDF 파일</div>
                    </div>
                  </div>
                  <button
                    onClick={handlePdfRemove}
                    className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                  >
                    제거
                  </button>
                </div>
              </div>
            )}

            {/* 기존 파일들 표시 */}
            {(existingFiles.length > 0 ||
              existingThumbnailUrl ||
              existingPdf) && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  기존 파일들
                </h3>

                {/* 기존 썸네일 */}
                {existingThumbnailUrl && !removeThumbnail && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between bg-purple-50 p-3 rounded border">
                      <div className="flex items-center space-x-3">
                        <img
                          src={existingThumbnailUrl}
                          alt="썸네일"
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <div className="text-sm font-medium">기존 썸네일</div>
                          <div className="text-xs text-gray-500">
                            현재 사용 중
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleThumbnailRemove}
                        className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                      >
                        제거
                      </button>
                    </div>
                  </div>
                )}

                {/* 기존 이미지들 */}
                {existingFiles.map((file) => (
                  <div key={file.id} className="mb-2">
                    <div className="flex items-center justify-between bg-white p-3 rounded border">
                      <div className="flex items-center space-x-3">
                        {file.fileUrl ? (
                          <img
                            src={file.fileUrl}
                            alt={file.fileName}
                            className="w-8 h-8 object-cover rounded"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            🖼️
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium">
                            {file.fileName}
                          </div>
                          <div className="text-xs text-gray-500">
                            기존 이미지
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleExistingFileRemove(file.id)}
                        className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                      >
                        제거
                      </button>
                    </div>
                  </div>
                ))}

                {/* 기존 PDF */}
                {existingPdf && !removePdf && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                          📄
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {existingPdf.fileName}
                          </div>
                          <div className="text-xs text-gray-500">기존 PDF</div>
                        </div>
                      </div>
                      <button
                        onClick={handlePdfRemove}
                        className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                      >
                        제거
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* 프로젝트 상세 정보 */}
          <section>
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <ProjectSVG />
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    프로젝트 상세 정보
                  </h2>
                  <p className="text-sm text-gray-600">
                    프로젝트의 기본 정보를 수정해주세요.
                  </p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <ProjectWriteInput
                  inputText="프로젝트 제목"
                  placeholderText="프로젝트 제목을 입력해주세요"
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                />
                <ProjectWriteText
                  inputText="프로젝트 설명"
                  value={formData.content}
                  onChange={handleContentChange}
                />
                <ProjectWriteInput
                  inputText="시연 영상 URL"
                  placeholderText="http://www.youtube.com/yourvideo"
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={handleVideoUrlChange}
                />
                <ProjectWriteInput
                  inputText="GitHub URL"
                  placeholderText="http://github.com/username/repository"
                  type="url"
                  value={formData.githubUrl}
                  onChange={handleGithubUrlChange}
                />
              </div>
            </div>
          </section>

          {/* 기술 스택 선택 */}
          <section>
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <StackSVG />
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    기술 스택 선택
                  </h2>
                  <p className="text-sm text-gray-600">
                    사용한 기술을 선택해주세요.
                  </p>
                  {/* 디버깅을 위한 정보 표시 */}
                  <p className="text-xs text-blue-600 mt-1">
                    현재 선택된 기술 스택:{" "}
                    {formData.projectTechs.join(", ") || "없음"}
                  </p>
                </div>
              </div>

              <ProjectStack
                isStackData={ProjectWriteTechData}
                isSelect={formData.projectTechs}
                onStackChange={handleStacksChange}
              />
            </div>
          </section>

          {/* 카테고리 선택 */}
          <section>
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
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
                isSelect={formData.projectCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </section>

          {/* 공개 설정 */}
          <section>
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
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
                isPublic={formData.isPublic}
                onIsPublicChange={handleIsPublicChange}
              />
            </div>
          </section>
        </div>

        {/* 제출 버튼 */}
        <section className="mt-6 sm:mt-8 lg:mt-12">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>

            {/* 제출 버튼 */}
            <ProjectWriteSubmitButton
              onSubmit={handleSubmit}
              isDisabled={!formData.title || !formData.content || submitting}
            />
          </div>
        </section>

        {/* 제출 중 로딩 오버레이 */}
        {submitting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>프로젝트를 수정하고 있습니다...</p>
              <p className="text-sm text-gray-500 mt-2">
                잠시만 기다려주세요...
              </p>
            </div>
          </div>
        )}

        <div className="h-20"></div>
      </div>
    </div>
  );
}

export default ProjectUpdatePage;
