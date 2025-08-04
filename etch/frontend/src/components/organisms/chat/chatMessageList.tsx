import type { ChatMessageItemProps } from "../../atoms/listItem";
import ChatMessageItem from "../../molecules/chat/chatMessageItem";

interface ChatMessageListProps {
  messages: ChatMessageItemProps[];
}

export default function ChatMessageList({ messages }: ChatMessageListProps) {
  return (
    <div>
      {messages.length === 0 ? (
        <div>메시지가 없습니다</div>
      ) : (
        messages.map(message => (
          <ChatMessageItem
            key={message.id}
            id={message.id}
            message={message.message}
            sender={message.sender}
            time={message.time}
            senderName={message.senderName}
          />
        ))
      )}
    </div>
  );
}