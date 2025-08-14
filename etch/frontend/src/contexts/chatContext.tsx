import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { chatService } from '../services/chatService';
import { chatApi } from '../api/chatApi.tsx';
import { getCurrentUserId, getCurrentUserName, getAccessToken } from '../utils/userUtils';
import type { ChatRoom, UIChatRoom, UIChatMessage, WebSocketChatMessage } from '../types/chat';

interface ChatContextType {
  // 상태
  rooms: UIChatRoom[];
  currentRoom: ChatRoom | null;
  messages: UIChatMessage[];
  isConnected: boolean;
  isLoading: boolean;
  
  // 액션
  loadRooms: () => Promise<void>;
  selectRoom: (roomId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  markOthersMessagesAsRead: (roomId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [rooms, setRooms] = useState<UIChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<UIChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // WebSocket 연결 초기화
  useEffect(() => {
    const initializeWebSocket = async () => {
      try {
        const token = getAccessToken();
        await chatService.connect(token || undefined);
        setIsConnected(true);
      } catch (error) {
        console.error('WebSocket 연결 실패:', error);
        setIsConnected(false);
      }
    };

    initializeWebSocket();

    // 컴포넌트 언마운트시 연결 해제
    return () => {
      chatService.disconnect();
      setIsConnected(false);
    };
  }, []);

  // 채팅방 목록 로드
  const loadRooms = async () => {
    try {
      setIsLoading(true);
      const apiRooms = await chatApi.getRooms();
      
      // API 응답을 UI 형태로 변환
      const uiRooms: UIChatRoom[] = apiRooms.map(room => ({
        id: room.roomId,
        name: room.name,
        lastMessage: '', // 최근 메시지는 별도로 관리 필요
        time: '',
        unreadCount: 0
      }));
      
      setRooms(uiRooms);
    } catch (error) {
      console.error('채팅방 목록 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 채팅방 선택
  const selectRoom = async (roomId: string) => {
    try {
      setIsLoading(true);
      
      // 이전 방에서 나가기
      if (currentRoom) {
        await chatApi.exitRoom(currentRoom.roomId);
        chatService.unsubscribeFromRoom(currentRoom.roomId);
      }

      // 새 방 정보 가져오기
      const roomInfo = await chatApi.getRoom(roomId);
      setCurrentRoom(roomInfo);

      // 방 입장
      await chatApi.enterRoom(roomId);

      // 이전 메시지 로드
      const apiMessages = await chatApi.getRoomMessages(roomId);
      const currentUserId = getCurrentUserId();
      
      const uiMessages: UIChatMessage[] = apiMessages.map(msg => ({
        id: msg.id?.toString() || Date.now().toString(),
        message: msg.message,
        sender: msg.senderId === currentUserId ? 'me' : 'other',
        time: new Date(msg.sentAt).toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        senderName: msg.senderId === currentUserId ? undefined : msg.senderNickname,
        unreadCount: msg.unreadCount
      }));
      
      setMessages(uiMessages);

      // WebSocket 구독
      chatService.subscribeToRoom(roomId, handleWebSocketMessage);

      // 다른 사용자의 메시지만 읽음 처리 (자신의 메시지는 제외)
      await markOthersMessagesAsRead(roomId);

    } catch (error) {
      console.error('채팅방 선택 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // WebSocket 메시지 처리
  const handleWebSocketMessage = (wsMessage: WebSocketChatMessage) => {
    if (wsMessage.type === 'TALK') {
      const currentUserId = getCurrentUserId();
      const newMessage: UIChatMessage = {
        id: wsMessage.messageId?.toString() || Date.now().toString(),
        message: wsMessage.message,
        sender: wsMessage.senderId === currentUserId ? 'me' : 'other',
        time: new Date().toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        senderName: wsMessage.senderId === currentUserId ? undefined : wsMessage.sender,
        unreadCount: wsMessage.unreadCount
      };

      setMessages(prev => [...prev, newMessage]);
    } else if (wsMessage.type === 'READ') {
      // 읽음 상태 업데이트 - 자신이 보낸 메시지의 읽음 수만 감소
      setMessages(prev => 
        prev.map(msg => {
          // 자신이 보낸 메시지이고, 읽음 처리된 메시지 ID 이하인 경우만 읽음 수 감소
          if (msg.sender === 'me' && parseInt(msg.id) <= (wsMessage.messageId || 0)) {
            return { ...msg, unreadCount: Math.max(0, (msg.unreadCount || 0) - 1) };
          }
          return msg;
        })
      );
    }
  };

  // 메시지 전송
  const sendMessage = async (message: string) => {
    if (!currentRoom || !message.trim()) return;

    try {
      const userId = getCurrentUserId();
      const userName = getCurrentUserName();
      
      chatService.sendMessage(currentRoom.roomId, userId, userName, message.trim());
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  };

  // 방 나가기
  const leaveRoom = async () => {
    if (!currentRoom) return;

    try {
      await chatApi.exitRoom(currentRoom.roomId);
      chatService.unsubscribeFromRoom(currentRoom.roomId);
      setCurrentRoom(null);
      setMessages([]);
    } catch (error) {
      console.error('방 나가기 실패:', error);
    }
  };

  // 다른 사용자의 메시지만 읽음 처리
  const markOthersMessagesAsRead = async (roomId: string) => {
    if (!roomId) return;

    try {
      const currentUserId = getCurrentUserId();
      
      // 다른 사용자가 보낸 메시지들 중 가장 최근 메시지 찾기
      const othersMessages = messages.filter(msg => parseInt(msg.id) && msg.sender === 'other');
      const lastOthersMessage = othersMessages[othersMessages.length - 1];
      
      if (lastOthersMessage) {
        // REST API로 읽음 처리
        await chatApi.markAsRead(roomId);

        // WebSocket으로도 읽음 상태 전송 (다른 사용자의 마지막 메시지 ID)
        const messageId = parseInt(lastOthersMessage.id);
        chatService.markAsRead(roomId, currentUserId, messageId);
      }
    } catch (error) {
      console.error('읽음 처리 실패:', error);
    }
  };

  const value: ChatContextType = {
    rooms,
    currentRoom,
    messages,
    isConnected,
    isLoading,
    loadRooms,
    selectRoom,
    sendMessage,
    leaveRoom,
    markOthersMessagesAsRead,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
