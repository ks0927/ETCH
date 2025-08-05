import type { ButtonProps } from "../../atoms/button";

export default function JobFilterButton({ onClick }: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
    >
      필터
    </button>
  );
}