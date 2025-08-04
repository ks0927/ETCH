import type { ChatRoomItemProps } from "../../atoms/listItem";
import ChatRoomItem from "../../molecules/chat/chatRoomItem";

interface ChatRoomListProps {
  chatRooms: ChatRoomItemProps[];
  onRoomClick: (roomId: string) => void;
}

export default function ChatRoomList({
  chatRooms,
  onRoomClick,
}: ChatRoomListProps) {
  return (
    <div>
      {chatRooms.length === 0 ? (
        <div>채팅방이 없습니다</div>
      ) : (
        chatRooms.map((room) => (
          <ChatRoomItem
            key={room.id}
            id={room.id}
            name={room.name}
            lastMessage={room.lastMessage}
            time={room.time}
            profileImage={room.profileImage}
            unreadCount={room.unreadCount}
            onClick={onRoomClick}
          />
        ))
      )}
    </div>
  );
}
