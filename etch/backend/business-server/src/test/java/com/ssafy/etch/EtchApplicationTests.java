// business-server/src/test/java/com/ssafy/etch/EtchApplicationTests.java

package com.ssafy.etch;

import com.ssafy.etch.health.healthController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * ⭐️ [최종 수정]
 * @SpringBootTest 대신 @WebMvcTest를 사용하여 웹 레이어(Controller)만 테스트합니다.
 * 이렇게 하면 DB, Redis, JWT 등 무거운 외부 의존성 설정 없이도
 * Controller가 올바르게 설정되었는지 가볍고 빠르게 확인할 수 있습니다.
 * 이것이 CI/CD 파이프라인에서 단위 테스트를 실행하는 표준적인 방법입니다.
 */
@WebMvcTest(controllers = healthController.class)
@Import(com.ssafy.etch.global.config.SecurityConfig.class) // SecurityConfig를 명시적으로 Import
class EtchApplicationTests {

    // MockMvc는 실제 서버를 띄우지 않고, 가짜 HTTP 요청을 보내 컨트롤러를 테스트하게 해줍니다.
    @Autowired
    private MockMvc mvc;

    @Test
    @WithMockUser // Spring Security가 적용된 환경에서 인증된 사용자인 것처럼 테스트
    void contextLoadsAndHealthCheck() throws Exception {
        // 이제 contextLoads 테스트는 단순히 설정이 로드되는 것을 넘어,
        // 실제 /health 엔드포인트가 예상대로 동작하는지까지 검증합니다.
        mvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("spring server is health!"));
    }

}
