// business-server/src/test/java/com/ssafy/etch/EtchApplicationTests.java

package com.ssafy.etch;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

// ⭐️ [수정] @EnableAutoConfiguration 어노테이션을 사용하여
// 테스트 시 Redis 관련 자동 설정을 명시적으로 제외합니다.
@EnableAutoConfiguration(exclude = {RedisAutoConfiguration.class, RedisRepositoriesAutoConfiguration.class})
@SpringBootTest
class EtchApplicationTests {

    @Test
    void contextLoads() {
    }

}
