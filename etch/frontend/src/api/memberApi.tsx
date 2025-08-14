import { authInstance } from "./instances"; // authInstance를 import
import type { UserProfile } from "../types/userProfile";
import type { ProfileImageUpdateResponse } from "../types/member";

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

export const updateProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('profile', file);
  
  const response = await authInstance.patch<ApiResponse<ProfileImageUpdateResponse>>(
    '/members/profile-update',
    formData
  );
  
  return response.data.data.profileImageUrl;
};
