import type { StackButtonProps } from "../../atoms/button";

function ProjectStackButton({
  text,
  isSelected,
  onSelect,
  stack,
}: StackButtonProps) {
  return (
    <div className="group cursor-pointer" onClick={() => onSelect(stack)}>
      <div
        className={`border rounded-lg p-4 sm:p-6 text-center transition-all duration-200 group-hover:shadow-md ${
          isSelected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
        }`}
      >
        {/* 아이콘 영역 */}

        {/* 텍스트 영역 */}
        <div
          className={`text-sm sm:text-base font-medium transition-colors duration-200 ${
            isSelected
              ? "text-blue-700"
              : "text-gray-700 group-hover:text-blue-700"
          }`}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

export default ProjectStackButton;
