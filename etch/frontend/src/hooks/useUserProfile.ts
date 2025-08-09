import { useState, useEffect } from "react";
import useUserStore from "../store/userStore";
import { getMemberById } from "../api/memberApi";
import { getFollowers, getFollowings } from "../api/followApi";
import type { UserProfile } from "../types/userProfile";

export interface ProfileCardData extends UserProfile {
  followersCount: number;
  followingCount: number;
}

export const useUserProfile = () => {
  const { memberInfo } = useUserStore();
  const [profileData, setProfileData] = useState<ProfileCardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // --- 1. 훅 시작 시점의 memberInfo 확인 ---
    console.log("[useUserProfile] 훅 시작, memberInfo:", memberInfo);

    if (!memberInfo?.id) {
      console.log("[useUserProfile] memberInfo.id 없음, 로직 중단.");
      setIsLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        console.log(`[useUserProfile] API 호출 시작 (ID: ${memberInfo.id})`);
        const [memberData, followers, followings] = await Promise.all([
          getMemberById(memberInfo.id),
          getFollowers(),
          getFollowings(),
        ]);
        
        // --- 2. API 성공 시 데이터 확인 ---
        console.log("[useUserProfile] API 성공:", { memberData, followers, followings });

        const finalData = {
          ...memberData,
          followersCount: followers.length,
          followingCount: followings.length,
        };

        setProfileData(finalData);
        // --- 3. 최종 데이터 확인 ---
        console.log("[useUserProfile] 최종 profileData:", finalData);

      } catch (err) {
        // --- 4. 에러 발생 시 에러 내용 확인 ---
        console.error("[useUserProfile] API 호출 실패:", err);
        setError("프로필 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [memberInfo?.id]);

  return { profileData, isLoading, error };
};

