package com.ssafy.chat.service;

import com.ssafy.chat.dto.ChatRoomResponseDto;
import com.ssafy.chat.dto.DirectChatRequestDto;
import com.ssafy.chat.entity.ChatMessage;
import com.ssafy.chat.entity.ChatRoom;
import com.ssafy.chat.repository.jpa.ChatMessageRepository;
import com.ssafy.chat.repository.redis.ChatRoomRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    // 🆕 서버 시작 시 Redis 데이터 검증 및 정리
    @PostConstruct
    public void validateAndCleanRedisData() {
        log.info("Starting Redis ChatRoom data validation...");
        try {
            cleanupCorruptedChatRooms();
        } catch (Exception e) {
            log.error("Error during Redis data cleanup: {}", e.getMessage(), e);
        }
    }

    // 🆕 손상된 ChatRoom 데이터 정리.
    private void cleanupCorruptedChatRooms() {
        try {
            List<ChatRoom> allRooms = chatRoomRepository.findAll();
            List<String> corruptedRoomIds = new ArrayList<>();

            for (int i = 0; i < allRooms.size(); i++) {
                ChatRoom room = allRooms.get(i);
                if (room == null) {
                    log.warn("Found null ChatRoom at index: {}", i);
                    corruptedRoomIds.add("index_" + i);
                } else if (room.getRoomId() == null || room.getChatType() == null) {
                    log.warn("Found corrupted ChatRoom with null fields: {}", room.getRoomId());
                    corruptedRoomIds.add(room.getRoomId());
                }
            }

            if (!corruptedRoomIds.isEmpty()) {
                log.warn("Found {} corrupted ChatRoom entries", corruptedRoomIds.size());
                // 필요시 손상된 데이터 삭제 로직 추가
                // 주의: 운영 환경에서는 신중하게 처리해야 함
            } else {
                log.info("Redis ChatRoom data validation completed successfully");
            }
        } catch (Exception e) {
            log.error("Error during ChatRoom data validation: {}", e.getMessage(), e);
        }
    }

    /**
     * 1:1 채팅방 생성 또는 기존 방 반환
     */
    public ChatRoom createOrGetDirectChatRoom(Long currentUserId, DirectChatRequestDto request) {
        // 기존 구현 유지
        Optional<ChatRoom> existingRoom = findDirectChatRoom(currentUserId, request.getTargetUserId());

        if (existingRoom.isPresent()) {
            log.info("Found existing direct chat room: {} between users {} and {}",
                    existingRoom.get().getRoomId(), currentUserId, request.getTargetUserId());
            return existingRoom.get();
        }

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
        try {
            List<ChatRoom> allRooms = chatRoomRepository.findAll();

            return allRooms.stream()
                    .filter(room -> room != null && room.getChatType() != null)  // null 체크 추가
                    .filter(room -> room.getChatType() == ChatRoom.ChatType.DIRECT)
                    .filter(room -> room.getUser1Id() != null && room.getUser2Id() != null)  // null 체크 추가
                    .filter(room -> (room.getUser1Id().equals(userId1) && room.getUser2Id().equals(userId2)) ||
                            (room.getUser1Id().equals(userId2) && room.getUser2Id().equals(userId1)))
                    .findFirst();
        } catch (Exception e) {
            log.error("Error finding direct chat room between users {} and {}: {}",
                    userId1, userId2, e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * 🔧 개선된 사용자의 모든 채팅방 조회 (사용자별 표시 이름 포함)
     */
    public List<ChatRoomResponseDto> getUserChatRooms(Long userId) {
        try {
            List<ChatRoom> allRooms = chatRoomRepository.findAll();
            log.debug("Retrieved {} total rooms from Redis", allRooms.size());

            // null 값과 손상된 데이터 필터링
            List<ChatRoom> validRooms = allRooms.stream()
                    .filter(room -> {
                        if (room == null) {
                            log.warn("Found null ChatRoom in Redis data");
                            return false;
                        }
                        if (room.getRoomId() == null || room.getChatType() == null) {
                            log.warn("Found ChatRoom with null fields: roomId={}, chatType={}",
                                    room.getRoomId(), room.getChatType());
                            return false;
                        }
                        return true;
                    })
                    .collect(Collectors.toList());

            log.debug("After filtering, {} valid rooms remain", validRooms.size());

            // 사용자가 참여한 채팅방만 필터링
            List<ChatRoom> userRooms = validRooms.stream()
                    .filter(room -> isUserInRoom(room, userId))
                    .collect(Collectors.toList());

            log.debug("User {} has {} accessible rooms", userId, userRooms.size());

            // 안 읽은 메시지 수 조회
            Map<String, Long> unreadCounts = chatService.getUnreadMessageCounts(userId);

            return userRooms.stream()
                    .map(room -> {
                        try {
                            // 마지막 메시지 조회
                            Optional<ChatMessage> lastMessage = chatMessageRepository
                                    .findTopByRoomIdOrderByIdDesc(room.getRoomId());

                            String lastMessageText = lastMessage
                                    .map(ChatMessage::getMessage)
                                    .orElse("");

                            Long unreadCount = unreadCounts.getOrDefault(room.getRoomId(), 0L);

                            return ChatRoomResponseDto.from(room, userId, lastMessageText, unreadCount);
                        } catch (Exception e) {
                            log.error("Error processing room {}: {}", room.getRoomId(), e.getMessage());
                            return null;
                        }
                    })
                    .filter(dto -> dto != null)  // 처리 중 오류가 발생한 방 제외
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error retrieving user chat rooms for userId {}: {}", userId, e.getMessage(), e);
            return new ArrayList<>();  // 빈 리스트 반환하여 서비스 중단 방지
        }
    }

    /**
     * 사용자가 특정 채팅방에 속해있는지 확인 (null 안전성 보장)
     */
    private boolean isUserInRoom(ChatRoom room, Long userId) {
        // 추가 null 체크
        if (room == null || room.getChatType() == null || userId == null) {
            log.warn("Invalid parameters for isUserInRoom: room={}, userId={}",
                    room != null ? room.getRoomId() : "null", userId);
            return false;
        }

        try {
            if (room.getChatType() == ChatRoom.ChatType.GROUP) {
                // 그룹 채팅방의 경우 ChatParticipant 테이블을 확인해야 하지만,
                // 간단히 처리하기 위해 일단 true 반환 (추후 개선 필요)
                return true;
            } else if (room.getChatType() == ChatRoom.ChatType.DIRECT) {
                // 1:1 채팅방의 경우 직접 확인
                return room.containsUser(userId);
            }
        } catch (Exception e) {
            log.error("Error checking if user {} is in room {}: {}",
                    userId, room.getRoomId(), e.getMessage());
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