export interface ButtonProps {
  text?: string; //  버튼 안의 text
  color?: string; //  버튼의 색상
  img?: string; //  버튼의 이미지
  onClick: () => void; //  버튼을 누르면 생기는 기능
}
