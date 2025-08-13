package com.ssafy.chat.service;

import com.ssafy.chat.dto.ChatMessageDto;
import com.ssafy.chat.entity.ChatMessage;
import com.ssafy.chat.entity.ChatParticipant;
import com.ssafy.chat.entity.ChatReadStatus;
import com.ssafy.chat.entity.ChatRoom;
import com.ssafy.chat.pubsub.RedisPublisher;
import com.ssafy.chat.repository.jpa.ChatMessageRepository;
import com.ssafy.chat.repository.jpa.ChatParticipantRepository;
import com.ssafy.chat.repository.jpa.ChatReadStatusRepository;
import com.ssafy.chat.repository.redis.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final RedisPublisher redisPublisher;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatParticipantRepository chatParticipantRepository;
    private final ChatReadStatusRepository chatReadStatusRepository;
    private final ChatRoomRepository chatRoomRepository; // 채팅방 목록 조회를 위해 추가

    @Transactional
    public void sendMessage(ChatMessageDto messageDto) {
        if (ChatMessageDto.MessageType.ENTER.equals(messageDto.getType())) {
            messageDto.setMessage(messageDto.getSender() + "님이 입장하셨습니다.");
            redisPublisher.publish("chat-room-" + messageDto.getRoomId(), messageDto);
            return;
        }

        // 1. 채팅방의 현재 참여자 수 계산
        int participantCount = chatParticipantRepository.countByRoomId(messageDto.getRoomId());

        ChatMessage chatMessage = ChatMessage.builder()
                .roomId(messageDto.getRoomId())
                .senderId(messageDto.getSenderId())
                .senderNickname(messageDto.getSender())
                .message(messageDto.getMessage())
                .sentAt(LocalDateTime.now())
                .unreadCount(participantCount - 1) // 안 읽은 사람 수 = (전체 참여자 - 보낸 사람 1명)
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);

        // 2. 보낸 사람의 읽음 상태는 즉시 최신으로 업데이트
        updateReadStatusInternal(savedMessage.getRoomId(), savedMessage.getSenderId(), savedMessage.getId());

        // 3. DTO에 messageId와 unreadCount를 담아 발행
        messageDto.setMessageId(savedMessage.getId());
        messageDto.setUnreadCount(savedMessage.getUnreadCount());
        redisPublisher.publish("chat-room-" + savedMessage.getRoomId(), messageDto);
    }

    // 이전 대화 내역 조회
    @Transactional(readOnly = true)
    public List<ChatMessage> getChatMessages(String roomId) {
        return chatMessageRepository.findByRoomIdOrderBySentAtAsc(roomId);
    }

    // 사용자를 채팅방에 추가하는 메서드
    @Transactional
    public void addParticipant(String roomId, Long memberId) {
        // 이미 참여하고 있는지 확인
        if (chatParticipantRepository.findByRoomIdAndMemberId(roomId, memberId).isEmpty()) {
            ChatParticipant participant = ChatParticipant.builder()
                    .roomId(roomId)
                    .memberId(memberId)
                    .joinedAt(LocalDateTime.now())
                    .build();
            chatParticipantRepository.save(participant);
        }
    }

    // 사용자를 채팅방에서 제거하는 메서드
    @Transactional
    public void removeParticipant(String roomId, Long memberId) {
        chatParticipantRepository.findByRoomIdAndMemberId(roomId, memberId)
                .ifPresent(chatParticipantRepository::delete);
    }

    /**
     * 사용자가 채팅방의 메시지를 읽었음을 처리합니다.
     * 안 읽었던 모든 메시지를 찾아 unreadCount를 1 감소시키고,
     * READ 이벤트를 발행하여 모든 클라이언트에게 알립니다.
     */
    @Transactional
    public void updateReadStatus(String roomId, Long memberId) {
        // 1. 사용자의 마지막 읽은 메시지 ID 확인
        Long lastReadMessageId = chatReadStatusRepository.findByRoomIdAndMemberId(roomId, memberId)
                .map(ChatReadStatus::getLastReadMessageId)
                .orElse(0L);

        // 2. 해당 채팅방에서 내가 안 읽은, 다른 사람이 보낸 메시지 목록을 찾음
        List<ChatMessage> unreadMessages = chatMessageRepository.findByRoomIdAndSenderIdNotAndIdGreaterThan(roomId, memberId, lastReadMessageId);

        if (unreadMessages.isEmpty()) {
            return;
        }

        for (ChatMessage message : unreadMessages) {
            message.setUnreadCount(Math.max(0, message.getUnreadCount() - 1));

            // 변경된 unreadCount를 실시간으로 전파하기 위한 READ 메시지 발행
            ChatMessageDto readEventDto = new ChatMessageDto();
            readEventDto.setType(ChatMessageDto.MessageType.READ);
            readEventDto.setRoomId(roomId);
            readEventDto.setMessageId(message.getId());
            readEventDto.setUnreadCount(message.getUnreadCount());
            redisPublisher.publish("chat-room-" + roomId, readEventDto);
        }

        // 3. 마지막으로 읽은 메시지 ID를 최신으로 업데이트
        Long newLastReadId = unreadMessages.get(unreadMessages.size() - 1).getId();
        updateReadStatusInternal(roomId, memberId, newLastReadId);
    }

    /**
     * 특정 사용자의 모든 채팅방 별 안 읽은 메시지 수를 계산합니다.
     */
    @Transactional(readOnly = true)
    public Map<String, Long> getUnreadMessageCounts(Long memberId) {
        // 1. 사용자가 참여하고 있는 모든 채팅방 목록을 가져옵니다.
        List<String> roomIds = chatRoomRepository.findAll().stream()
                .map(ChatRoom::getRoomId)
                .collect(Collectors.toList());

        // 2. 각 채팅방 별로 안 읽은 메시지 수를 계산합니다.
        return roomIds.stream()
                .collect(Collectors.toMap(
                        roomId -> roomId, // Key: 채팅방 ID
                        roomId -> {      // Value: 안 읽은 메시지 수
                            // 사용자의 마지막 읽음 상태 조회
                            Long lastReadMessageId = chatReadStatusRepository.findByRoomIdAndMemberId(roomId, memberId)
                                    .map(ChatReadStatus::getLastReadMessageId)
                                    .orElse(0L);

                            // 안 읽은 메시지 수 계산
                            return chatMessageRepository.countByRoomIdAndIdGreaterThan(roomId, lastReadMessageId);
                        }
                ));
    }

    /**
     * 내부적으로 사용될 읽음 상태 업데이트 메소드
     */
    @Transactional
    public void updateReadStatusInternal(String roomId, Long memberId, Long lastMessageId) {
        ChatReadStatus readStatus = chatReadStatusRepository.findByRoomIdAndMemberId(roomId, memberId)
                .orElse(new ChatReadStatus(roomId, memberId, 0L));
        readStatus.setLastReadMessageId(lastMessageId);
        chatReadStatusRepository.save(readStatus);
    }
}
