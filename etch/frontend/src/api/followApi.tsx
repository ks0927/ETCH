import { authInstance } from "./instances";
import type { UserProfile } from "../types/userProfile";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

interface Follows {
  followerCount: number;
  followingCount: number;
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

export const getCountFollows = async (userId: number): Promise<Follows> => {
  const response = await authInstance.get<ApiResponse<Follows>>(
    `/follows/${userId}`
  );
  return response.data.data;
};
