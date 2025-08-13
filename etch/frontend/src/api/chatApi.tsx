import { defaultInstance } from './instances';
import type { ChatRoom, ChatMessage } from '../types/chat';

// 채팅 서버 URL - 로컬 환경에서는 8083 포트 사용
const CHAT_SERVER_URL = import.meta.env.DEV
  ? "http://localhost:8083"
  : "https://etch.it.kr/chat";

// 채팅 전용 axios 인스턴스 생성
import axios from 'axios';

const chatInstance = axios.create({
  baseURL: CHAT_SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 토큰 추가
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

// 응답 인터셉터 - 401 에러 처리
chatInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 토큰 갱신 시도
        const reissueResponse = await defaultInstance.post("/auth/reissue", {});
        const newAccessToken = reissueResponse.headers["authorization"];
        
        if (newAccessToken) {
          localStorage.setItem("access_token", newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return chatInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("채팅 API 토큰 갱신 실패:", refreshError);
        // 토큰 갱신 실패시 로그인 페이지로 리다이렉트는 instances.ts에서 처리됨
      }
    }
    
    return Promise.reject(error);
  }
);

// 채팅방 관리 API
export const chatApi = {
  // 모든 채팅방 목록 조회
  getRooms: async (): Promise<ChatRoom[]> => {
    const response = await chatInstance.get('/chat/rooms');
    return response.data;
  },

  // 1:1 채팅방 생성 (상대방 userId로)
  createOneOnOneRoom: async (targetUserId: number): Promise<ChatRoom> => {
    const response = await chatInstance.post(`/chat/room/user/${targetUserId}`);
    return response.data;
  },



  // 특정 채팅방 정보 조회
  getRoom: async (roomId: string): Promise<ChatRoom> => {
    const response = await chatInstance.get(`/chat/room/${roomId}`);
    return response.data;
  },

  // 채팅방 메시지 내역 조회
  getRoomMessages: async (roomId: string): Promise<ChatMessage[]> => {
    const response = await chatInstance.get(`/chat/room/${roomId}/messages`);
    return response.data;
  },

  // 채팅방 입장
  enterRoom: async (roomId: string): Promise<void> => {
    await chatInstance.post(`/chat/room/${roomId}/enter`);
  },

  // 채팅방 퇴장
  exitRoom: async (roomId: string): Promise<void> => {
    await chatInstance.post(`/chat/room/${roomId}/exit`);
  },

  // 메시지 읽음 처리
  markAsRead: async (roomId: string): Promise<void> => {
    await chatInstance.post(`/chat/room/${roomId}/read`);
  }
};
