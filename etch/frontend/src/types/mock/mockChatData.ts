import type { ChatMessageItemProps } from "../../components/atoms/listItem";

export const mockChatMessages: ChatMessageItemProps[] = [
  {
    id: "1",
    message: "안녕하세요! 문의드릴 것이 있어서 연락드렸습니다.",
    sender: "me",
    time: "14:25",
  },
  {
    id: "2",
    message: "네, 안녕하세요. 무엇을 도와드릴까요?",
    sender: "other",
    time: "14:26",
    senderName: "관리자1",
  },
  {
    id: "3",
    message: "해당 프로젝트 관련해서 질문이 있습니다.",
    sender: "me",
    time: "14:27",
  },
  {
    id: "4",
    message: "네, 어떤 질문이신지 말씀해 주세요.",
    sender: "other",
    time: "14:28",
    senderName: "관리자1",
  },
  {
    id: "5",
    message: "제출 기한이 언제까지인가요?",
    sender: "me",
    time: "14:29",
  },
  {
    id: "6",
    message:
      "다음 주 금요일까지입니다. 추가로 궁금한 점이 있으시면 언제든 말씀해 주세요.",
    sender: "other",
    time: "14:30",
    senderName: "관리자1",
  },
];
