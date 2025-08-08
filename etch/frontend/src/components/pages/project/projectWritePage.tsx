import { ProjectWriteCategoryData } from "../../../types/projectWriteCategroyData";
import { PublicSettingData } from "../../../types/publicSettingData";
import ProjectFileUpload from "../../organisms/project/write/projectFileUpload";
import ProjectSetting from "../../organisms/project/write/projectSetting";
import ProjectCategory from "../../organisms/project/write/projectWriteCategory";
import ProjectWriteInput from "../../organisms/project/write/projectWriteInput";
import ProjectWriteSubmitButton from "../../organisms/project/write/projectWriteSubmitButton";

function ProjectWritePage() {
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
          {/* 파일 업로드 섹션 */}
          <section>
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
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

              <div className="mb-6">
                <ProjectFileUpload />
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  업로드 가이드
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="text-sm text-gray-700 flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <span className="font-medium">README.md파일:</span>{" "}
                      프로젝트 설명, 설치 방법 포함
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <span className="font-medium">시연 영상:</span> 주요
                      기능을 보여주는 영상
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <span className="font-medium">스크린샷:</span> UI/UX를
                      보여주는 이미지들
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <span className="font-medium">기타 문서:</span> 설계/API
                      문서 등
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 프로젝트 상세 정보 섹션 */}
          <section>
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
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
                />
                <ProjectWriteInput
                  inputText="프로젝트 설명"
                  placeholderText="프로젝트 설명을 입력해주세요"
                />

                {/* 모바일에서는 세로 배치, 데스크톱에서는 가로 배치 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <ProjectWriteInput
                    inputText="기술 스택"
                    placeholderText="React, SpringBoot (쉼표로 구분)"
                  />
                  <ProjectWriteInput
                    inputText="GitHub URL"
                    placeholderText="github.com/username/repository"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 카테고리 선택 섹션 */}
          <section>
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
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
                <ProjectCategory categoryData={ProjectWriteCategoryData} />
              </div>
            </div>
          </section>

          {/* 공개 설정 섹션 - 사이드바에서 메인으로 이동 */}
          <section>
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
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
                <ProjectSetting settingData={PublicSettingData} />
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  공개 설정 안내
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">공개</p>
                      <p className="text-xs text-gray-600">
                        모든 사용자가 볼 수 있으며 검색됩니다
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        비공개
                      </p>
                      <p className="text-xs text-gray-600">
                        본인만 볼 수 있습니다
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 도움말 카드 - 사이드바에서 메인으로 이동 */}
        </div>

        {/* 제출 버튼 섹션 - 모바일에서는 고정, 데스크톱에서는 일반 */}
        <section className="mt-6 sm:mt-8 lg:mt-12">
          <div className="flex justify-center">
            {/* 모바일 고정 버튼 */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
              <ProjectWriteSubmitButton />
            </div>

            {/* 데스크톱 일반 버튼 */}
            <div className="hidden sm:block w-full max-w-md">
              <ProjectWriteSubmitButton />
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
