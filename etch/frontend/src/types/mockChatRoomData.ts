import type { ChatRoomItemProps } from "../components/atoms/listItem";

export const mockChatRooms: ChatRoomItemProps[] = [
  {
    id: "1",
    name: "관리자1",
    lastMessage: "네 안녕하세요. 반갑습니다",
    time: "14:30",
    unreadCount: 1,
  },
  {
    id: "2",
    name: "팀장님",
    lastMessage: "내일 회의 준비 잘 부탁드립니다.",
    time: "13:45",
  },
  {
    id: "3",
    name: "동료A",
    lastMessage: "프로젝트 진행상황 공유드립니다",
    time: "12:20",
    unreadCount: 2,
  },
  {
    id: "4",
    name: "인사팀",
    lastMessage: "교육 일정 안내드립니다",
    time: "11:15",
  },
  {
    id: "5",
    name: "개발팀",
    lastMessage: "시스템 점검 예정입니다",
    time: "10:30",
  },
  {
    id: "6",
    name: "마케팅팀",
    lastMessage: "새로운 캠페인 기획안 검토 부탁드립니다",
    time: "10:15",
    unreadCount: 3,
  },
  {
    id: "7",
    name: "디자인팀",
    lastMessage: "UI/UX 개선안 공유드립니다",
    time: "09:50",
  },
  {
    id: "8",
    name: "영업팀",
    lastMessage: "고객사 미팅 일정을 조율해주세요",
    time: "09:30",
    unreadCount: 1,
  },
  {
    id: "9",
    name: "기획팀",
    lastMessage: "요구사항 분석서 업데이트 완료했습니다",
    time: "09:15",
  },
  {
    id: "10",
    name: "QA팀",
    lastMessage: "테스트 결과 보고서를 전달드립니다",
    time: "08:45",
    unreadCount: 2,
  },
  {
    id: "11",
    name: "총무팀",
    lastMessage: "사무용품 신청 안내드립니다",
    time: "08:30",
  },
  {
    id: "12",
    name: "회계팀",
    lastMessage: "예산 관련 문의사항이 있습니다",
    time: "08:00",
  },
  {
    id: "13",
    name: "법무팀",
    lastMessage: "계약서 검토 완료했습니다",
    time: "어제",
    unreadCount: 1,
  },
  {
    id: "14",
    name: "경영지원팀",
    lastMessage: "월간 보고서 제출 일정 안내",
    time: "어제",
  },
  {
    id: "15",
    name: "고객지원팀",
    lastMessage: "고객 문의 대응 매뉴얼 업데이트",
    time: "어제",
  }
];
