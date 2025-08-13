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
    public void sendMessage(ChatMessageDto messageDto) { // 파라미터 타입 변경
        // ENTER 타입 메시지 처리
        if (ChatMessageDto.MessageType.ENTER.equals(messageDto.getType())) {
            messageDto.setMessage(messageDto.getSender() + "님이 입장하셨습니다.");
            // 입장 메시지는 DB에 저장하지 않고, 바로 Redis로 발행
            redisPublisher.publish("chat-room-" + messageDto.getRoomId(), messageDto);
            return; // 아래 저장 로직을 실행하지 않고 종료
        }

        // TALK 타입 메시지 처리
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
     * 사용자의 특정 채팅방 읽음 상태를 최신 메시지 ID로 업데이트합니다.
     * 안 읽은 메시지 수를 0으로 만드는 효과가 있습니다.
     */
    @Transactional
    public void updateReadStatus(String roomId, Long memberId) {
        // 1. 해당 채팅방의 가장 마지막 메시지를 찾습니다.
        ChatMessage lastMessage = chatMessageRepository.findTopByRoomIdOrderByIdDesc(roomId)
                .orElse(null);

        // 메시지가 하나도 없으면 아무것도 하지 않습니다.
        if (lastMessage == null) {
            return;
        }

        // 2. 사용자의 읽기 상태 정보를 찾거나 새로 생성합니다.
        ChatReadStatus readStatus = chatReadStatusRepository.findByRoomIdAndMemberId(roomId, memberId)
                .orElse(new ChatReadStatus(roomId, memberId, 0L));

        // 3. 마지막으로 읽은 메시지 ID를 업데이트합니다.
        readStatus.setLastReadMessageId(lastMessage.getId());
        chatReadStatusRepository.save(readStatus);
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
}
