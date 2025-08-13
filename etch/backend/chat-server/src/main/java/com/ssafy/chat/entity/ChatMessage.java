package com.ssafy.chat.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "chat_message")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long id;

    @Column(name = "room_id", nullable = false)
    private String roomId;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "sender_nickname", nullable = false)
    private String senderNickname;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "unread_count", nullable = false)
    private int unreadCount; // 안 읽은 사람 수를 저장할 필드

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;

    @Builder
    public ChatMessage(String roomId, Long senderId, String senderNickname, String message, LocalDateTime sentAt, int unreadCount) { // 빌더에 unreadCount 추가
        this.roomId = roomId;
        this.senderId = senderId;
        this.senderNickname = senderNickname;
        this.message = message;
        this.sentAt = sentAt;
        this.unreadCount = unreadCount;
    }
}