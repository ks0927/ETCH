import UserList from "../../organisms/mypage/userList";
import { useFollowList } from "../../../hooks/useFollowList";
import { followUser, unfollowUser } from "../../../api/followApi";
import { chatApi } from "../../../api/chatApi.tsx";
import { useModalContext } from "../../../contexts/modalContext";
import { getCurrentUserName } from "../../../utils/userUtils";
import { useState } from "react";

function MypageFollowingPage() {
  const { userList, isLoading, error } = useFollowList('following');
  const [unfollowedUsers, setUnfollowedUsers] = useState<Set<number>>(new Set());
  const [loadingUsers, setLoadingUsers] = useState<{[key: number]: boolean}>({});
  const [chatLoadingUsers, setChatLoadingUsers] = useState<{[key: number]: boolean}>({});
  const { openChatModal } = useModalContext();

  const handleChatClick = async (userId: number, targetNickname: string) => {
    if (chatLoadingUsers[userId]) return;

    setChatLoadingUsers(prev => ({ ...prev, [userId]: true }));
    
    try {
      // 현재 사용자와 대상 사용자의 닉네임 가져오기
      const myNickname = getCurrentUserName();
      
      // 1:1 채팅방 생성 (새로운 API 사용)
      const chatRoom = await chatApi.createDirectChat({
        targetUserId: userId,
        myNickname: myNickname,
        targetNickname: targetNickname
      });
      
      // 채팅 모달을 열고 해당 채팅방으로 이동
      openChatModal(chatRoom.roomId);
      
      console.log("1:1 채팅방 생성/조회 성공:", chatRoom);
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      alert("채팅을 시작할 수 없습니다. 다시 시도해주세요.");
    } finally {
      setChatLoadingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleFollowToggle = async (userId: number) => {
    if (loadingUsers[userId]) return;

    setLoadingUsers(prev => ({ ...prev, [userId]: true }));
    
    try {
      const isCurrentlyFollowing = !unfollowedUsers.has(userId);
      
      if (isCurrentlyFollowing) {
        await unfollowUser(userId);
        setUnfollowedUsers(prev => new Set([...prev, userId]));
        console.log("언팔로우 성공:", userId);
      } else {
        await followUser(userId);
        setUnfollowedUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        console.log("팔로우 성공:", userId);
      }
    } catch (error) {
      console.error("팔로우/언팔로우 실패:", error);
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
        <h1 className="text-2xl font-bold mb-1 text-gray-900">팔로잉</h1>
        <p className="text-sm text-gray-600">
          내가 {userList.length}명을 팔로우하고 있습니다.
        </p>
      </div>

      <UserList
        users={userList}
        listType="following"
        followStatus={userList.reduce((acc, user) => {
          acc[user.id] = !unfollowedUsers.has(user.id); // 언팔로우한 사용자가 아니면 팔로잉 상태
          return acc;
        }, {} as {[key: number]: boolean})}
        loadingUsers={loadingUsers}
        chatLoadingUsers={chatLoadingUsers}
        onChatClick={handleChatClick}
        onFollowToggle={handleFollowToggle}
      />
    </div>
  );
}

export default MypageFollowingPage;