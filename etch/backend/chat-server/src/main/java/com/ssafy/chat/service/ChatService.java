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
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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

    /**
     * 🔧 개선된 채팅방 참가자 추가 메서드 (중복 방지 및 안전성 강화)
     */
    @Transactional
    public void addParticipant(String roomId, Long memberId) {
        if (roomId == null || memberId == null) {
            log.warn("Invalid parameters for addParticipant: roomId={}, memberId={}", roomId, memberId);
            return;
        }

        try {
            // 🆕 DB 레벨에서 중복 방지를 위한 UNIQUE 제약조건 확인
            // 이미 존재하는 경우 로그만 남기고 정상 처리
            Optional<ChatParticipant> existingParticipant =
                    chatParticipantRepository.findByRoomIdAndMemberId(roomId, memberId);

            if (existingParticipant.isPresent()) {
                log.debug("Member {} is already a participant in room {}", memberId, roomId);
                return; // 이미 참가자인 경우 추가하지 않음
            }

            // 새로운 참가자 추가 시도
            ChatParticipant participant = ChatParticipant.builder()
                    .roomId(roomId)
                    .memberId(memberId)
                    .joinedAt(LocalDateTime.now())
                    .build();

            ChatParticipant savedParticipant = chatParticipantRepository.save(participant);
            log.info("Member {} successfully added to room {} (participant_id: {})",
                    memberId, roomId, savedParticipant.getId());

        } catch (DataIntegrityViolationException e) {
            // 🆕 DB 제약조건 위반 시 (동시성으로 인한 중복 생성 시도)
            log.debug("Member {} is already a participant in room {} (caught by DB constraint)",
                    memberId, roomId);
            // 에러를 던지지 않고 정상 처리로 간주
        } catch (Exception e) {
            log.error("Failed to add member {} to room {}: {}", memberId, roomId, e.getMessage(), e);
            throw new RuntimeException("Failed to add participant to chat room", e);
        }
    }

    /**
     * 🆕 채팅방 "일시 나가기" 메서드 (참가자는 유지하되 활성 상태만 변경)
     * DB에서 삭제하지 않고 임시로 비활성화
     */
    @Transactional
    public void temporarilyLeaveRoom(String roomId, Long memberId) {
        // 실제로는 참가자를 제거하지 않음
        // 필요시 나중에 last_seen_at 같은 필드로 관리할 수 있음
        log.info("Member {} temporarily left room {} (participant remains)", memberId, roomId);
    }

    /**
     * 🆕 채팅방 "완전 나가기" 메서드 (기존 removeParticipant를 명확히 구분)
     */
    @Transactional
    public void permanentlyLeaveRoom(String roomId, Long memberId) {
        if (roomId == null || memberId == null) {
            log.warn("Invalid parameters for permanentlyLeaveRoom: roomId={}, memberId={}", roomId, memberId);
            return;
        }

        try {
            Optional<ChatParticipant> participantOpt =
                    chatParticipantRepository.findByRoomIdAndMemberId(roomId, memberId);

            if (participantOpt.isPresent()) {
                ChatParticipant participant = participantOpt.get();
                chatParticipantRepository.delete(participant);
                log.info("Member {} permanently removed from room {} (participant_id: {})",
                        memberId, roomId, participant.getId());

                // 읽음 상태도 삭제
                Optional<ChatReadStatus> readStatusOpt =
                        chatReadStatusRepository.findByRoomIdAndMemberId(roomId, memberId);
                if (readStatusOpt.isPresent()) {
                    chatReadStatusRepository.delete(readStatusOpt.get());
                    log.info("Read status for member {} in room {} also removed", memberId, roomId);
                }
            } else {
                log.warn("Member {} is not a participant in room {}", memberId, roomId);
            }
        } catch (Exception e) {
            log.error("Failed to permanently remove member {} from room {}: {}",
                    memberId, roomId, e.getMessage(), e);
            throw new RuntimeException("Failed to permanently remove participant from chat room", e);
        }
    }

    /**
     * 🆕 채팅방 참가자 제거 메서드
     */
    @Transactional
    public void removeParticipant(String roomId, Long memberId) {
        if (roomId == null || memberId == null) {
            log.warn("Invalid parameters for removeParticipant: roomId={}, memberId={}", roomId, memberId);
            return;
        }

        try {
            // 기존 참가자 확인
            Optional<ChatParticipant> participantOpt =
                    chatParticipantRepository.findByRoomIdAndMemberId(roomId, memberId);

            if (participantOpt.isPresent()) {
                ChatParticipant participant = participantOpt.get();

                // 참가자 삭제
                chatParticipantRepository.delete(participant);
                log.info("Member {} successfully removed from room {} (participant_id: {})",
                        memberId, roomId, participant.getId());

                // 해당 사용자의 읽음 상태도 삭제 (선택사항)
                Optional<ChatReadStatus> readStatusOpt =
                        chatReadStatusRepository.findByRoomIdAndMemberId(roomId, memberId);
                if (readStatusOpt.isPresent()) {
                    chatReadStatusRepository.delete(readStatusOpt.get());
                    log.info("Read status for member {} in room {} also removed", memberId, roomId);
                }

            } else {
                log.warn("Member {} is not a participant in room {}", memberId, roomId);
            }

        } catch (Exception e) {
            log.error("Failed to remove member {} from room {}: {}", memberId, roomId, e.getMessage(), e);
            throw new RuntimeException("Failed to remove participant from chat room", e);
        }
    }

    /**
     * 🆕 채팅방의 모든 참가자 조회
     */
    @Transactional(readOnly = true)
    public List<ChatParticipant> getRoomParticipants(String roomId) {
        try {
            return chatParticipantRepository.findByRoomId(roomId);
        } catch (Exception e) {
            log.error("Failed to get participants for room {}: {}", roomId, e.getMessage());
            return List.of();
        }
    }

    /**
     * 🆕 특정 사용자의 모든 참가 채팅방 ID 조회
     */
    @Transactional(readOnly = true)
    public List<String> getUserParticipatingRoomIds(Long memberId) {
        try {
            return chatParticipantRepository.findByMemberId(memberId)
                    .stream()
                    .map(ChatParticipant::getRoomId)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to get participating rooms for member {}: {}", memberId, e.getMessage());
            return List.of();
        }
    }

    /**
     * 🆕 채팅방 참가자 수 조회 (안전성 강화)
     */
    @Transactional(readOnly = true)
    public int getRoomParticipantCount(String roomId) {
        try {
            return chatParticipantRepository.countByRoomId(roomId);
        } catch (Exception e) {
            log.error("Failed to count participants for room {}: {}", roomId, e.getMessage());
            return 0;
        }
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