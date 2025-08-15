import type { ButtonProps } from "../../atoms/button";

function HeaderButton({ text, bgColor: color, img, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer rounded-full flex items-center justify-center text-xs sm:text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {img && (
        <img src={img} alt="검색" className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
      )}
      {text && <span className="hidden sm:inline ml-1">{text}</span>}
    </button>
  );
}

export default HeaderButton;
