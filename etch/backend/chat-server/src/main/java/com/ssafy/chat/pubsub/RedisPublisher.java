package com.ssafy.chat.pubsub;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.chat.dto.ChatMessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisPublisher {

    private final RedisTemplate<String, String> chatMessageRedisTemplate; // 전용 템플릿 사용
    private final ObjectMapper objectMapper;

    public void publish(String topic, ChatMessageDto message) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(message);
            chatMessageRedisTemplate.convertAndSend(topic, jsonMessage);
        } catch (Exception e) {
            log.error("메시지 발행 실패: {}", e.getMessage());
        }
    }
}