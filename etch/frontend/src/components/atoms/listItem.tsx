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

// 지원현황 아이템 전용
export interface ApplicationItemProps extends BaseListItemProps {
  company: string;
  position: string;
  applyDate: string;
  status:
    | "scheduled"
    | "document_submitted"
    | "interview"
    | "passed"
    | "failed";
  statusText: string;
  stage: string;
  onStatusChange?: (id: string) => void;
}

// 마감일 아이템 전용
export interface DeadlineItemProps extends BaseListItemProps {
  company: string;
  position: string;
  dueDate: string;
  daysLeft: number;
  urgency: "urgent" | "warning";
}

// 사용자 아이템 전용
export interface UserItemProps extends BaseListItemProps {
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  isFollowing: boolean;
  canChat: boolean;
  onChatClick: (userId: string) => void;
  onFollowToggle: (userId: string) => void;
}
