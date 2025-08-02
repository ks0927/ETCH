package com.ssafy.etch.oauth.controller;

import com.ssafy.etch.global.response.ApiResponse;
import com.ssafy.etch.member.dto.MemberDTO;
import com.ssafy.etch.member.service.MemberService;
import com.ssafy.etch.oauth.jwt.util.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final JWTUtil jwtUtil;
    private final MemberService memberService;

    // 리프레시 토큰을 이용해 새로운 액세스 토큰을 발급하는 엔드포인트
    @PostMapping("/reissue")
    public ResponseEntity<ApiResponse<?>> reissue(HttpServletRequest request, HttpServletResponse response) {
        // 요청에서 "refresh" 쿠키를 찾음
        Cookie[] cookies = request.getCookies();
        String refreshToken = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refresh")) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        // 쿠키에 리프레시 토큰이 없는 경우
        if (refreshToken == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Refresh token is missing."));
        }

        // 리프레시 토큰 만료 확인
        if (jwtUtil.isExpired(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Refresh token is expired."));
        }

        // 토큰이 "refresh" 카테고리인지 확인
        String category = jwtUtil.getCategory(refreshToken);
        if (!category.equals("refresh")) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid token category."));
        }

        // DB에 저장된 리프레시 토큰과 일치하는지 확인
        String id = jwtUtil.getId(refreshToken);
        MemberDTO memberDTO = memberService.findById(Long.parseLong(id));
        if (memberDTO.getRefreshToken().equals(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid refresh token."));
        }

        // 새로운 액세스 토큰 발급
        String newAccessToken = jwtUtil.createJwt("access", memberDTO.getEmail(), memberDTO.getRole(), memberDTO.getId(), 600000L); // 10분

        // 응답 헤더에 새로운 액세스 토큰 추가
        response.setHeader("access", newAccessToken);

        return ResponseEntity.ok(ApiResponse.success(null, "Access token has been reissued."));
    }
}
