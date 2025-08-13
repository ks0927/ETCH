package com.ssafy.chat.controller;

import com.ssafy.chat.entity.ChatMessage;
import com.ssafy.chat.entity.ChatRoom;
import com.ssafy.chat.interceptor.JwtUtil;
import com.ssafy.chat.pubsub.RedisSubscriber;
import com.ssafy.chat.repository.redis.ChatRoomRepository;
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
    private final ChatService chatService;
    private final RedisMessageListenerContainer redisMessageListener;
    private final RedisSubscriber redisSubscriber;
    private final JwtUtil jwtUtil;

    // 서버 실행 시, 모든 채팅방의 토픽을 Redis 리스너에 등록
    // Key: roomId, Value: ChannelTopic
    private Map<String, ChannelTopic> topics = new HashMap<>();

    @PostConstruct
    private void init() {
        // 기존에 Redis에 저장된 모든 채팅방 정보를 가져와 topics 맵에 추가
        List<ChatRoom> allRooms = chatRoomRepository.findAll();
        for (ChatRoom room : allRooms) {
            ChannelTopic topic = new ChannelTopic("chat-room-" + room.getRoomId());
            topics.put(room.getRoomId(), topic);
        }
    }

    // 모든 채팅방 목록 조회
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoom>> findAllRooms() {
        // 서버 재시작 시 init()에서 topic이 초기화 되므로, DB에서 다시 로드
        if (topics.isEmpty()) {
            init();
        }
        return ResponseEntity.ok(chatRoomRepository.findAll());
    }

    // 채팅방 생성
    @PostMapping("/room")
    public ResponseEntity<ChatRoom> createRoom(@RequestParam String name) {
        ChatRoom chatRoom = ChatRoom.create(name);
        chatRoomRepository.save(chatRoom); // Redis에 채팅방 정보 저장

        // 새로운 채팅방 토픽 생성 및 맵에 추가
        ChannelTopic topic = new ChannelTopic("chat-room-" + chatRoom.getRoomId());
        topics.put(chatRoom.getRoomId(), topic);

        return ResponseEntity.ok(chatRoom);
    }

    // 특정 채팅방 정보 조회
    @GetMapping("/room/{roomId}")
    public ResponseEntity<ChatRoom> findRoomById(@PathVariable String roomId) {
        Optional<ChatRoom> chatRoom = chatRoomRepository.findById(roomId);
        return chatRoom.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 특정 채팅방의 이전 메시지 내역 조회
    @GetMapping("/room/{roomId}/messages")
    public ResponseEntity<List<ChatMessage>> getRoomMessages(@PathVariable String roomId) {
        List<ChatMessage> messages = chatService.getChatMessages(roomId);
        return ResponseEntity.ok(messages);
    }

    /**
     * 클라이언트가 채팅방에 입장할 때 호출됩니다.
     * 이 API가 호출되면, 서버는 해당 채팅방의 Topic을 실제 Redis 리스너에 등록하여
     * 메시지 수신을 시작합니다.
     *
     * ⭐ 중요: 읽음 처리는 별도의 API나 사용자의 명시적 액션에 의해서만 수행됩니다.
     */
    @PostMapping("/room/{roomId}/enter")
    public ResponseEntity<Void> enterChatRoom(@RequestHeader("Authorization") String authorizationHeader, @PathVariable String roomId) {
        // 1. 토큰에서 memberId 추출
        Long memberId = getMemberIdFromToken(authorizationHeader);
        if (memberId == null) {
            log.warn("Invalid or expired token for room: {}", roomId);
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        // 2. Redis 리스너 등록
        ChannelTopic topic = topics.get(roomId);
        if (topic == null) {
            Optional<ChatRoom> roomOpt = chatRoomRepository.findById(roomId);
            if(roomOpt.isPresent()) {
                topic = new ChannelTopic("chat-room-" + roomId);
                topics.put(roomId, topic);
            } else {
                log.warn("Room not found: {}", roomId);
                return ResponseEntity.notFound().build();
            }
        }
        redisMessageListener.addMessageListener(redisSubscriber, topic);

        // 3. DB에 참여자 정보 저장 (읽음 처리는 하지 않음)
        try {
            log.info("Member {} entered room: {}", memberId, roomId);
            chatService.addParticipant(roomId, memberId);

            // ⭐ 수정: 자동 읽음 처리 제거
            // chatService.markRoomAsReadOnEnter(roomId, memberId); // 이 라인 제거

        } catch (Exception e) {
            log.error("Failed to add participant: {}", e.getMessage());
            return ResponseEntity.status(500).build();
        }

        return ResponseEntity.ok().build();
    }

    // 채팅방 퇴장 API
    @PostMapping("/room/{roomId}/exit")
    public ResponseEntity<Void> exitChatRoom(@RequestHeader("Authorization") String authorizationHeader, @PathVariable String roomId) {
        // 1. 토큰에서 memberId 추출
        Long memberId = getMemberIdFromToken(authorizationHeader);
        if (memberId == null) {
            log.warn("Invalid or expired token for room exit: {}", roomId);
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        // 2. DB에서 참여자 정보 삭제
        try {
            chatService.removeParticipant(roomId, memberId);
            log.info("Member {} exited room: {}", memberId, roomId);
        } catch (Exception e) {
            log.error("Failed to remove participant: {}", e.getMessage());
            return ResponseEntity.status(500).build();
        }

        return ResponseEntity.ok().build();
    }

    /**
     * 사용자가 특정 채팅방의 메시지를 읽었음을 서버에 알립니다.
     * 이 API는 사용자가 실제로 메시지를 읽었을 때만 호출되어야 합니다.
     */
    @PostMapping("/room/{roomId}/read")
    public ResponseEntity<Void> markAsRead(@RequestHeader("Authorization") String authorizationHeader,
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
     * 사용자의 모든 채팅방에 대한 안 읽은 메시지 수를 조회합니다.
     * 채팅방 목록을 보여줄 때 사용됩니다.
     */
    @GetMapping("/rooms/unread-counts")
    public ResponseEntity<Map<String, Long>> getTotalUnreadCounts(@RequestHeader("Authorization") String authorizationHeader) {
        Long memberId = getMemberIdFromToken(authorizationHeader);
        if (memberId == null) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Long> unreadCounts = chatService.getUnreadMessageCounts(memberId);
        return ResponseEntity.ok(unreadCounts);
    }

    // 토큰 파싱을 위한 안전한 헬퍼 메서드
    private Long getMemberIdFromToken(String authorizationHeader) {
        if (StringUtils.hasText(authorizationHeader) && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            try {
                // 새로운 isValidToken 메서드 사용
                if (jwtUtil.isValidToken(token)) {
                    return jwtUtil.getId(token);
                }
            } catch (Exception e) {
                log.error("Token validation failed: {}", e.getMessage());
            }
        }
        return null;
    }
}