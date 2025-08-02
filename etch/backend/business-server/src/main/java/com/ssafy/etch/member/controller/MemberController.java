package com.ssafy.etch.member.controller;

import com.ssafy.etch.global.response.ApiResponse;
import com.ssafy.etch.member.dto.MemberDTO;
import com.ssafy.etch.member.dto.MemberResponseDTO;
import com.ssafy.etch.member.service.MemberService;
import com.ssafy.etch.oauth.dto.CustomOAuth2User;
import com.ssafy.etch.oauth.jwt.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberDTO>> getMyInfo(@AuthenticationPrincipal CustomOAuth2User oAuth2User) {
        if (oAuth2User == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid refresh token."));
        }
        MemberDTO memberDTO = memberService.findById(oAuth2User.getId());
        return ResponseEntity.ok(ApiResponse.success(memberDTO));
    }

}
