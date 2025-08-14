package com.ssafy.chat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DirectChatRequestDto {
    private Long targetUserId;      // 채팅할 상대방 ID
    private String myNickname;      // 요청자(현재 로그인한 유저)의 닉네임
    private String targetNickname;  // 상대방의 닉네임
}