import type { ButtonProps } from "../../atoms/button";

function HeaderButton({ text, bgColor: color, img, onClick }: ButtonProps) {
  return (
    <button
      style={{ backgroundColor: color }}
      onClick={onClick}
      className="w-8 h-8 sm:w-10 sm:h-10 cursor-pointer rounded flex items-center justify-center text-xs sm:text-sm font-medium text-white hover:opacity-80 transition-opacity"
    >
      {img && (
        <img src={img} alt="버튼 아이콘" className="w-4 h-4 sm:w-5 sm:h-5" />
      )}
      {text && <span className="hidden sm:inline ml-1">{text}</span>}
    </button>
  );
}

export default HeaderButton;
