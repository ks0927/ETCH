package com.ssafy.chat.repository.jpa;

import com.ssafy.chat.entity.ChatParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatParticipantRepository extends JpaRepository<ChatParticipant, Long> {
    Optional<ChatParticipant> findByRoomIdAndMemberId(String roomId, Long memberId);
}