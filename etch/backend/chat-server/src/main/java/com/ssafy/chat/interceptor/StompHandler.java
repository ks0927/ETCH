package com.ssafy.chat.interceptor;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String jwtToken = accessor.getFirstNativeHeader("Authorization");

            if (jwtToken != null && jwtToken.startsWith("Bearer ")) {
                String token = jwtToken.substring(7);
                try {
                    if (jwtUtil.isValidToken(token)) {
                        log.info("WebSocket connection authenticated for user: {}", jwtUtil.getId(token));
                    } else {
                        log.warn("WebSocket authentication failed: Invalid or expired token");
                        return null; // 유효하지 않은 토큰이면 연결을 진행하지 않음
                    }
                } catch (Exception e) {
                    log.error("Token validation error: {}", e.getMessage());
                    return null; // 예외 발생 시 연결 중단
                }
            } else {
                log.warn("WebSocket connection attempt without token.");
                return null; // 토큰이 없으면 연결을 진행하지 않음
            }
        }
        return message;
    }
}