package com.ssafy.chat.config;
import com.ssafy.chat.interceptor.StompHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // STOMP 활성화
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompHandler stompHandler;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 클라이언트에서 메시지 수신 시 붙여줄 prefix 설정 (/sub)
        // /sub/chat/room/{roomId} 와 같은 토픽을 구독(subscribe)
        registry.enableSimpleBroker("/sub");

        // 클라이언트에서 메시지 송신 시 붙여줄 prefix 설정 (/pub)
        // /pub/chat/message 와 같은 경로로 메시지를 발행(publish)
        registry.setApplicationDestinationPrefixes("/pub");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket 또는 SockJS 클라이언트가 연결을 시도할 엔드포인트
        // ws://localhost:8081/ws-stomp
        registry.addEndpoint("/ws-stomp")
                .setAllowedOriginPatterns("*") // CORS 설정
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // STOMP 연결 시 JWT 인증을 위한 인터셉터 등록
        registration.interceptors(stompHandler);
    }
}