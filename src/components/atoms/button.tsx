interface ButtonProps {
  text?: string; //  버튼 안의 text
  color?: string; //  버튼의 색상
  img?: string; //  버튼의 이미지
  onClick: () => void; //  버튼을 누르면 생기는 기능
}

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
