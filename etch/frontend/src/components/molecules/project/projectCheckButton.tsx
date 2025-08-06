import type { ButtonProps } from "../../atoms/button";

function ProjectCheckButton({ text, icon }: ButtonProps) {
  return (
    <div className="group cursor-pointer">
      <div className="border border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group-hover:shadow-md">
        {/* 아이콘 영역 */}
        <div className="flex justify-center mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600 group-hover:text-blue-600 transition-colors duration-200 flex items-center justify-center">
            {icon}
          </div>
        </div>

        {/* 텍스트 영역 */}
        <div className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-200">
          {text}
        </div>
      </div>
    </div>
  );
}

export default ProjectCheckButton;
