import type { AdditionalButtonProps } from "../../atoms/button";

function HeaderAuthButton({
  text,
  bgColor: color,
  textColor,
  onClick,
}: AdditionalButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: color }}
      className={`flex items-center justify-center px-4 py-2 text-sm font-semibold transition-all duration-200 rounded cursor-pointer hover:brightness-90 border border-gray-300`}
    >
      {text && <span style={{ color: textColor }}>{text}</span>}
    </button>
  );
}

export default HeaderAuthButton;
