package com.ssafy.chat.interceptor;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        // STOMP 연결 요청(CONNECT) 시 JWT 토큰 검증
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // 헤더에서 "Authorization" 키로 토큰을 가져옴
            String jwtToken = accessor.getFirstNativeHeader("Authorization");

            // 토큰 유효성 검증
            if (jwtToken != null && jwtToken.startsWith("Bearer ")) {
                String token = jwtToken.substring(7);
                try {
                    // 안전한 토큰 검증 사용
                    if (!jwtUtil.isValidToken(token)) {
                        throw new IllegalArgumentException("Invalid or expired token");
                    }
                    // 추가적인 유저 정보 확인 로직이 필요하다면 여기에 구현
                    System.out.println("WebSocket connection authenticated for user: " + jwtUtil.getId(token));
                } catch (Exception e) {
                    // 유효하지 않은 토큰일 경우 예외 발생 (연결 종료)
                    System.out.println("WebSocket authentication failed: " + e.getMessage());
                    throw new IllegalArgumentException("Token validation failed: " + e.getMessage());
                }
            } else {
                System.out.println("No valid Authorization header found in WebSocket connection");
                throw new IllegalArgumentException("Token not found");
            }
        }
        return message;
    }
}