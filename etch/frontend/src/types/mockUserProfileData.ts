export interface UserProfile {
  name: string;
  description: string;
  imageUrl?: string;
  followers: number;
  following: number;
}

export const mockUserProfile: UserProfile = {
  name: "김철",
  description: "개발자 꿈나무입니다. 성장하는 중이에요!",
  imageUrl: "",
  followers: 15,
  following: 2,
};
