import ChatRoomList from "../../organisms/chat/chatRoomList";
import { mockChatRooms } from "../../../types/mock/mockChatRoomData";

interface ChatListPageProps {
  onRoomSelect?: (roomId: string, roomName: string) => void;
}

function ChatListPage({ onRoomSelect }: ChatListPageProps) {
  const handleRoomClick = (roomId: string) => {
    const room = mockChatRooms.find((r) => r.id === roomId);
    if (onRoomSelect && room) {
      onRoomSelect(roomId, room.name);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <ChatRoomList chatRooms={mockChatRooms} onRoomClick={handleRoomClick} />
    </div>
  );
}
export default ChatListPage;
