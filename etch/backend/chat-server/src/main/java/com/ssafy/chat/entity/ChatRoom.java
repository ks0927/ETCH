package com.ssafy.chat.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@RedisHash(value = "chat_room")
public class ChatRoom implements Serializable {

    private static final long serialVersionUID = 6494678977089006639L;

    @Id
    private String roomId;

    private String roomName;

    // 채팅방 타입 (GROUP: 그룹채팅, DIRECT: 1:1채팅)
    private ChatType chatType;

    // 1:1 채팅방의 경우 사용자 정보
    private Long user1Id;
    private String user1Nickname;
    private Long user2Id;
    private String user2Nickname;

    private LocalDateTime createdAt;

    public enum ChatType {
        GROUP, DIRECT
    }

    // 그룹 채팅방 생성
    public static ChatRoom create(String name) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.roomId = UUID.randomUUID().toString();
        chatRoom.roomName = name;
        chatRoom.chatType = ChatType.GROUP;
        chatRoom.createdAt = LocalDateTime.now();
        return chatRoom;
    }

    // 1:1 채팅방 생성
    public static ChatRoom createDirectChat(Long user1Id, String user1Nickname, Long user2Id, String user2Nickname) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.roomId = UUID.randomUUID().toString();
        chatRoom.chatType = ChatType.DIRECT;
        chatRoom.user1Id = user1Id;
        chatRoom.user1Nickname = user1Nickname;
        chatRoom.user2Id = user2Id;
        chatRoom.user2Nickname = user2Nickname;
        // 1:1 채팅방의 기본 이름은 null (사용자별로 다르게 표시)
        chatRoom.roomName = null;
        chatRoom.createdAt = LocalDateTime.now();
        return chatRoom;
    }

    // 특정 사용자에게 보여질 채팅방 이름 반환
    public String getDisplayNameForUser(Long userId) {
        if (chatType == ChatType.GROUP) {
            return roomName;
        } else if (chatType == ChatType.DIRECT) {
            if (userId.equals(user1Id)) {
                return user2Nickname;
            } else if (userId.equals(user2Id)) {
                return user1Nickname;
            }
        }
        return roomName;
    }

    // 1:1 채팅방에서 상대방 ID 반환
    public Long getOtherUserId(Long userId) {
        if (chatType == ChatType.DIRECT) {
            if (userId.equals(user1Id)) {
                return user2Id;
            } else if (userId.equals(user2Id)) {
                return user1Id;
            }
        }
        return null;
    }

    // 1:1 채팅방에 특정 사용자가 포함되어 있는지 확인
    public boolean containsUser(Long userId) {
        if (chatType == ChatType.DIRECT) {
            return userId.equals(user1Id) || userId.equals(user2Id);
        }
        return false;
    }
}