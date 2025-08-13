package com.ssafy.chat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageDto {
    public enum MessageType {
        ENTER, TALK
    }
    private MessageType type;
    private String roomId;
    private Long senderId;
    private String sender; // 보낸 사람 닉네임
    private String message;
}