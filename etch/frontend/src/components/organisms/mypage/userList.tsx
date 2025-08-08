import UserItem from "../../molecules/mypage/userItem";
import type { UserData } from "../../../types/mockFollowData";

interface UserListProps {
  users: UserData[];
  onChatClick: (userId: string) => void;
  onFollowToggle: (userId: string) => void;
}

function UserList({ users, onChatClick, onFollowToggle }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-16 px-5 text-gray-600">
        <div className="text-4xl mb-5 opacity-30">👥</div>
        <div className="text-lg font-semibold mb-2 text-gray-700">아직 사용자가 없습니다</div>
        <div className="text-sm text-gray-600 leading-relaxed">새로운 사람들을 찾아보세요!</div>
      </div>
    );
  }

  return (
    <div>
      {users.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          username={user.username}
          displayName={user.displayName}
          email={user.email}
          avatar={user.avatar}
          isFollowing={user.isFollowing}
          canChat={user.canChat}
          onChatClick={onChatClick}
          onFollowToggle={onFollowToggle}
        />
      ))}
    </div>
  );
}

export default UserList;
