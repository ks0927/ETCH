// business-server/src/test/java/com/ssafy/etch/EtchApplicationTests.java

package com.ssafy.etch;

import com.ssafy.etch.global.config.SecurityConfig;
import com.ssafy.etch.health.healthController;
import com.ssafy.etch.oauth.handler.CustomSuccessHandler;
import com.ssafy.etch.oauth.jwt.util.JWTUtil;
import com.ssafy.etch.oauth.service.CustomOAuth2UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * ⭐️ [최종 수정]
 * @WebMvcTest를 통해 웹 레이어만 테스트합니다.
 * @Import로 SecurityConfig를 가져오는 것은 유지하되,
 * SecurityConfig가 의존하는 Bean들(@Service, @Component 등)은
 * @MockBean을 사용하여 가짜(Mock) 객체로 대체합니다.
 * 이렇게 하면 실제 로직이나 DB, Redis 연결 없이 순수하게 Controller와 보안 설정의 통합만 테스트할 수 있습니다.
 */
@WebMvcTest(controllers = healthController.class)
@Import(SecurityConfig.class)
class EtchApplicationTests {

    @Autowired
    private MockMvc mvc;

    // SecurityConfig가 의존하는 Bean들을 MockBean으로 주입합니다.
    // @WebMvcTest는 이 Bean들을 자동으로 스캔하지 않으므로,
    // 가짜 객체를 만들어 SecurityConfig를 생성할 수 있도록 제공해야 합니다.
    @MockBean
    private CustomOAuth2UserService customOAuth2UserService;
    @MockBean
    private CustomSuccessHandler customSuccessHandler;
    @MockBean
    private JWTUtil jwtUtil;


    @Test
    @WithMockUser // Spring Security가 적용된 환경에서 인증된 사용자인 것처럼 테스트를 실행합니다.
    void contextLoadsAndHealthCheck() throws Exception {
        // MockMvc를 사용하여 실제 HTTP 요청처럼 /health 엔드포인트를 호출합니다.
        mvc.perform(get("/health"))
                .andExpect(status().isOk()) // 상태 코드가 200 OK인지 확인
                .andExpect(content().string("spring server is health!")); // 응답 본문이 예상과 같은지 확인
    }

}
