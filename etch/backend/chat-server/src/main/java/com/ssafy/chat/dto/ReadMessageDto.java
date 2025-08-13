package com.ssafy.chat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReadMessageDto {
    private String roomId;
    private Long memberId; // 누가 읽었는지
    private Long messageId; // 어떤 메시지까지 읽었는지
}
