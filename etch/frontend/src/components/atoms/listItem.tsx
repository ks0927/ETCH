// 리스트 아이템 기본 인터페이스
export interface BaseListItemProps {
  id: string;
  onClick?: (id: string) => void;
}

// 채팅 아이템 전용
export interface ChatRoomItemProps extends BaseListItemProps {
  name: string;
  lastMessage: string;
  time: string;
  profileImage?: string;
  unreadCount?: number;
}

// 채팅 메시지 아이템 전용
export interface ChatMessageItemProps extends BaseListItemProps {
  message: string;
  sender: "me" | "other";
  time: string;
  senderName?: string;
}

// 채용정보 아이템 전용
export interface JobItemProps extends BaseListItemProps {
  company: string;
  location: string;
  deadline: string;
  tags: string[];
}

// 마이페이지 대시보드 문서 아이템 전용
export interface DocumentItemProps extends BaseListItemProps {
  title: string;
  date: string;
}
