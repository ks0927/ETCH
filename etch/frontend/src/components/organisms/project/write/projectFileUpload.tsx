import ProjectButton from "../../../molecules/project/projectButton";
import UploadSVG from "../../../svg/uploadSVG";

function ProjectFileUpload() {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 cursor-pointer">
      <div className="flex flex-col items-center space-y-4">
        {/* SVG 아이콘 */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400">
          <UploadSVG />
        </div>

        {/* 메인 텍스트 */}
        <div className="text-base sm:text-lg font-medium text-gray-700">
          이미지나 파일을 드래그하여 업로드하세요
        </div>

        {/* 서브 텍스트 */}
        <div className="text-sm text-gray-500">
          또는 클릭해서 파일을 선택하세요
        </div>

        {/* 업로드 버튼 */}
        <div className="mt-4">
          <ProjectButton
            text="내 PC"
            bgColor="bg-black"
            textColor="text-white"
            css="cursor-pointer px-6 py-2 rounded-md font-medium text-sm hover:bg-gray-800 transition-colors duration-200"
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectFileUpload;
