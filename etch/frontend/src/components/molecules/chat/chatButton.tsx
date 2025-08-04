import type { ButtonProps } from "../../atoms/button";
import chatIcon from "../../../assets/chat.svg";

export default function ChatButton({ onClick }: ButtonProps) {
  return (
    <button
      className="fixed bottom-6 right-6 z-50 cursor-pointer hover:scale-110 transition-transform duration-200"
      onClick={onClick}
    >
      <img src={chatIcon} alt="Chat" className="w-20 h-20" />
    </button>
  );
}
