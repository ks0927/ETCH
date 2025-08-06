// business-server/src/test/java/com/ssafy/etch/EtchApplicationTests.java

package com.ssafy.etch;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

// ⭐️ [수정] @SpringBootTest 어노테이션에 exclude 옵션을 추가하여,
// 테스트 시 Redis 자동 설정을 완전히 제외시킵니다.
@SpringBootTest(exclude = {RedisAutoConfiguration.class, RedisRepositoriesAutoConfiguration.class})
class EtchApplicationTests {

    // 이전의 @MockBean 어노테이션들은 이제 필요 없으므로 삭제합니다.

    @Test
    void contextLoads() {
        // 이 테스트는 이제 DB, Redis 같은 외부 서비스 연결을 시도하지 않고
        // 순수하게 애플리케이션의 내부 로직 설정이 올바른지만을 검증하게 됩니다.
    }

}
