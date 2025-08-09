import { authInstance } from "./instances";
import type { UserProfile } from "../types/userProfile";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export const getFollowers = async (): Promise<UserProfile[]> => {
  const response = await authInstance.get<ApiResponse<UserProfile[]>>(
    `/follows/followers`
  );
  return response.data.data;
};

export const getFollowings = async (): Promise<UserProfile[]> => {
  const response = await authInstance.get<ApiResponse<UserProfile[]>>(
    `/follows/following`
  );
  return response.data.data;
};
