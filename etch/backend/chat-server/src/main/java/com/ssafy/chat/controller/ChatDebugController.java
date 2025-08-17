package com.ssafy.chat.controller;

import com.ssafy.chat.entity.ChatParticipant;
import com.ssafy.chat.entity.ChatRoom;
import com.ssafy.chat.repository.jpa.ChatParticipantRepository;
import com.ssafy.chat.repository.redis.ChatRoomRepository;
import com.ssafy.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 🛠️ 채팅 디버깅 및 검증용 컨트롤러
 *
 * application.yml에서 chat.debug.enabled=true 설정 시에만 활성화
 * 운영 환경에서는 비활성화 권장
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/chat/debug")
@ConditionalOnProperty(name = "chat.debug.enabled", havingValue = "true")
public class ChatDebugController {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatParticipantRepository chatParticipantRepository;
    private final ChatService chatService;

    /**
     * 🔍 특정 채팅방의 상세 정보 조회
     */
    @GetMapping("/room/{roomId}")
    public ResponseEntity<Map<String, Object>> getRoomDebugInfo(@PathVariable String roomId) {
        Map<String, Object> debugInfo = new HashMap<>();

        try {
            // ChatRoom 정보 (Redis)
            var chatRoom = chatRoomRepository.findById(roomId);
            debugInfo.put("chatRoom", chatRoom.orElse(null));

            // 참가자 정보 (MySQL)
            List<ChatParticipant> participants = chatParticipantRepository.findByRoomId(roomId);
            debugInfo.put("participants", participants);
            debugInfo.put("participantCount", participants.size());

            // 참가자 ID 리스트
            List<Long> participantIds = participants.stream()
                    .map(ChatParticipant::getMemberId)
                    .collect(Collectors.toList());
            debugInfo.put("participantIds", participantIds);

            // 1:1 채팅방인 경우 추가 검증
            if (chatRoom.isPresent()) {
                ChatRoom room = chatRoom.get();
                if (room.getChatType() == ChatRoom.ChatType.DIRECT) {
                    boolean hasUser1 = participantIds.contains(room.getUser1Id());
                    boolean hasUser2 = participantIds.contains(room.getUser2Id());

                    debugInfo.put("directChatValidation", Map.of(
                            "user1Id", room.getUser1Id(),
                            "user2Id", room.getUser2Id(),
                            "hasUser1InParticipants", hasUser1,
                            "hasUser2InParticipants", hasUser2,
                            "isValid", hasUser1 && hasUser2 && participants.size() == 2
                    ));
                }
            }

            return ResponseEntity.ok(debugInfo);

        } catch (Exception e) {
            log.error("Error getting debug info for room {}: {}", roomId, e.getMessage());
            debugInfo.put("error", e.getMessage());
            return ResponseEntity.status(500).body(debugInfo);
        }
    }

    /**
     * 🔍 특정 사용자의 채팅방 참가 현황 조회
     */
    @GetMapping("/user/{userId}/rooms")
    public ResponseEntity<Map<String, Object>> getUserRoomsDebugInfo(@PathVariable Long userId) {
        Map<String, Object> debugInfo = new HashMap<>();

        try {
            // 사용자가 참가한 채팅방 리스트
            List<ChatParticipant> participations = chatParticipantRepository.findByMemberId(userId);
            debugInfo.put("participations", participations);
            debugInfo.put("roomCount", participations.size());

            // 각 채팅방의 상세 정보
            List<Map<String, Object>> roomDetails = participations.stream()
                    .map(participation -> {
                        Map<String, Object> roomInfo = new HashMap<>();
                        String roomId = participation.getRoomId();

                        var chatRoom = chatRoomRepository.findById(roomId);
                        List<ChatParticipant> roomParticipants = chatParticipantRepository.findByRoomId(roomId);

                        roomInfo.put("roomId", roomId);
                        roomInfo.put("chatRoom", chatRoom.orElse(null));
                        roomInfo.put("allParticipants", roomParticipants);
                        roomInfo.put("participantCount", roomParticipants.size());
                        roomInfo.put("joinedAt", participation.getJoinedAt());

                        return roomInfo;
                    })
                    .collect(Collectors.toList());

            debugInfo.put("roomDetails", roomDetails);

            return ResponseEntity.ok(debugInfo);

        } catch (Exception e) {
            log.error("Error getting debug info for user {}: {}", userId, e.getMessage());
            debugInfo.put("error", e.getMessage());
            return ResponseEntity.status(500).body(debugInfo);
        }
    }

    /**
     * 🔍 전체 채팅방 현황 조회
     */
    @GetMapping("/rooms/overview")
    public ResponseEntity<Map<String, Object>> getAllRoomsOverview() {
        Map<String, Object> overview = new HashMap<>();

        try {
            // Redis의 모든 채팅방
            List<ChatRoom> allRooms = chatRoomRepository.findAll();
            overview.put("totalRoomsInRedis", allRooms.size());

            // 유효한 채팅방 (null이 아닌)
            List<ChatRoom> validRooms = allRooms.stream()
                    .filter(room -> room != null && room.getRoomId() != null)
                    .collect(Collectors.toList());
            overview.put("validRooms", validRooms.size());

            // 1:1 채팅방 검증
            List<Map<String, Object>> directChatValidation = validRooms.stream()
                    .filter(room -> room.getChatType() == ChatRoom.ChatType.DIRECT)
                    .map(room -> {
                        List<ChatParticipant> participants = chatParticipantRepository.findByRoomId(room.getRoomId());
                        List<Long> participantIds = participants.stream()
                                .map(ChatParticipant::getMemberId)
                                .collect(Collectors.toList());

                        boolean hasUser1 = participantIds.contains(room.getUser1Id());
                        boolean hasUser2 = participantIds.contains(room.getUser2Id());

                        return Map.of(
                                "roomId", room.getRoomId(),
                                "user1Id", room.getUser1Id(),
                                "user2Id", room.getUser2Id(),
                                "participantCount", participants.size(),
                                "participantIds", participantIds,
                                "hasUser1", hasUser1,
                                "hasUser2", hasUser2,
                                "isValid", hasUser1 && hasUser2 && participants.size() == 2
                        );
                    })
                    .collect(Collectors.toList());

            overview.put("directChatRooms", directChatValidation);

            // 문제가 있는 채팅방 찾기
            long invalidDirectChats = directChatValidation.stream()
                    .mapToLong(info -> (Boolean) info.get("isValid") ? 0 : 1)
                    .sum();
            overview.put("invalidDirectChats", invalidDirectChats);

            return ResponseEntity.ok(overview);

        } catch (Exception e) {
            log.error("Error getting rooms overview: {}", e.getMessage());
            overview.put("error", e.getMessage());
            return ResponseEntity.status(500).body(overview);
        }
    }

    /**
     * 🛠️ 채팅방 참가자 강제 동기화 (데이터 복구용)
     */
    @PostMapping("/room/{roomId}/sync-participants")
    public ResponseEntity<Map<String, Object>> syncRoomParticipants(@PathVariable String roomId) {
        Map<String, Object> result = new HashMap<>();

        try {
            var chatRoomOpt = chatRoomRepository.findById(roomId);
            if (chatRoomOpt.isEmpty()) {
                result.put("error", "ChatRoom not found");
                return ResponseEntity.notFound().build();
            }

            ChatRoom chatRoom = chatRoomOpt.get();
            if (chatRoom.getChatType() != ChatRoom.ChatType.DIRECT) {
                result.put("error", "Only direct chat rooms are supported");
                return ResponseEntity.badRequest().body(result);
            }

            // 기존 참가자 조회.
            List<ChatParticipant> existingParticipants = chatParticipantRepository.findByRoomId(roomId);
            result.put("existingParticipants", existingParticipants.size());

            // 필요한 참가자 추가
            chatService.addParticipant(roomId, chatRoom.getUser1Id());
            chatService.addParticipant(roomId, chatRoom.getUser2Id());

            // 동기화 후 참가자 조회
            List<ChatParticipant> newParticipants = chatParticipantRepository.findByRoomId(roomId);
            result.put("participantsAfterSync", newParticipants.size());
            result.put("participants", newParticipants);

            result.put("success", true);
            result.put("message", "Participants synchronized successfully");

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Error syncing participants for room {}: {}", roomId, e.getMessage());
            result.put("error", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }
}