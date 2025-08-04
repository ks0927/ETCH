import ChatMessageList from "../../organisms/chat/chatMessageList";
import ChatInputArea from "../../organisms/chat/chatInputArea";
import { mockChatMessages } from "../../../types/mockChatData";

export default function ChatRoomPage() {
  const handleSendMessage = (message: string) => {
    console.log("Send message:", message);
    // TODO: 메시지 전송 로직
  };

  const handleFileUpload = () => {
    console.log("File upload");
    // TODO: 파일 업로드 로직
  };

  return (
    <div className="h-full flex flex-col">
      {/* 메시지 리스트 */}
      <div className="flex-1 overflow-y-auto p-2">
        <ChatMessageList messages={mockChatMessages} />
      </div>

      {/* 입력 영역 */}
      <div className="border-t p-2">
        <ChatInputArea
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
}
