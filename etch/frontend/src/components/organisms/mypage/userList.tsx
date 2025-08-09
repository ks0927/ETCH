import UserItem from "../../molecules/mypage/userItem";
import type { UserProfile } from "../../../types/userProfile"; // UserProfile import

interface UserListProps {
  users: UserProfile[]; // 타입 변경
  listType: 'followers' | 'following'; // 목록 타입을 받도록 추가
  onChatClick: (userId: number) => void;
  onFollowToggle: (userId: number) => void;
}

function UserList({ users, listType, onChatClick, onFollowToggle }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-16 px-5 text-gray-600">
        <div className="text-4xl mb-5 opacity-30">👥</div>
        <div className="text-lg font-semibold mb-2 text-gray-700">
          아직 사용자가 없습니다
        </div>
        <div className="text-sm text-gray-600 leading-relaxed">
          새로운 사람들을 찾아보세요!
        </div>
      </div>
    );
  }

  // 팔로잉 목록일 경우에만 isFollowing과 canChat을 true로 설정
  const isFollowingList = listType === 'following';

  return (
    <div>
      {users.map((user) => (
        <UserItem
          key={user.id}
          {...user} // user 객체의 모든 속성을 전달
          isFollowing={isFollowingList}
          canChat={isFollowingList} // 채팅 가능 여부도 팔로잉 상태에 따름
          onChatClick={onChatClick}
          onFollowToggle={onFollowToggle}
        />
      ))}
    </div>
  );
}

export default UserList;
