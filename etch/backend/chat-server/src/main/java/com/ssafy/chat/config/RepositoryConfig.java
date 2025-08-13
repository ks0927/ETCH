package com.ssafy.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

@Configuration
@EnableJpaRepositories(
        basePackages = "com.ssafy.chat.repository.jpa" // JPA 관련 Repo 경로
)
@EnableRedisRepositories(
        basePackages = "com.ssafy.chat.repository.redis" // Redis 관련 Repo 경로
)
public class RepositoryConfig {
}