package com.ssafy.chat.controller;

import com.ssafy.chat.dto.ChatRoomResponseDto;
import com.ssafy.chat.dto.DirectChatRequestDto;
import com.ssafy.chat.entity.ChatMessage;
import com.ssafy.chat.entity.ChatRoom;
import com.ssafy.chat.interceptor.JwtUtil;
import com.ssafy.chat.pubsub.RedisSubscriber;
import com.ssafy.chat.repository.redis.ChatRoomRepository;
import com.ssafy.chat.service.ChatRoomService;
import com.ssafy.chat.service.ChatService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class ChatRoomController {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomService chatRoomService;
    private final ChatService chatService;
    private final RedisMessageListenerContainer redisMessageListener;
    private final RedisSubscriber redisSubscriber;
    private final JwtUtil jwtUtil;

    // 서버 실행 시, 모든 채팅방의 토픽을 Redis 리스너에 등록
    private Map<String, ChannelTopic> topics = new HashMap<>();

    @PostConstruct
    private void init() {
        List<ChatRoom> allRooms = chatRoomRepository.findAll();
        for (ChatRoom room : allRooms) {
            ChannelTopic topic = new ChannelTopic("chat-room-" + room.getRoomId());
            topics.put(room.getRoomId(), topic);
        }
    }

    /**
     * 🆕 1:1 채팅방 생성 또는 기존 방 반환
     */
    @PostMapping("/direct")
    public ResponseEntity<ChatRoomResponseDto> createOrGetDirectChatRoom(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody DirectChatRequestDto request) {

        // 토큰에서 현재 사용자 ID 추출
        Long currentUserId = getMemberIdFromToken(authorizationHeader);
        if (currentUserId == null) {
            log.warn("Invalid or expired token for direct chat creation");
            return ResponseEntity.status(401).build();
        }

        try {
            // 1:1 채팅방 생성 또는 기존 방 조회
            ChatRoom chatRoom = chatRoomService.createOrGetDirectChatRoom(currentUserId, request);

            // 새로운 채팅방 토픽 생성 및 맵에 추가 (기존에 없는 경우)
            String roomId = chatRoom.getRoomId();
            if (!topics.containsKey(roomId)) {
                ChannelTopic topic = new ChannelTopic("chat-room-" + roomId);
                topics.put(roomId, topic);
            }

            // 사용자별 표시 정보로 응답
            ChatRoomResponseDto response = ChatRoomResponseDto.from(chatRoom, currentUserId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to create or get direct chat room: {}", e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * 📝 수정된 채팅방 목록 조회 (사용자별 표시 이름 포함)
     */
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomResponseDto>> findUserRooms(
            @RequestHeader("Authorization") String authorizationHeader) {

        Long currentUserId = getMemberIdFromToken(authorizationHeader);
        if (currentUserId == null) {
            log.warn("Invalid or expired token for rooms list");
            return ResponseEntity.status(401).build();
        }

        // 서버 재시작 시 topics 초기화
        if (topics.isEmpty()) {
            init();
        }

        List<ChatRoomResponseDto> userRooms = chatRoomService.getUserChatRooms(currentUserId);
        return ResponseEntity.ok(userRooms);
    }

    /**
     * 그룹 채팅방 생성 (기존 방식 유지)
     */
    @PostMapping("/room")
    public ResponseEntity<ChatRoomResponseDto> createGroupRoom(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam String name) {

        Long currentUserId = getMemberIdFromToken(authorizationHeader);
        if (currentUserId == null) {
            return ResponseEntity.status(401).build();
        }

        ChatRoom chatRoom = chatRoomService.createGroupChatRoom(name);

        // 새로운 채팅방 토픽 생성 및 맵에 추가
        ChannelTopic topic = new ChannelTopic("chat-room-" + chatRoom.getRoomId());
        topics.put(chatRoom.getRoomId(), topic);

        ChatRoomResponseDto response = ChatRoomResponseDto.from(chatRoom, currentUserId);
        return ResponseEntity.ok(response);
    }

    /**
     * 📝 수정된 특정 채팅방 정보 조회 (사용자별 표시 이름 포함)
     */
    @GetMapping("/room/{roomId}")
    public ResponseEntity<ChatRoomResponseDto> findRoomById(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String roomId) {

        Long currentUserId = getMemberIdFromToken(authorizationHeader);
        if (currentUserId == null) {
            return ResponseEntity.status(401).build();
        }

        ChatRoomResponseDto response = chatRoomService.getChatRoomForUser(roomId, currentUserId);
        if (response != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 특정 채팅방의 이전 메시지 내역 조회 (기존과 동일)
     */
    @GetMapping("/room/{roomId}/messages")
    public ResponseEntity<List<ChatMessage>> getRoomMessages(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String roomId) {

        Long memberId = getMemberIdFromToken(authorizationHeader);
        if (memberId == null) {
            return ResponseEntity.status(401).build();
        }

        List<ChatMessage> messages = chatService.getChatMessages(roomId);
        return ResponseEntity.ok(messages);
    }

    /**
     * 채팅방 입장 (기존과 동일)
     */
    @PostMapping("/room/{roomId}/enter")
    public ResponseEntity<Void> enterChatRoom(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String roomId) {

        Long memberId = getMemberIdFromToken(authorizationHeader);
        if (memberId == null) {
            log.warn("Invalid or expired token for room: {}", roomId);
            return ResponseEntity.status(401).build();
        }

        // Redis 리스너 등록
        ChannelTopic topic = topics.get(roomId);
        if (topic == null) {
            Optional<ChatRoom> roomOpt = chatRoomRepository.findById(roomId);
            if (roomOpt.isPresent()) {
                topic = new ChannelTopic("chat-room-" + roomId);
                topics.put(roomId, topic);
            } else {
                log.warn("Room not found: {}", roomId);
                return ResponseEntity.notFound().build();
            }
        }
        redisMessageListener.addMessageListener(redisSubscriber, topic);

        // 🆕 안전한 참가자 추가 (중복 방지 강화)
        try {
            log.info("Member {} entered room: {}", memberId, roomId);
            chatService.addParticipant(roomId, memberId);
        } catch (Exception e) {
            log.error("Failed to add participant: {}", e.getMessage());
            // 🆕 참가자 추가 실패해도 Redis 연결은 유지 (이미 참가자일 수 있음)
        }

        return ResponseEntity.ok().build();
    }

    /**
     * 🆕 새로운 임시 나가기 엔드포인트 (채팅방 목록으로 돌아가기)
     */
    @PostMapping("/room/{roomId}/leave-temporarily")
    public ResponseEntity<Void> temporarilyLeaveChatRoom(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String roomId) {

        Long memberId = getMemberIdFromToken(authorizationHeader);
        if (memberId == null) {
            log.warn("Invalid or expired token for temporary room leave: {}", roomId);
            return ResponseEntity.status(401).build();
        }

        try {
            // 🆕 DB에서 참가자를 제거하지 않음 (단순히 WebSocket 연결만 해제)
            chatService.temporarilyLeaveRoom(roomId, memberId);
            log.info("Member {} temporarily left room: {}", memberId, roomId);
        } catch (Exception e) {
            log.error("Failed to temporarily leave room: {}", e.getMessage());
            return ResponseEntity.status(500).build();
        }

        return ResponseEntity.ok().build();
    }

    /**
     * 📝 수정된 채팅방 완전 퇴장 (기존 exit 엔드포인트)
     */
    @PostMapping("/room/{roomId}/exit")
    public ResponseEntity<Void> exitChatRoom(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String roomId) {

        Long memberId = getMemberIdFromToken(authorizationHeader);
        if (memberId == null) {
            log.warn("Invalid or expired token for room exit: {}", roomId);
            return ResponseEntity.status(401).build();
        }

        try {
            // 🆕 완전 나가기로 변경 (DB에서 참가자 제거)
            chatService.permanentlyLeaveRoom(roomId, memberId);
            log.info("Member {} permanently exited room: {}", memberId, roomId);
        } catch (Exception e) {
            log.error("Failed to remove participant: {}", e.getMessage());
            return ResponseEntity.status(500).build();
        }

        return ResponseEntity.ok().build();
    }

    /**
     * 메시지 읽음 처리 (기존과 동일)
     */
    @PostMapping("/room/{roomId}/read")
    public ResponseEntity<Void> markAsRead(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String roomId) {

        Long memberId = getMemberIdFromToken(authorizationHeader);
        if (memberId == null) {
            return ResponseEntity.status(401).build();
        }

        log.info("Manual read status update requested by member {} for room {}", memberId, roomId);
        chatService.updateReadStatus(roomId, memberId);
        return ResponseEntity.ok().build();
    }

    /**
     * 안 읽은 메시지 수 조회 (기존과 동일)
     */
    @GetMapping("/rooms/unread-counts")
    public ResponseEntity<Map<String, Long>> getTotalUnreadCounts(
            @RequestHeader("Authorization") String authorizationHeader) {

        Long memberId = getMemberIdFromToken(authorizationHeader);
        if (memberId == null) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Long> unreadCounts = chatService.getUnreadMessageCounts(memberId);
        return ResponseEntity.ok(unreadCounts);
    }

    /**
     * 토큰에서 사용자 ID 추출하는 헬퍼 메서드
     */
    private Long getMemberIdFromToken(String authorizationHeader) {
        log.info("토큰 검증 시작. Authorization 헤더: {}",
                authorizationHeader != null ? "존재함" : "없음");

        if (StringUtils.hasText(authorizationHeader) && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            log.info("토큰 추출 완료. 토큰 길이: {}", token.length());

            try {
                if (jwtUtil.isValidToken(token)) {
                    Long userId = jwtUtil.getId(token);
                    log.info("토큰 검증 성공. 사용자 ID: {}", userId);
                    return userId;
                } else {
                    log.warn("토큰이 유효하지 않습니다");
                }
            } catch (Exception e) {
                log.error("토큰 검증 중 오류 발생: {}", e.getMessage(), e);
            }
        } else {
            log.warn("Authorization 헤더가 없거나 형식이 잘못되었습니다");
        }
        return null;
    }
}