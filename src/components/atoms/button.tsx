import type { ButtonProps } from "../../types/button";

export default function Button({ text, color, img, onClick }: ButtonProps) {
  return (
    <button
      style={{ backgroundColor: color }}
      onClick={onClick}
      className="w-10 h-10 cursor-pointer"
    >
      {img && <img src={img} alt="검색" />}
      {text}
    </button>
  );
}
