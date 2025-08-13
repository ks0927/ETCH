package com.ssafy.chat.repository.jpa;

import com.ssafy.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // 특정 채팅방의 모든 메시지를 시간 순으로 조회
    List<ChatMessage> findByRoomIdOrderBySentAtAsc(String roomId);
}
