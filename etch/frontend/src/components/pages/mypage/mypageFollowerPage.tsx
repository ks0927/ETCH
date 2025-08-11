import UserList from "../../organisms/mypage/userList";
import { useFollowList } from "../../../hooks/useFollowList";
import { checkFollowExists, followUser, unfollowUser } from "../../../api/followApi";
import { useState, useEffect } from "react";

function MypageFollowerPage() {
  const { userList, isLoading, error } = useFollowList('followers');
  const [followStatus, setFollowStatus] = useState<{[key: number]: boolean}>({});
  const [loadingUsers, setLoadingUsers] = useState<{[key: number]: boolean}>({});

  // 각 팔로워에 대해 내가 팔로우하고 있는지 확인
  useEffect(() => {
    const checkAllFollowStatus = async () => {
      if (!userList.length) return;
      
      const statusChecks = userList.map(async (user) => {
        try {
          const isFollowing = await checkFollowExists(user.id);
          return { userId: user.id, isFollowing };
        } catch (error) {
          console.error(`팔로우 상태 확인 실패 (ID: ${user.id}):`, error);
          return { userId: user.id, isFollowing: false };
        }
      });

      const results = await Promise.all(statusChecks);
      const statusMap = results.reduce((acc, { userId, isFollowing }) => {
        acc[userId] = isFollowing;
        return acc;
      }, {} as {[key: number]: boolean});

      setFollowStatus(statusMap);
    };

    checkAllFollowStatus();
  }, [userList]);

  const handleChatClick = (userId: number) => {
    console.log(`채팅 시작: ${userId}`);
  };

  const handleFollowToggle = async (userId: number) => {
    if (loadingUsers[userId]) return;

    setLoadingUsers(prev => ({ ...prev, [userId]: true }));
    
    try {
      const isCurrentlyFollowing = followStatus[userId];
      
      if (isCurrentlyFollowing) {
        await unfollowUser(userId);
        setFollowStatus(prev => ({ ...prev, [userId]: false }));
        console.log("언팔로우 성공:", userId);
      } else {
        await followUser(userId);
        setFollowStatus(prev => ({ ...prev, [userId]: true }));
        console.log("팔로우 성공:", userId);
      }
    } catch (error) {
      console.error("팔로우 토글 실패:", error);
    } finally {
      setLoadingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-8 py-5 border-b border-gray-200 bg-gray-50">
        <h1 className="text-2xl font-bold mb-1 text-gray-900">팔로워</h1>
        <p className="text-sm text-gray-600">
          {userList.length}명이 나를 팔로우하고 있습니다.
        </p>
      </div>

      <UserList
        users={userList}
        listType="followers"
        followStatus={followStatus}
        loadingUsers={loadingUsers}
        onChatClick={handleChatClick}
        onFollowToggle={handleFollowToggle}
      />
    </div>
  );
}

export default MypageFollowerPage;
