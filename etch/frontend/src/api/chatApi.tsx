import axios from 'axios';
import type { ChatRoom, ChatMessage } from '../types/chat';

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

  // 1:1 채팅방 생성 (상대방 userId로)
  createOneOnOneRoom: async (targetUserId: number): Promise<ChatRoom> => {
    // 방법 1: 1:1 전용 엔드포인트 시도
    try {
      const response = await chatInstance.post(`/room/user/${targetUserId}`);
      return response.data;
    } catch (error) {
      console.log('1:1 전용 엔드포인트 실패, POST body 방식 시도');
      // 방법 2: POST body에 데이터 전송 시도
      try {
        const response = await chatInstance.post('/room', {
          name: '1:1 채팅',
          targetUserId: targetUserId
        });
        return response.data;
      } catch (error2) {
        console.log('POST body 방식 실패, Query 파라미터 방식 시도');
        // 방법 3: Query 파라미터로 시도 (원래 방식)
        const response = await chatInstance.post(`/room?name=${encodeURIComponent('1:1 채팅')}&targetUserId=${targetUserId}`);
        return response.data;
      }
    }
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
