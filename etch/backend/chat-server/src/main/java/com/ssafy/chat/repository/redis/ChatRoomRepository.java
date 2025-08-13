package com.ssafy.chat.repository.redis;

import com.ssafy.chat.entity.ChatRoom;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

// Redis를 사용하므로 CrudRepository를 상속
public interface ChatRoomRepository extends CrudRepository<ChatRoom, String> {
    // 모든 채팅방을 생성 시간 순으로 정렬하여 반환 (필요시 구현)
    @Override
    List<ChatRoom> findAll();
}
