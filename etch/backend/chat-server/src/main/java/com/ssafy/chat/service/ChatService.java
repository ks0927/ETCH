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
    public void sendMessage(ChatMessageDto messageDto) { // íŒŒë¼ë¯¸í„° íƒ€ìž… ë³€ê²½
        if (ChatMessageDto.MessageType.ENTER.equals(messageDto.getType())) {
            messageDto.setMessage(messageDto.getSender() + "ë‹˜ì´ ìž…ìž¥í•˜ì…¨ìŠµë‹ˆë‹¤.");
        }

        // 1. DTO -> Entity ë³€í™˜
        ChatMessage chatMessage = ChatMessage.builder()
                .roomId(messageDto.getRoomId())
                .senderId(messageDto.getSenderId())
                .senderNickname(messageDto.getSender())
                .message(messageDto.getMessage())
                .sentAt(LocalDateTime.now())
                .build();

        // 2. DBì— ì±„íŒ… ë©”ì‹œì§€ ì €ìž¥
        chatMessageRepository.save(chatMessage);

        // 3. Redis í† í”½ìœ¼ë¡œ ë©”ì‹œì§€ ë°œí–‰
        redisPublisher.publish("chat-room-" + messageDto.getRoomId(), messageDto);
    }

    // ì´ì „ ëŒ€í™” ë‚´ì—­ ì¡°íšŒ
    @Transactional(readOnly = true)
    public List<ChatMessage> getChatMessages(String roomId) {
        return chatMessageRepository.findByRoomIdOrderBySentAtAsc(roomId);
    }

    // ì‚¬ìš©ìžë¥¼ ì±„íŒ…ë°©ì— ì¶”ê°€í•˜ëŠ” ë©”ì„œë“œ
    @Transactional
    public void addParticipant(String roomId, Long memberId) {
        ChatParticipant participant = ChatParticipant.builder()
                .roomId(roomId)
                .memberId(memberId)
                .joinedAt(LocalDateTime.now())
                .build();
        chatParticipantRepository.save(participant);
    }

    // ì‚¬ìš©ìžë¥¼ ì±„íŒ…ë°©ì—ì„œ ì œê±°í•˜ëŠ” ë©”ì„œë“œ
    @Transactional
    public void removeParticipant(String roomId, Long memberId) {
        chatParticipantRepository.findByRoomIdAndMemberId(roomId, memberId)
                .ifPresent(chatParticipantRepository::delete);
    }
}
