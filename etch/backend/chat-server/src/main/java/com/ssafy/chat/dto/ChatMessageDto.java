package com.ssafy.chat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageDto {
    public enum MessageType {
        ENTER, TALK, READ // READ 타입 추가
    }
    private MessageType type;
    private String roomId;
    private Long senderId;
    private String sender;
    private String message;
    private Long messageId; // 메시지 ID 필드 추가
    private int unreadCount; // 안 읽은 수 필드 추가
}