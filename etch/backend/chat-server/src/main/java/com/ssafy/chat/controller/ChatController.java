package com.ssafy.chat.controller;

import com.ssafy.chat.dto.ChatMessageDto;
import com.ssafy.chat.dto.ReadMessageDto;
import com.ssafy.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessageSendingOperations messagingTemplate; // 실시간 이벤트 전송을 위해 추가

    /**
     * websocket "/pub/chat/message"로 들어오는 메시징을 처리
     */
    @MessageMapping("/chat/message")
    public void message(ChatMessageDto message) {
        chatService.sendMessage(message);
    }

    /**
     * websocket "/pub/chat/read"로 들어오는 메시지를 처리합니다.
     * 클라이언트는 메시지를 읽을 때마다 이 경로로 메시지를 보냅니다.
     */
    @MessageMapping("/chat/read")
    public void readMessage(ReadMessageDto readMessageDto) {
        // 1. 누가 어떤 메시지까지 읽었는지 DB에 업데이트
        chatService.updateReadStatus(readMessageDto.getRoomId(), readMessageDto.getMemberId());

        // 2. 해당 채팅방을 구독하고 있는 다른 클라이언트에게 "읽음" 이벤트 전송
        //    (프론트엔드에서는 이 이벤트를 받아 안 읽음 카운트를 갱신)
        messagingTemplate.convertAndSend("/sub/chat/room/" + readMessageDto.getRoomId() + "/read", readMessageDto);
    }
}