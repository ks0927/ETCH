// business-server/src/test/java/com/ssafy/etch/EtchApplicationTests.java

package com.ssafy.etch;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;

@SpringBootTest
class EtchApplicationTests {

    // ⭐️ [추가] 테스트 환경에서는 실제 Redis에 연결할 수 없으므로,
    // NewsServiceImpl 등이 의존하는 RedisTemplate 관련 Bean들을 가짜(Mock) Bean으로 대체합니다.
    @MockBean
    private RedisTemplate<String, Object> redisTemplate;

    @MockBean
    private StringRedisTemplate stringRedisTemplate;


    @Test
    void contextLoads() {
        // 이 테스트는 Spring 애플리케이션의 모든 설정(Bean)이
        // 외부 서비스(DB, Redis 등) 연결 없이도 성공적으로 로드되는지 확인합니다.
    }

}
