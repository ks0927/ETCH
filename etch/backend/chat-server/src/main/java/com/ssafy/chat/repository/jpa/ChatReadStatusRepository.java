package com.ssafy.chat.repository.jpa;

import com.ssafy.chat.entity.ChatReadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ChatReadStatusRepository extends JpaRepository<ChatReadStatus, Long> {

    // 특정 사용자의 특정 채팅방 읽기 상태를 조회
    Optional<ChatReadStatus> findByRoomIdAndMemberId(String roomId, Long memberId);
}
