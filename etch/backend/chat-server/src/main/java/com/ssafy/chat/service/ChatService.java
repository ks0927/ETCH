package com.ssafy.chat.service;

import com.ssafy.chat.dto.ChatMessageDto;
import com.ssafy.chat.entity.ChatMessage;
import com.ssafy.chat.entity.ChatParticipant;
import com.ssafy.chat.pubsub.RedisPublisher;
import com.ssafy.chat.repository.jpa.ChatMessageRepository;
import com.ssafy.chat.repository.jpa.ChatParticipantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final RedisPublisher redisPublisher;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatParticipantRepository chatParticipantRepository;

    @Transactional
    public void sendMessage(ChatMessageDto messageDto) { // 파라미터 타입 변경
        if (ChatMessageDto.MessageType.ENTER.equals(messageDto.getType())) {
            messageDto.setMessage(messageDto.getSender() + "님이 입장하셨습니다.");
        }

        // 1. DTO -> Entity 변환
        ChatMessage chatMessage = ChatMessage.builder()
                .roomId(messageDto.getRoomId())
                .senderId(messageDto.getSenderId())
                .senderNickname(messageDto.getSender())
                .message(messageDto.getMessage())
                .sentAt(LocalDateTime.now())
                .build();

        // 2. DB에 채팅 메시지 저장
        chatMessageRepository.save(chatMessage);

        // 3. Redis 토픽으로 메시지 발행
        redisPublisher.publish("chat-room-" + messageDto.getRoomId(), messageDto);
    }

    // 이전 대화 내역 조회
    @Transactional(readOnly = true)
    public List<ChatMessage> getChatMessages(String roomId) {
        return chatMessageRepository.findByRoomIdOrderBySentAtAsc(roomId);
    }

    // 사용자를 채팅방에 추가하는 메서드
    @Transactional
    public void addParticipant(String roomId, Long memberId) {
        ChatParticipant participant = ChatParticipant.builder()
                .roomId(roomId)
                .memberId(memberId)
                .joinedAt(LocalDateTime.now())
                .build();
        chatParticipantRepository.save(participant);
    }

    // 사용자를 채팅방에서 제거하는 메서드
    @Transactional
    public void removeParticipant(String roomId, Long memberId) {
        chatParticipantRepository.findByRoomIdAndMemberId(roomId, memberId)
                .ifPresent(chatParticipantRepository::delete);
    }
}
