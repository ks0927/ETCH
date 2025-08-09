import UserList from "../../organisms/mypage/userList";
import { useFollowList } from "../../../hooks/useFollowList";

function MypageFollowingPage() {
  const { userList, isLoading, error } = useFollowList('following');

  const handleChatClick = (userId: number) => {
    console.log(`채팅 시작: ${userId}`);
  };

  const handleFollowToggle = (userId: number) => {
    console.log(`팔로우 토글: ${userId}`);
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
        onChatClick={handleChatClick}
        onFollowToggle={handleFollowToggle}
      />
    </div>
  );
}

export default MypageFollowingPage;
