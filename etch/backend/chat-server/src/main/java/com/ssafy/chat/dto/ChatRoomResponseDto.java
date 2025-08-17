package com.ssafy.chat.dto;

import com.ssafy.chat.entity.ChatRoom;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ChatRoomResponseDto {
    private String roomId;
    private String displayName;     // 사용자별로 다르게 표시되는 채팅방 이름
    private ChatRoom.ChatType chatType;
    private Long otherUserId;       // 1:1 채팅방의 경우 상대방 ID
    private LocalDateTime createdAt;
    private String lastMessage;     // 마지막 메시지 (옵션)
    private Long unreadCount;       // 안 읽은 메시지 수 (옵션)

    public static ChatRoomResponseDto from(ChatRoom chatRoom, Long currentUserId) {
        return ChatRoomResponseDto.builder()
                .roomId(chatRoom.getRoomId())
                .displayName(chatRoom.getDisplayNameForUser(currentUserId))
                .chatType(chatRoom.getChatType())
                .otherUserId(chatRoom.getOtherUserId(currentUserId))
                .createdAt(chatRoom.getCreatedAt())
                .build();
    }

    public static ChatRoomResponseDto from(ChatRoom chatRoom, Long currentUserId, String lastMessage, Long unreadCount) {
        return ChatRoomResponseDto.builder()
                .roomId(chatRoom.getRoomId())
                .displayName(chatRoom.getDisplayNameForUser(currentUserId))
                .chatType(chatRoom.getChatType())
                .otherUserId(chatRoom.getOtherUserId(currentUserId))
                .createdAt(chatRoom.getCreatedAt())
                .lastMessage(lastMessage)
                .unreadCount(unreadCount)
                .build();
    }
}