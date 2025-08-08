import ProjectButton from "../../../molecules/project/projectButton";

function ProjectWriteSubmitButton() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto">
      <ProjectButton
        text="취소"
        bgColor="bg-gray-200"
        textColor="text-gray-700"
        css="px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200 whitespace-nowrap min-w-[120px] order-2 sm:order-1"
      />
      <ProjectButton
        text="프로젝트 등록"
        bgColor="bg-blue-500"
        textColor="text-white"
        css="px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 whitespace-nowrap min-w-[140px] order-1 sm:order-2"
      />
    </div>
  );
}

export default ProjectWriteSubmitButton;
