package com.ssafy.chat.controller;

import com.ssafy.chat.dto.ChatMessageDto;
import com.ssafy.chat.dto.ReadMessageDto;
import com.ssafy.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /**
     * websocket "/pub/chat/message"로 들어오는 메시징을 처리
     */
    @MessageMapping("/chat/message")
    public void message(ChatMessageDto message) {
        log.info("Received message: type={}, roomId={}, senderId={}, message={}",
                message.getType(), message.getRoomId(), message.getSenderId(), message.getMessage());
        chatService.sendMessage(message);
    }

    /**
     * 클라이언트는 특정 메시지를 읽을 때 이 경로로 메시지를 보냅니다.
     * 이 메서드는 실제 사용자가 메시지를 읽었을 때만 호출되어야 합니다.
     * 채팅방 입장 시 자동으로 호출되면 안 됩니다.
     */
    @MessageMapping("/chat/read")
    public void readMessage(ReadMessageDto readMessageDto) {
        log.info("Received read event: roomId={}, memberId={}, messageId={}",
                readMessageDto.getRoomId(), readMessageDto.getMemberId(), readMessageDto.getMessageId());

        // 특정 메시지에 대한 읽음 처리가 아닌, 전체적인 읽음 상태 업데이트
        chatService.updateReadStatus(readMessageDto.getRoomId(), readMessageDto.getMemberId());
    }
}