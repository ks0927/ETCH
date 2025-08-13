package com.ssafy.chat.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "chat_read_status")
public class ChatReadStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "read_status_id")
    private Long id;

    @Column(name = "room_id", nullable = false)
    private String roomId;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    // 이 사용자가 마지막으로 읽은 메시지의 ID
    @Column(name = "last_read_message_id", nullable = false)
    private Long lastReadMessageId;

    @Builder
    public ChatReadStatus(String roomId, Long memberId, Long lastReadMessageId) {
        this.roomId = roomId;
        this.memberId = memberId;
        this.lastReadMessageId = lastReadMessageId;
    }
}