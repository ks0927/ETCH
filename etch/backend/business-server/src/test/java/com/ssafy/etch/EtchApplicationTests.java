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

    // SecurityConfig가 의존하는 Bean들을 MockBean으로 주입
    @MockBean
    private CustomOAuth2UserService customOAuth2UserService;
    @MockBean
    private CustomSuccessHandler customSuccessHandler;
    @MockBean
    private JWTUtil jwtUtil;


    @Test
    @WithMockUser
    void contextLoadsAndHealthCheck() throws Exception {
        mvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("spring server is health!"));
    }

}
