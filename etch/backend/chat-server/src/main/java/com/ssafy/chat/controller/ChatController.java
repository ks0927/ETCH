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
     * 클라이언트는 메시지를 읽을 때마다 이 경로로 메시지를 보냅니다.
     * 한 번의 요청으로 여러 메시지에 대한 읽음 처리를 수행합니다.
     */
    @MessageMapping("/chat/read")
    public void readMessage(ReadMessageDto readMessageDto) {
        chatService.updateReadStatus(readMessageDto.getRoomId(), readMessageDto.getMemberId());
    }
}