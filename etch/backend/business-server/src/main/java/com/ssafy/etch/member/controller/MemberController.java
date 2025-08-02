package com.ssafy.etch.member.controller;

import com.ssafy.etch.global.response.ApiResponse;
import com.ssafy.etch.global.util.CookieUtil;
import com.ssafy.etch.member.dto.MemberDTO;
import com.ssafy.etch.member.dto.MemberResponseDTO;
import com.ssafy.etch.member.service.MemberService;
import com.ssafy.etch.oauth.dto.CustomOAuth2User;
import com.ssafy.etch.oauth.jwt.util.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;
    private final JWTUtil jwtUtil;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberDTO>> getMyInfo(@AuthenticationPrincipal CustomOAuth2User oAuth2User) {
        if (oAuth2User == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid refresh token."));
        }
        MemberDTO memberDTO = memberService.findById(oAuth2User.getId());
        return ResponseEntity.ok(ApiResponse.success(memberDTO));
    }


    @PostMapping
    public ResponseEntity<ApiResponse<Object>> registerNewMember(@AuthenticationPrincipal CustomOAuth2User oAuth2User, @RequestBody MemberDTO requestDTO, HttpServletResponse response) {
        if (oAuth2User == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("인증되지 않은 사용자입니다."));
        }

        // 회원 등록
        MemberDTO newMember = memberService.registerNewMember(requestDTO);

        // 새로운 액세스 토큰 발급
        String newAccessToken = jwtUtil.createJwt(
                "access",
                newMember.getEmail(),
                newMember.getRole(),
                newMember.getId(),
                30 * 60 * 1000L // 30분
        );

        // 새로운 리프레시 토큰을 쿠키로 전달
        Cookie refreshCookie = CookieUtil.createCookie("refresh", newMember.getRefreshToken());
        response.addCookie(refreshCookie);

        // 응답 헤더에 액세스 토큰 추가
        response.setHeader("access", newAccessToken);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(newMember,"회원가입 성공"));
    }
}
