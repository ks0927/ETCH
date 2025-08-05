package com.ssafy.etch.oauth.service;

import com.ssafy.etch.global.exception.CustomException;
import com.ssafy.etch.global.exception.ErrorCode;
import com.ssafy.etch.global.util.CookieUtil;
import com.ssafy.etch.member.dto.MemberDTO;
import com.ssafy.etch.member.service.MemberService;
import com.ssafy.etch.oauth.jwt.util.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final JWTUtil jwtUtil;
    private final MemberService memberService;

    @Override
    public void reissueToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = CookieUtil.getCookieValue(request.getCookies(), "refresh");

        if (refreshToken == null) {
            throw new CustomException(ErrorCode.REFRESH_TOKEN_INVALID);
        }

        if (jwtUtil.isExpired(refreshToken)) {
            throw new CustomException(ErrorCode.REFRESH_TOKEN_EXPIRED);
        }

        String category = jwtUtil.getCategory(refreshToken);
        if (!category.equals("refresh")) {
            throw new CustomException(ErrorCode.REFRESH_TOKEN_INVALID);
        }

        Long id = jwtUtil.getId(refreshToken);
        MemberDTO memberDTO = memberService.findById(id);
        if (!memberDTO.getRefreshToken().equals(refreshToken)) {
            throw new CustomException(ErrorCode.REFRESH_TOKEN_INVALID);
        }

        // 새로운 액세스 토큰 발급
        String newAccessToken = jwtUtil.createJwt("access", memberDTO.getEmail(), memberDTO.getRole(), memberDTO.getId(), 30 * 60 * 1000L); // 30분

        // 새로운 리프레시 토큰도 발급
        String newRefreshToken = jwtUtil.createJwt("refresh", memberDTO.getEmail(), memberDTO.getRole(), memberDTO.getId(), 24 * 60 * 60 * 1000L); // 1일

        // DB에 리프레시 토큰 업데이트
        memberService.updateRefreshToken(memberDTO.getId(), newRefreshToken);

        // 응답 헤더에 새로운 액세스 토큰 추가
        response.setHeader("Authorization", newAccessToken);
        // 쿠키로 전달
        Cookie refreshCookie = CookieUtil.createCookie("refresh", newRefreshToken);
        response.addCookie(refreshCookie);
    }
}

