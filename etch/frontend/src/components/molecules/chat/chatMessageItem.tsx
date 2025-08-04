import type { ChatMessageItemProps } from "../../atoms/listItem";

export default function ChatMessageItem({
  message,
  sender,
  time,
  senderName,
}: ChatMessageItemProps) {
  const isMe = sender === 'me';
  
  return (
    <div className={`mb-4 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs px-4 py-2 rounded-2xl ${
        isMe 
          ? 'bg-black text-white' 
          : 'bg-gray-200 text-gray-900'
      }`}>
        {sender === 'other' && senderName && (
          <div className="text-xs text-gray-500 mb-1">{senderName}</div>
        )}
        <div className="text-sm">{message}</div>
        <div className={`text-xs mt-1 ${
          isMe ? 'text-gray-300' : 'text-gray-500'
        }`}>
          {time}
        </div>
      </div>
    </div>
  );
}