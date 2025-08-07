import UserList from "../../organisms/mypage/userList";
import { mockFollowers } from "../../../types/mockFollowData";

function MypageFollowerPage() {
  const handleChatClick = (userId: string) => {
    console.log(`채팅 시작: ${userId}`);
  };

  const handleFollowToggle = (userId: string) => {
    console.log(`팔로우 토글: ${userId}`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-8 py-5 border-b border-gray-200 bg-gray-50">
        <h1 className="text-2xl font-bold mb-1 text-gray-900">팔로워</h1>
        <p className="text-sm text-gray-600">{mockFollowers.length}명이 김철님을 팔로우하고 있습니다.</p>
      </div>

      <UserList
        users={mockFollowers}
        onChatClick={handleChatClick}
        onFollowToggle={handleFollowToggle}
      />
    </div>
  );
}

export default MypageFollowerPage;