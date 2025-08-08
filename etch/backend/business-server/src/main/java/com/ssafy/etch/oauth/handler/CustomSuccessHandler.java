package com.ssafy.etch.oauth.handler;

import com.ssafy.etch.global.util.CookieUtil;
import com.ssafy.etch.member.entity.MemberEntity;
import com.ssafy.etch.member.repository.MemberRepository;
import com.ssafy.etch.oauth.dto.CustomOAuth2User;
import com.ssafy.etch.oauth.jwt.util.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
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
            accessToken = jwtUtil.createJwt("access", email, role, id, 30 * 60 * 1000L); // 30분
            String refreshToken = jwtUtil.createJwt("refresh", email, role, id,  24 * 60 * 60 * 1000L); // 24시간

            // DB에 리프레시 토큰 저장
            memberRepository.findById(id).ifPresent(memberEntity -> MemberEntity.updateRefreshToken(memberEntity, refreshToken));

            response.addCookie(CookieUtil.createCookie("refresh", refreshToken));
        } else if ("GUEST".equals(role)) {
            accessToken = jwtUtil.createJwt("access", email, role, null, 30 * 60 * 1000L); // 30분                                               │
        }
        //String redirectUrl = "http://localhost:3000/login?token=" + accessToken;

        // ⭐️ [수정] 로그인 성공 후 리디렉션될 프론트엔드 주소를 변경합니다.
        String redirectUrl = "https://etch.it.kr/login?token=" + accessToken;

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
