package com.ssafy.chat.service;

import com.ssafy.chat.dto.ChatMessageDto;
import com.ssafy.chat.entity.ChatMessage;
import com.ssafy.chat.entity.ChatParticipant;
import com.ssafy.chat.entity.ChatReadStatus;
import com.ssafy.chat.pubsub.RedisPublisher;
import com.ssafy.chat.repository.jpa.ChatMessageRepository;
import com.ssafy.chat.repository.jpa.ChatParticipantRepository;
import com.ssafy.chat.repository.jpa.ChatReadStatusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final RedisPublisher redisPublisher;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatParticipantRepository chatParticipantRepository;
    private final ChatReadStatusRepository chatReadStatusRepository;

    @Transactional
    public void sendMessage(ChatMessageDto messageDto) {
        if (ChatMessageDto.MessageType.ENTER.equals(messageDto.getType())) {
            messageDto.setMessage(messageDto.getSender() + "님이 입장하셨습니다.");
            redisPublisher.publish("chat-room-" + messageDto.getRoomId(), messageDto);
            return;
        }

        int participantCount = chatParticipantRepository.countByRoomId(messageDto.getRoomId());

        ChatMessage chatMessage = ChatMessage.builder()
                .roomId(messageDto.getRoomId())
                .senderId(messageDto.getSenderId())
                .senderNickname(messageDto.getSender())
                .message(messageDto.getMessage())
                .sentAt(LocalDateTime.now())
                .unreadCount(Math.max(0, participantCount - 1))
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);
        updateReadStatusInternal(savedMessage.getRoomId(), savedMessage.getSenderId(), savedMessage.getId());

        messageDto.setMessageId(savedMessage.getId());
        messageDto.setUnreadCount(savedMessage.getUnreadCount());
        redisPublisher.publish("chat-room-" + savedMessage.getRoomId(), messageDto);
    }

    @Transactional(readOnly = true)
    public List<ChatMessage> getChatMessages(String roomId) {
        return chatMessageRepository.findByRoomIdOrderBySentAtAsc(roomId);
    }

    @Transactional
    public void addParticipant(String roomId, Long memberId) {
        if (chatParticipantRepository.findByRoomIdAndMemberId(roomId, memberId).isEmpty()) {
            ChatParticipant participant = ChatParticipant.builder()
                    .roomId(roomId)
                    .memberId(memberId)
                    .joinedAt(LocalDateTime.now())
                    .build();
            chatParticipantRepository.save(participant);
            log.info("Member {} added to room {}", memberId, roomId);
        }
    }

    @Transactional
    public void removeParticipant(String roomId, Long memberId) {
        chatParticipantRepository.findByRoomIdAndMemberId(roomId, memberId)
                .ifPresent(participant -> {
                    chatParticipantRepository.delete(participant);
                    log.info("Member {} removed from room {}", memberId, roomId);
                });
    }

    @Transactional
    public void updateReadStatus(String roomId, Long memberId) {
        Long lastReadMessageId = chatReadStatusRepository.findByRoomIdAndMemberId(roomId, memberId)
                .map(ChatReadStatus::getLastReadMessageId)
                .orElse(0L);

        List<ChatMessage> unreadMessagesByOthers = chatMessageRepository.findByRoomIdAndSenderIdNotAndIdGreaterThan(roomId, memberId, lastReadMessageId);

        if (!unreadMessagesByOthers.isEmpty()) {
            unreadMessagesByOthers.forEach(message -> {
                message.setUnreadCount(Math.max(0, message.getUnreadCount() - 1));

                ChatMessageDto readEventDto = new ChatMessageDto();
                readEventDto.setType(ChatMessageDto.MessageType.READ);
                readEventDto.setRoomId(roomId);
                readEventDto.setMessageId(message.getId());
                readEventDto.setUnreadCount(message.getUnreadCount());
                redisPublisher.publish("chat-room-" + roomId, readEventDto);
            });
            chatMessageRepository.saveAll(unreadMessagesByOthers);
        }

        chatMessageRepository.findTopByRoomIdOrderByIdDesc(roomId).ifPresent(lastMessage -> {
            updateReadStatusInternal(roomId, memberId, lastMessage.getId());
        });
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getUnreadMessageCounts(Long memberId) {
        List<ChatParticipant> participations = chatParticipantRepository.findByMemberId(memberId);

        return participations.stream()
                .map(ChatParticipant::getRoomId)
                .distinct()
                .collect(Collectors.toMap(
                        roomId -> roomId,
                        roomId -> {
                            Long lastReadMessageId = chatReadStatusRepository.findByRoomIdAndMemberId(roomId, memberId)
                                    .map(ChatReadStatus::getLastReadMessageId)
                                    .orElse(0L);

                            // 내가 보내지 않은 메시지만 카운트
                            return chatMessageRepository.countByRoomIdAndSenderIdNotAndIdGreaterThan(roomId, memberId, lastReadMessageId);
                        }
                ));
    }

    @Transactional
    public void updateReadStatusInternal(String roomId, Long memberId, Long lastMessageId) {
        ChatReadStatus readStatus = chatReadStatusRepository.findByRoomIdAndMemberId(roomId, memberId)
                .orElse(new ChatReadStatus(roomId, memberId, 0L));

        // 마지막으로 읽은 메시지 ID가 현재 값보다 클 때만 업데이트
        if (lastMessageId > readStatus.getLastReadMessageId()) {
            readStatus.setLastReadMessageId(lastMessageId);
            chatReadStatusRepository.save(readStatus);
        }
    }
}