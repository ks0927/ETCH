package com.ssafy.etch.oauth.jwt.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.etch.global.exception.ErrorCode;
import com.ssafy.etch.global.response.ApiResponse;
import com.ssafy.etch.member.dto.MemberDTO;
import com.ssafy.etch.oauth.dto.CustomOAuth2User;
import com.ssafy.etch.oauth.jwt.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 헤더에서 "access" 토큰을 찾음
        String accessToken = request.getHeader("access");

        // 액세스 토큰이 없는 경우 다음 필터로 넘김
        if (accessToken == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // 토큰 만료 여부 확인
        if (jwtUtil.isExpired(accessToken)) {
            sendErrorResponse(response, ErrorCode.ACCESS_TOKEN_EXPIRED);
            return;
        }

        // 토큰이 "access" 카테고리인지 확인 (리프레시 토큰으로 API 접근 방지)
        String category = jwtUtil.getCategory(accessToken);
        if (!category.equals("access")) {
            sendErrorResponse(response, ErrorCode.ACCESS_TOKEN_INVALID);
            return;
        }

        // 토큰에서 id와 role 추출
        String email = jwtUtil.getEmail(accessToken);
        String role = jwtUtil.getRole(accessToken);

        // MemberDTO 생성
        MemberDTO memberDTO = MemberDTO.builder()
                .email(email)
                .role(role)
                .build();

        // CustomOAuth2User 객체 생성
        CustomOAuth2User customOAuth2User = new CustomOAuth2User(memberDTO);

        // Spring Security 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customOAuth2User, null, customOAuth2User.getAuthorities());
        // SecurityContext에 인증 정보 설정
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }

    private void sendErrorResponse(HttpServletResponse response, ErrorCode errorCode) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        ApiResponse<?> apiResponse = ApiResponse.error(errorCode.getMessage());
        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }
}
