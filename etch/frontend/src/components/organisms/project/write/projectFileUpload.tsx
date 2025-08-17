import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";
import ProjectButton from "../../../molecules/project/projectButton";
import UploadSVG from "../../../svg/uploadSVG";
import type {
  FileValidationResult,
  ProjectFileUploadProps,
} from "../../../../types/project/projectFileUploadProps";
import FileUploadSVG from "../../../svg/fileUploadSVG";
import GuideSVG from "../../../svg/guildSVG";

function ProjectFileUpload({
  uploadedFiles, // 부모로부터 받는 파일 목록
  onFileUpload,
  onFileRemove,
  thumbnailFile, // 썸네일 파일
  onThumbnailUpload, // 썸네일 업로드 핸들러
  onThumbnailRemove, // 썸네일 제거 핸들러
  maxFiles, // 부모에서 정의한 값 사용 (기본값 제거)
  maxFileSize, // 부모에서 정의한 값 사용 (기본값 제거)
  acceptedTypes, // 부모에서 정의한 값 사용 (기본값 제거)
  disabled = false, // 이것만 기본값 유지 (선택적 prop)
}: ProjectFileUploadProps) {
  // ProjectFileUpload 컴포넌트 내부에 로그 추가

  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // 썸네일 파일 유효성 검사
  const validateThumbnailFile = (
    file: File
  ): { isValid: boolean; error?: string } => {
    // 이미지 파일인지 확인
    if (!file.type.startsWith("image/")) {
      return { isValid: false, error: "이미지 파일만 업로드할 수 있습니다." };
    }

    // 파일 크기 검사
    if (file.size > maxFileSize) {
      return {
        isValid: false,
        error: `파일 크기가 너무 큽니다. (최대 ${(
          maxFileSize /
          1024 /
          1024
        ).toFixed(1)}MB)`,
      };
    }

    return { isValid: true };
  };

  // 썸네일 드래그 앤 드롭 처리
  const handleThumbnailDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (!disabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const validation = validateThumbnailFile(file);

      if (validation.isValid) {
        onThumbnailUpload(file);
      } else {
        alert(validation.error);
      }
    }
  };

  // 썸네일 클릭 업로드
  const handleThumbnailClick = (): void => {
    if (!disabled) {
      thumbnailInputRef.current?.click();
    }
  };

  const handleThumbnailInput = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validation = validateThumbnailFile(file);

      if (validation.isValid) {
        onThumbnailUpload(file);
      } else {
        alert(validation.error);
      }

      // input 값 초기화
      e.target.value = "";
    }
  };

  // 썸네일 제거
  const removeThumbnail = (): void => {
    onThumbnailRemove();
  };
  // 파일 유효성 검사 (부모로부터 받은 설정값 사용)
  const validateFiles = (files: FileList | File[]): FileValidationResult => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach((file) => {
      // 파일 타입 검사 (부모 설정 사용)
      if (!acceptedTypes.includes(file.type)) {
        invalidFiles.push(file);
        errors.push(`${file.name}: 지원되지 않는 파일 형식입니다.`);
        return;
      }

      // 파일 크기 검사 (부모 설정 사용)
      if (file.size > maxFileSize) {
        invalidFiles.push(file);
        errors.push(
          `${file.name}: 파일 크기가 너무 큽니다. (최대 ${(
            maxFileSize /
            1024 /
            1024
          ).toFixed(1)}MB)`
        );
        return;
      }

      // 최대 파일 개수 검사 (부모 설정 사용)
      if (uploadedFiles.length + validFiles.length >= maxFiles) {
        invalidFiles.push(file);
        errors.push(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
        return;
      }

      validFiles.push(file);
    });

    return { validFiles, invalidFiles, errors };
  };

  // 파일 처리 함수 (부모에게 검증된 파일만 전달)
  const handleFiles = (files: FileList): void => {
    if (disabled) return;

    const validation = validateFiles(files);

    // 검증된 파일이 있다면 부모 컴포넌트에 전달
    if (validation.validFiles.length > 0) {
      onFileUpload(validation.validFiles);
    }

    // 에러가 있다면 알림 표시
    if (validation.errors.length > 0) {
      alert(validation.errors.join("\n"));
    }
  };

  // 드래그 앤 드롭 이벤트
  const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (!disabled && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // 클릭으로 파일 선택
  const handleClick = (): void => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      handleFiles(e.target.files);
      // input 값 초기화 (같은 파일을 다시 선택할 수 있도록)
      e.target.value = "";
    }
  };

  // 파일 제거 (부모에게 위임)
  const removeFile = (index: number): void => {
    onFileRemove(index);
  };

  // 파일 크기 포맷팅 함수
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // 파일 타입에 따른 아이콘 반환
  const getFileIcon = (fileType: string): string => {
    if (fileType.startsWith("image/")) return "🖼️";
    return "📄";
  };

  // 허용된 파일 형식 표시 문자열 생성 (부모 설정 사용)
  const getAcceptedTypesDisplay = (): string => {
    const typeMap: Record<string, string> = {
      "image/jpeg": "JPG",
      "image/png": "PNG",
      "image/gif": "GIF",
    };

    const displayTypes = acceptedTypes
      .map((type) => typeMap[type] || type)
      .join(", ");
    return `${displayTypes} (최대 ${(maxFileSize / 1024 / 1024).toFixed(1)}MB)`;
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* 썸네일 업로드 섹션 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-purple-600 text-xl">🖼️</span>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              썸네일 이미지
            </h2>
            <p className="text-sm text-gray-600">
              프로젝트를 대표할 썸네일 이미지를 업로드해주세요.
            </p>
          </div>
        </div>
        <div
          className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all duration-200 ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          } ${
            isDragOver
              ? "border-purple-400 bg-purple-50"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleThumbnailDrop}
          onClick={handleThumbnailClick}
        >
          <div className="flex flex-col items-center space-y-3">
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 ${
                isDragOver
                  ? "text-purple-500"
                  : disabled
                  ? "text-gray-300"
                  : "text-gray-400"
              }`}
            >
              <UploadSVG />
            </div>

            <div
              className={`text-sm sm:text-base font-medium ${
                disabled ? "text-gray-400" : "text-gray-700"
              }`}
            >
              {disabled
                ? "썸네일 업로드가 비활성화되어 있습니다"
                : "썸네일 이미지를 드래그하여 업로드하세요"}
            </div>

            {!disabled && (
              <>
                <div className="text-xs text-gray-500">
                  또는 클릭해서 이미지를 선택하세요
                </div>
                <div className="text-xs text-gray-400">
                  JPG, PNG, GIF, WebP (최대{" "}
                  {(maxFileSize / 1024 / 1024).toFixed(1)}MB)
                </div>

                <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                  <ProjectButton
                    text="썸네일 선택"
                    bgColor="bg-purple-600"
                    textColor="text-white"
                    css="cursor-pointer px-4 py-2 rounded-md font-medium text-xs hover:bg-purple-700 transition-colors duration-200"
                    onClick={handleThumbnailClick}
                  />
                </div>
              </>
            )}
          </div>

          {/* 썸네일 전용 파일 인풋 */}
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleThumbnailInput}
            disabled={disabled}
          />
        </div>

        {/* 업로드된 썸네일 표시 */}
        {thumbnailFile && (
          <div className="mt-4">
            <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600">🖼️</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="text-sm font-medium text-gray-900 truncate"
                      title={thumbnailFile.name}
                    >
                      {thumbnailFile.name}
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      썸네일
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(thumbnailFile.size)} • {thumbnailFile.type}
                  </div>
                </div>
              </div>
              <button
                onClick={removeThumbnail}
                className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors flex-shrink-0"
                title="썸네일 제거"
              >
                제거
              </button>
            </div>
          </div>
        )}
      </section>

      <section>
        <div className="mb-6"></div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileUploadSVG />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              파일 업로드
            </h2>
            <p className="text-sm text-gray-600">
              프로젝트 이미지나 영상을 업로드해주세요.
            </p>
          </div>
        </div>

        {/* 파일 업로드 안내 (썸네일 관련 내용 제거) */}
        {uploadedFiles.length === 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">💡</span>
              <p className="text-sm text-blue-800 font-medium">
                프로젝트와 관련된 파일들을 업로드해주세요.
              </p>
            </div>
          </div>
        )}

        <div
          className={`border-2 border-dashed rounded-lg p-8 sm:p-12 text-center transition-all duration-200 ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          } ${
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center space-y-4">
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 ${
                isDragOver
                  ? "text-blue-500"
                  : disabled
                  ? "text-gray-300"
                  : "text-gray-400"
              }`}
            >
              <UploadSVG />
            </div>

            {/* 메인 텍스트 */}
            <div
              className={`text-base sm:text-lg font-medium ${
                disabled ? "text-gray-400" : "text-gray-700"
              }`}
            >
              {disabled
                ? "파일 업로드가 비활성화되어 있습니다"
                : "이미지나 파일을 드래그하여 업로드하세요"}
            </div>

            {!disabled && (
              <>
                {/* 서브 텍스트 */}
                <div className="text-sm text-gray-500">
                  또는 클릭해서 파일을 선택하세요
                </div>
                {/* 서브 텍스트 */}
                <div className="text-sm text-gray-400">
                  프로젝트 관련 파일들을 업로드해주세요
                </div>

                {/* 지원 파일 형식 안내 (부모 설정 기반) */}
                <div className="text-xs text-gray-400">
                  {getAcceptedTypesDisplay()}
                </div>

                {/* 파일 개수 제한 안내 (부모 설정 기반) */}
                <div className="text-xs text-gray-400">
                  최대 {maxFiles}개 파일 ({uploadedFiles.length}/{maxFiles})
                </div>

                {/* 업로드 버튼 */}
                <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                  <ProjectButton
                    text="내 PC"
                    bgColor="bg-black"
                    textColor="text-white"
                    css="cursor-pointer px-6 py-2 rounded-md font-medium text-sm hover:bg-gray-800 transition-colors duration-200"
                    onClick={handleClick}
                  />
                </div>
              </>
            )}
          </div>

          {/* 숨겨진 파일 인풋 (부모 설정 사용) */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            className="hidden"
            onChange={handleFileInput}
            disabled={disabled}
          />
        </div>
      </section>

      <section>
        {/* 업로드된 파일 목록 */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
                업로드된 파일: {uploadedFiles.length}개
              </h4>
              <div className="text-xs text-gray-500">
                총 크기:{" "}
                {formatFileSize(
                  uploadedFiles.reduce((sum, file) => sum + file.size, 0)
                )}
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between bg-white p-3 rounded-lg border"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-sm font-medium text-gray-900 truncate"
                        title={file.name}
                      >
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {file.type}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors flex-shrink-0"
                    title="파일 제거"
                  >
                    제거
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <GuideSVG />
            업로드 가이드
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="text-sm text-gray-700 flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <span className="font-medium">썸네일 이미지:</span> 첫 번째
                이미지가 프로젝트 대표 이미지로 사용됩니다
              </div>
            </div>
            <div className="text-sm text-gray-700 flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <span className="font-medium">README.md파일:</span> 프로젝트
                설명, 설치 방법 포함
              </div>
            </div>
            <div className="text-sm text-gray-700 flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <span className="font-medium">시연 영상:</span> 주요 기능을
                보여주는 영상
              </div>
            </div>
            <div className="text-sm text-gray-700 flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <div>
                <span className="font-medium">스크린샷:</span> UI/UX를 보여주는
                이미지들
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProjectFileUpload;
