import type { ProjectStackEnum } from "../../types/project/projecStackData";
import type { ProjectCategoryEnum } from "../../types/project/projectCategroyData";

export interface ButtonProps {
  text?: string; //  버튼 안의 text
  bgColor?: string; //  버튼의 색상
  img?: string; //  버튼의 이미지
  icon?: React.ReactNode; // 버튼의 아이콘
  value?: string; // 버튼의 값
  onClick?: () => void; //  버튼을 누르면 생기는 기능
  textColor?: string; //  버튼의 텍스트 색상
  checked?: boolean; // 현재 버튼의 체크 유뮤
  css?: string; // 버튼의 css 형식
}

export interface AdditionalButtonProps extends ButtonProps {
  textColor?: string; //  버튼의 텍스트 색상
}

export interface fileUploadButtonProps extends ButtonProps {
  onFileSelect: (file: File) => void; // 파일 선택 시 호출되는 함수
  accept?: string; // 허용되는 파일 형식
}

export interface NavButtonProps extends ButtonProps {
  to: string;
  isActive?: boolean;
}

export interface StatsButtonProps extends ButtonProps {
  count: number;
  label: string;
}

export interface CategoryButtonProps extends ButtonProps {
  category: ProjectCategoryEnum; // 어떤 카테고리인지
  isSelected: boolean; // 선택 여부
  onSelect: (category: ProjectCategoryEnum) => void; // 클릭 시 실행
}

export interface StackButtonProps extends ButtonProps {
  stack: ProjectStackEnum; // 어떤 카테고리인지
  isSelected: boolean; // 선택 여부
  onSelect: (stack: ProjectStackEnum) => void; // 클릭 시 실행
}
