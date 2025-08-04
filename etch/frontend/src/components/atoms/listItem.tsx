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
  sender: 'me' | 'other';
  time: string;
  senderName?: string;
}
