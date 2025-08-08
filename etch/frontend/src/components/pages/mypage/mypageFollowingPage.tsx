import UserList from "../../organisms/mypage/userList";
import { mockFollowing } from "../../../types/mockFollowData";

function MypageFollowingPage() {
  const handleChatClick = (userId: string) => {
    console.log(`채팅 시작: ${userId}`);
  };

  const handleFollowToggle = (userId: string) => {
    console.log(`팔로우 토글: ${userId}`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-8 py-5 border-b border-gray-200 bg-gray-50">
        <h1 className="text-2xl font-bold mb-1 text-gray-900">팔로잉</h1>
        <p className="text-sm text-gray-600">김철님이 {mockFollowing.length}명을 팔로우하고 있습니다.</p>
      </div>

      <UserList
        users={mockFollowing}
        onChatClick={handleChatClick}
        onFollowToggle={handleFollowToggle}
      />
    </div>
  );
}

export default MypageFollowingPage;