import axios from 'axios';
import type { ChatRoom, ChatMessage, DirectChatRequest } from '../types/chat';

// 채팅 전용 axios 인스턴스 (별도의 base URL 사용)
const chatInstance = axios.create({
  baseURL: 'https://etch.it.kr/api/chat',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 채팅 인스턴스에 요청 인터셉터 추가 (토큰 자동 추가)
chatInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 채팅방 관리 API - 운영 환경
export const chatApi = {
  // 모든 채팅방 목록 조회
  getRooms: async (): Promise<ChatRoom[]> => {
    const response = await chatInstance.get('/rooms');
    return response.data;
  },

  // 1:1 채팅방 생성 (새로운 API 명세에 따라)
  createDirectChat: async (request: DirectChatRequest): Promise<ChatRoom> => {
    const response = await chatInstance.post('/direct', request);
    return response.data;
  },

  // 특정 채팅방 정보 조회
  getRoom: async (roomId: string): Promise<ChatRoom> => {
    const response = await chatInstance.get(`/room/${roomId}`);
    return response.data;
  },

  // 채팅방 메시지 내역 조회
  getRoomMessages: async (roomId: string): Promise<ChatMessage[]> => {
    const response = await chatInstance.get(`/room/${roomId}/messages`);
    return response.data;
  },

  // 채팅방 입장
  enterRoom: async (roomId: string): Promise<void> => {
    await chatInstance.post(`/room/${roomId}/enter`);
  },

  // 채팅방 퇴장
  exitRoom: async (roomId: string): Promise<void> => {
    await chatInstance.post(`/room/${roomId}/exit`);
  },

  // 메시지 읽음 처리
  markAsRead: async (roomId: string): Promise<void> => {
    await chatInstance.post(`/room/${roomId}/read`);
  },

  // 안 읽은 메시지 수 조회
  getUnreadCounts: async () => {
    const response = await chatInstance.get('/rooms/unread-counts');
    return response.data;
  }
};
