package com.ssafy.etch.global.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class FastApiConfig {

    @Bean
    @Qualifier("fastApiClient")
    public WebClient fastApiWebClient() {
        return WebClient.builder()
//                .baseUrl("http://localhost:8000") // local FastAPI 서버 주소
                .baseUrl("https://etch.it.kr/api/recommend/") // (추천서버)FastAPI 배포서버 주소
                .defaultHeader("Content-Type", "application/json")
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build();
    }
}