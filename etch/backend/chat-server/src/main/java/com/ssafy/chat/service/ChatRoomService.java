package com.ssafy.chat.service;

import com.ssafy.chat.dto.ChatRoomResponseDto;
import com.ssafy.chat.dto.DirectChatRequestDto;
import com.ssafy.chat.entity.ChatMessage;
import com.ssafy.chat.entity.ChatRoom;
import com.ssafy.chat.repository.jpa.ChatMessageRepository;
import com.ssafy.chat.repository.redis.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatService chatService;

    /**
     * 1:1 채팅방 생성 또는 기존 방 반환
     */
    public ChatRoom createOrGetDirectChatRoom(Long currentUserId, DirectChatRequestDto request) {
        // 기존 1:1 채팅방이 있는지 확인
        Optional<ChatRoom> existingRoom = findDirectChatRoom(currentUserId, request.getTargetUserId());

        if (existingRoom.isPresent()) {
            log.info("Found existing direct chat room: {} between users {} and {}",
                    existingRoom.get().getRoomId(), currentUserId, request.getTargetUserId());
            return existingRoom.get();
        }

        // 새로운 1:1 채팅방 생성
        ChatRoom newRoom = ChatRoom.createDirectChat(
                currentUserId,
                request.getMyNickname(),
                request.getTargetUserId(),
                request.getTargetNickname()
        );

        ChatRoom savedRoom = chatRoomRepository.save(newRoom);
        log.info("Created new direct chat room: {} between users {} and {}",
                savedRoom.getRoomId(), currentUserId, request.getTargetUserId());

        return savedRoom;
    }

    /**
     * 두 사용자 간의 기존 1:1 채팅방 조회
     */
    public Optional<ChatRoom> findDirectChatRoom(Long userId1, Long userId2) {
        List<ChatRoom> allRooms = chatRoomRepository.findAll();

        return allRooms.stream()
                .filter(room -> room.getChatType() == ChatRoom.ChatType.DIRECT)
                .filter(room -> (room.getUser1Id().equals(userId1) && room.getUser2Id().equals(userId2)) ||
                        (room.getUser1Id().equals(userId2) && room.getUser2Id().equals(userId1)))
                .findFirst();
    }

    /**
     * 사용자의 모든 채팅방 조회 (사용자별 표시 이름 포함)
     */
    public List<ChatRoomResponseDto> getUserChatRooms(Long userId) {
        List<ChatRoom> allRooms = chatRoomRepository.findAll();

        // 사용자가 참여한 채팅방만 필터링
        List<ChatRoom> userRooms = allRooms.stream()
                .filter(room -> isUserInRoom(room, userId))
                .collect(Collectors.toList());

        // 안 읽은 메시지 수 조회
        Map<String, Long> unreadCounts = chatService.getUnreadMessageCounts(userId);

        return userRooms.stream()
                .map(room -> {
                    // 마지막 메시지 조회
                    Optional<ChatMessage> lastMessage = chatMessageRepository
                            .findTopByRoomIdOrderByIdDesc(room.getRoomId());

                    String lastMessageText = lastMessage
                            .map(ChatMessage::getMessage)
                            .orElse("");

                    Long unreadCount = unreadCounts.getOrDefault(room.getRoomId(), 0L);

                    return ChatRoomResponseDto.from(room, userId, lastMessageText, unreadCount);
                })
                .collect(Collectors.toList());
    }

    /**
     * 사용자가 특정 채팅방에 속해있는지 확인
     */
    private boolean isUserInRoom(ChatRoom room, Long userId) {
        if (room.getChatType() == ChatRoom.ChatType.GROUP) {
            // 그룹 채팅방의 경우 ChatParticipant 테이블을 확인해야 하지만,
            // 간단히 처리하기 위해 일단 true 반환 (추후 개선 필요)
            return true;
        } else if (room.getChatType() == ChatRoom.ChatType.DIRECT) {
            // 1:1 채팅방의 경우 직접 확인
            return room.containsUser(userId);
        }
        return false;
    }

    /**
     * 특정 채팅방 조회
     */
    public Optional<ChatRoom> findById(String roomId) {
        return chatRoomRepository.findById(roomId);
    }

    /**
     * 그룹 채팅방 생성
     */
    public ChatRoom createGroupChatRoom(String roomName) {
        ChatRoom chatRoom = ChatRoom.create(roomName);
        return chatRoomRepository.save(chatRoom);
    }

    /**
     * 사용자별 채팅방 정보 조회 (이름 포함)
     */
    public ChatRoomResponseDto getChatRoomForUser(String roomId, Long userId) {
        Optional<ChatRoom> roomOpt = chatRoomRepository.findById(roomId);
        if (roomOpt.isPresent()) {
            ChatRoom room = roomOpt.get();
            return ChatRoomResponseDto.from(room, userId);
        }
        return null;
    }
}