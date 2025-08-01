package com.ssafy.etch.oauth.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JWTUtil jwtUtil;
    private final MemberRepository memberRepository;

    public CustomSuccessHandler(JWTUtil jwtUtil, MemberRepository memberRepository) {
        this.jwtUtil = jwtUtil;
        this.memberRepository = memberRepository;
    }

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        // OAuth2User
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        String email = customUserDetails.getEmail();
        String role = customUserDetails.getRole();

        String accessToken = null;
        if ("USER".equals(role)) {
            Long id = customUserDetails.getId();
            // 액세스 토큰 및 리프레시 토큰 생성
            accessToken = jwtUtil.createJwt("access", email, role, id, 600000L); // 10분
            String refreshToken = jwtUtil.createJwt("refresh", email, role, id, 86400000L); // 24시간

            // DB에 리프레시 토큰 저장
            MemberEntity memberEntity = memberRepository.findByEmail(email);
            if (memberEntity != null) {
                MemberEntity.updateRefreshToken(memberEntity, refreshToken);
                memberRepository.save(memberEntity);
            }

            response.addCookie(CookieUtil.createCookie("refresh", refreshToken));
        } else if ("GUEST".equals(role)) {
            accessToken = jwtUtil.createJwt("access", email, role, null, 600000L); // 10분                                               │
        }
        String redirectUrl = "http://localhost:3000/login?token=" + accessToken;

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
