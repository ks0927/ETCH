import { ProjectWriteCategoryData } from "../../../types/projectWriteCategroyData";
import { PublicSettingData } from "../../../types/publicSettingData";
import ProjectFileUpload from "../../organisms/project/write/projectFileUpload";
import ProjectSetting from "../../organisms/project/write/projectSetting";
import ProjectCategory from "../../organisms/project/write/projectWriteCategory";
import ProjectWriteInput from "../../organisms/project/write/projectWriteInput";
import ProjectWriteSubmitButton from "../../organisms/project/write/projectWriteSubmitButton";

function ProjectWritePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 메인 헤더 섹션 */}
      <section className="mb-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            새 프로젝트 만들기
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            당신의 창의적인 작품을 전 세계와 공유하세요. 프로젝트의 모든
            세부사항을 입력하고 최고의 작품을 업로드하세요.
          </p>
        </div>
      </section>

      {/* 파일 업로드 섹션 */}
      <section className="mb-12">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            파일 업로드
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            프로젝트 이미지나 영상을 업로드해주세요.
          </p>

          <div className="mb-6">
            <ProjectFileUpload />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              업로드 가이드
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-700 flex items-start">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                README.md파일: 프로젝트 설명, 설치 방법, 사용법 등을
                포함해주세요
              </li>
              <li className="text-sm text-gray-700 flex items-start">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                시연 영상: 프로젝트 주요 기능을 보여주는 영상을 업로드 해주세요
              </li>
              <li className="text-sm text-gray-700 flex items-start">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                스크린샷: 프로젝트의 UI/UX를 보여주는 이미지들을 포함해주세요
              </li>
              <li className="text-sm text-gray-700 flex items-start">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                기타 문서: 설계 문서, API 문서 등 추가 자료를 업로드 할
                수있습니다.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 프로젝트 상세 정보 섹션 */}
      <section className="mb-12">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            프로젝트 상세 정보
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            프로젝트의 기본 정보를 입력해주세요.
          </p>

          <div className="space-y-6">
            <ProjectWriteInput
              inputText="프로젝트 제목"
              placeholderText="프로젝트 제목을 입력해주세요"
            />
            <ProjectWriteInput
              inputText="프로젝트 설명"
              placeholderText="프로젝트 설명을 입력해주세요"
            />
            <ProjectWriteInput
              inputText="기술 스택"
              placeholderText="예: React, SpringBoot, OracleDB (쉼표로 구분)"
            />
            <ProjectWriteInput
              inputText="GitHub URL"
              placeholderText="http://github.com/username/repository"
            />
          </div>
        </div>
      </section>

      {/* 카테고리 선택 섹션 */}
      <section className="mb-12">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            카테고리 선택
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            프로젝트에 해당하는 카테고리를 선택해주세요. (복수 선택 가능)
          </p>

          <div>
            <ProjectCategory categoryData={ProjectWriteCategoryData} />
          </div>
        </div>
      </section>

      {/* 공개 설정 섹션 */}
      <section className="mb-12">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            프로젝트 공개 설정
          </h2>

          <div className="mb-6">
            <ProjectSetting settingData={PublicSettingData} />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              공개 설정 안내
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                <span className="font-medium">공개:</span> 모든 사용자가
                프로젝트를 볼 수 있으며, 검색 결과에 표시됩니다.
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">비공개:</span> 본인만 프로젝트를
                볼 수 있으며, 다른 사용자에게는 표시되지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 제출 버튼 섹션 */}
      <section>
        <div className="flex justify-center">
          <ProjectWriteSubmitButton />
        </div>
      </section>
    </div>
  );
}

export default ProjectWritePage;
