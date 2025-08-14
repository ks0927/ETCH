import { authInstance } from './instances';
import type { ChatRoom, ChatMessage } from '../types/chat';

// 채팅방 관리 API - 운영 환경
export const chatApi = {
  // 모든 채팅방 목록 조회
  getRooms: async (): Promise<ChatRoom[]> => {
    const response = await authInstance.get('/api/chat/rooms');
    return response.data;
  },

  // 특정 채팅방 정보 조회
  getRoom: async (roomId: string): Promise<ChatRoom> => {
    const response = await authInstance.get(`/api/chat/room/${roomId}`);
    return response.data;
  },

  // 채팅방 메시지 내역 조회
  getRoomMessages: async (roomId: string): Promise<ChatMessage[]> => {
    const response = await authInstance.get(`/api/chat/room/${roomId}/messages`);
    return response.data;
  },

  // 채팅방 입장
  enterRoom: async (roomId: string): Promise<void> => {
    await authInstance.post(`/api/chat/room/${roomId}/enter`);
  },

  // 채팅방 퇴장
  exitRoom: async (roomId: string): Promise<void> => {
    await authInstance.post(`/api/chat/room/${roomId}/exit`);
  },

  // 메시지 읽음 처리
  markAsRead: async (roomId: string): Promise<void> => {
    await authInstance.post(`/api/chat/room/${roomId}/read`);
  },

  // 안 읽은 메시지 수 조회
  getUnreadCounts: async () => {
    const response = await authInstance.get('/api/chat/rooms/unread-counts');
    return response.data;
  }
};
