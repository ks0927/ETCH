import { authInstance } from "./instances"; // authInstance를 import
import type { UserProfile } from "../types/userProfile";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export const getMemberById = async (memberId: number): Promise<UserProfile> => {
  // authInstance를 사용하여 API 호출
  const response = await authInstance.get<ApiResponse<UserProfile>>(`/members/${memberId}`);
  return response.data.data;
};
