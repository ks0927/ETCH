package com.ssafy.chat.repository.jpa;

import com.ssafy.chat.entity.ChatParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatParticipantRepository extends JpaRepository<ChatParticipant, Long> {
    Optional<ChatParticipant> findByRoomIdAndMemberId(String roomId, Long memberId);
    // 특정 채팅방의 총 참여자 수를 세는 메소드
    int countByRoomId(String roomId);

    List<ChatParticipant> findByMemberId(Long memberId);

    // 🆕 추가 메서드 - 특정 채팅방의 모든 참가자 조회
    List<ChatParticipant> findByRoomId(String roomId);

    // 🆕 특정 사용자가 특정 채팅방에 참가하고 있는지 확인
    boolean existsByRoomIdAndMemberId(String roomId, Long memberId);

    // 🆕 특정 채팅방의 참가자 ID 리스트만 조회 (성능 최적화)
    @Query("SELECT cp.memberId FROM ChatParticipant cp WHERE cp.roomId = :roomId")
    List<Long> findMemberIdsByRoomId(@Param("roomId") String roomId);

    // 🆕 특정 사용자의 참가 채팅방 ID 리스트만 조회 (성능 최적화)
    @Query("SELECT cp.roomId FROM ChatParticipant cp WHERE cp.memberId = :memberId")
    List<String> findRoomIdsByMemberId(@Param("memberId") Long memberId);
}