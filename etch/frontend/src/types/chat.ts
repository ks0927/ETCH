// 채팅방 관련 타입들
export interface ChatRoom {
  roomId: string;
  roomName: string;
}

export interface ChatMessage {
  id?: number;
  roomId: string;
  senderId: number;
  senderNickname: string;
  message: string;
  unreadCount?: number;
  sentAt: string;
}

// WebSocket 메시지 타입들
export type WebSocketMessageType = 'ENTER' | 'TALK' | 'READ';

export interface WebSocketChatMessage {
  type: WebSocketMessageType;
  roomId: string;
  senderId: number;
  sender: string;
  message: string;
  messageId?: number;
  unreadCount?: number;
}

export interface WebSocketReadMessage {
  roomId: string;
  memberId: number;
  messageId: number;
}

// UI용 채팅 메시지 타입 (기존 컴포넌트와 호환)
export interface UIChatMessage {
  id: string;
  message: string;
  sender: "me" | "other";
  time: string;
  senderName?: string;
  unreadCount?: number; // 읽지 않은 사용자 수
}

// UI용 채팅방 타입 (기존 컴포넌트와 호환)
export interface UIChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  profileImage?: string;
  unreadCount?: number;
}
