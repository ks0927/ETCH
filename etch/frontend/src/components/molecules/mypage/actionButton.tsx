import type { ButtonProps } from "../../atoms/button";

const ActionButton = ({ text, onClick, bgColor, textColor }: ButtonProps) => {
  return (
    <button
      className={`w-full px-4 py-2 rounded-md text-sm ${
        bgColor || "bg-gray-100"
      } ${textColor || "text-black"} hover:opacity-80 cursor-pointer`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default ActionButton;
