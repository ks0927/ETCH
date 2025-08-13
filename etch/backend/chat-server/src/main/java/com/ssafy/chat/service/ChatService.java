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

        // 메시지 발송자의 읽음 상태만 업데이트 (본인 메시지는 자동으로 읽음 처리)
        updateReadStatusInternal(savedMessage.getRoomId(), savedMessage.getSenderId(), savedMessage.getId());

        messageDto.setMessageId(savedMessage.getId());
        messageDto.setUnreadCount(savedMessage.getUnreadCount());
        redisPublisher.publish("chat-room-" + savedMessage.getRoomId(), messageDto);
    }

    @Transactional(readOnly = true)
    public List<ChatMessage> getChatMessages(String roomId) {
        List<ChatMessage> messages = chatMessageRepository.findByRoomIdOrderBySentAtAsc(roomId);
        log.info("Retrieved {} messages for room {}", messages.size(), roomId);

        // 디버깅을 위한 로그
        messages.forEach(msg -> {
            if (msg.getUnreadCount() > 0) {
                log.info("Message ID: {}, Sender: {}, UnreadCount: {}, Content: {}",
                        msg.getId(), msg.getSenderId(), msg.getUnreadCount(),
                        msg.getMessage().substring(0, Math.min(msg.getMessage().length(), 20)));
            }
        });

        return messages;
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

    /**
     * 사용자가 명시적으로 메시지를 읽었을 때 호출되는 메서드
     * 다른 사람이 보낸 메시지에 대해서만 읽음 처리를 수행합니다.
     */
    @Transactional
    public void updateReadStatus(String roomId, Long memberId) {
        log.info("Starting read status update for member {} in room {}", memberId, roomId);

        // 현재 사용자의 마지막 읽음 메시지 ID 조회
        Long lastReadMessageId = chatReadStatusRepository.findByRoomIdAndMemberId(roomId, memberId)
                .map(ChatReadStatus::getLastReadMessageId)
                .orElse(0L);

        log.info("Last read message ID for member {}: {}", memberId, lastReadMessageId);

        // 본인이 보내지 않은 메시지 중에서 아직 읽지 않은 메시지들만 조회
        List<ChatMessage> unreadMessagesByOthers = chatMessageRepository
                .findByRoomIdAndSenderIdNotAndIdGreaterThan(roomId, memberId, lastReadMessageId);

        log.info("Member {} reading messages in room {}. Found {} unread messages by others",
                memberId, roomId, unreadMessagesByOthers.size());

        // 다른 사람이 보낸 메시지들에 대해서만 읽음 처리
        if (!unreadMessagesByOthers.isEmpty()) {
            for (ChatMessage message : unreadMessagesByOthers) {
                // unreadCount 감소 (0 이하로는 내려가지 않도록)
                int newUnreadCount = Math.max(0, message.getUnreadCount() - 1);
                message.setUnreadCount(newUnreadCount);

                log.info("Message ID: {} (from user {}), unreadCount: {} -> {}",
                        message.getId(), message.getSenderId(), message.getUnreadCount() + 1, newUnreadCount);

                // 읽음 이벤트 발송
                ChatMessageDto readEventDto = new ChatMessageDto();
                readEventDto.setType(ChatMessageDto.MessageType.READ);
                readEventDto.setRoomId(roomId);
                readEventDto.setMessageId(message.getId());
                readEventDto.setUnreadCount(newUnreadCount);

                redisPublisher.publish("chat-room-" + roomId, readEventDto);
            }
            chatMessageRepository.saveAll(unreadMessagesByOthers);
        } else {
            log.info("No unread messages by others found for member {} in room {}", memberId, roomId);
        }

        // 채팅방의 가장 최신 메시지까지 읽음 상태 업데이트
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
            log.info("Updated read status for member {} in room {}: lastMessageId = {}",
                    memberId, roomId, lastMessageId);
        }
    }
}