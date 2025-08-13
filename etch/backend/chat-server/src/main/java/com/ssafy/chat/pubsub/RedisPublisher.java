package com.ssafy.chat.pubsub;

import com.ssafy.chat.dto.ChatMessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RedisPublisher {

    private final RedisTemplate<String, Object> redisTemplate;

    public void publish(String topic, ChatMessageDto message) {
        redisTemplate.convertAndSend(topic, message);
    }
}