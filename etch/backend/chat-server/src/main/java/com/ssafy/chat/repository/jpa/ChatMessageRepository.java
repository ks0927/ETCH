package com.ssafy.chat.repository.jpa;

import com.ssafy.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // 특정 채팅방의 모든 메시지를 시간 순으로 조회
    List<ChatMessage> findByRoomIdOrderBySentAtAsc(String roomId);
    // 특정 메시지 ID 이후에 온 메시지들의 개수를 세는 메서드
    long countByRoomIdAndIdGreaterThan(String roomId, Long lastReadMessageId);
    Optional<ChatMessage>  findTopByRoomIdOrderByIdDesc(String roomId);
}
