import type { ButtonProps } from "../../atoms/button";

function ProjectSearchButton({ text, textColor, color, onClick }: ButtonProps) {
  return (
    <button
      className={`${color} ${textColor} px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity whitespace-nowrap`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default ProjectSearchButton;
