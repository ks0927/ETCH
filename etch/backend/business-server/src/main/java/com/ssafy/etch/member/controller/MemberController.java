package com.ssafy.etch.member.controller;

import com.ssafy.etch.global.response.ApiResponse;
import com.ssafy.etch.global.util.CookieUtil;
import com.ssafy.etch.member.dto.MemberDTO;
import com.ssafy.etch.member.dto.MemberRequestDTO;
import com.ssafy.etch.member.dto.MemberResponseDTO;
import com.ssafy.etch.member.service.MemberService;
import com.ssafy.etch.oauth.dto.CustomOAuth2User;
import com.ssafy.etch.oauth.jwt.util.JWTUtil;
import com.ssafy.etch.project.dto.ProjectListDTO;
import com.ssafy.etch.project.service.ProjectService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(
    name = "Members",
    description = "Members Controller 입니다."
)
@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;
    private final JWTUtil jwtUtil;
    private final ProjectService projectService;

    @Operation(
        summary = "마이페이지 API",
        description = "마이페이지를 조회할 수 있습니다."
    )
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberResponseDTO>> getMyInfo(@AuthenticationPrincipal CustomOAuth2User oAuth2User) {
        if (oAuth2User == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid refresh token."));
        }
        MemberResponseDTO memberDTO = MemberResponseDTO.from(memberService.findById(oAuth2User.getId()));
        return ResponseEntity.ok(ApiResponse.success(memberDTO));
    }

    @Operation(
        summary = "회원가입 API",
        description = "회원가입을 할 수 있습니다."
    )
    @PostMapping
    public ResponseEntity<ApiResponse<Object>> registerNewMember(@AuthenticationPrincipal CustomOAuth2User oAuth2User, @RequestBody MemberDTO requestDTO, HttpServletResponse response) {
        if (oAuth2User == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("인증되지 않은 사용자입니다."));
        }

        // 회원 등록
        MemberDTO newMember = memberService.registerNewMember(oAuth2User.getEmail(), requestDTO);

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
        response.setHeader("Authorization", newAccessToken);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(newMember,"회원가입 성공"));
    }

    @Operation(
        summary = "다른 회원 프로필 조회 API",
        description = "다른 회원의 프로필을 조회할 수 있습니다."
    )
    @GetMapping("/{id}")
    public ResponseEntity<?> getMemberInfo(@PathVariable("id") Long id) {
        MemberDTO memberDTO = memberService.findById(id);

        MemberResponseDTO responseDTO = MemberResponseDTO.from(memberDTO);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(responseDTO));
    }

    @Operation(
        summary = "회원 탈퇴 API",
        description = "본인 계정을 탈퇴를 할 수 있습니다."
    )
    @DeleteMapping
    public ResponseEntity<ApiResponse<?>> deleteMember(@AuthenticationPrincipal CustomOAuth2User oAuth2User) {
        memberService.deleteMember(oAuth2User.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "회원 탈퇴가 완료되었습니다."));
    }

    @Operation(
        summary = "회원 정보 수정 API",
        description = "본인 계정에 대한 정보를 수정할 수 있습니다."
    )
    @PutMapping
    public ResponseEntity<ApiResponse<?>> updateMemberInfo(
            @AuthenticationPrincipal CustomOAuth2User oAuth2User,
            @RequestBody MemberRequestDTO memberRequestDTO) {

        MemberDTO memberDTO = memberService.updateMember(oAuth2User.getId(), memberRequestDTO);
        return ResponseEntity.ok(ApiResponse.success(MemberResponseDTO.from(memberDTO), "회원 정보가 수정되었습니다."));
    }

    @Operation(
        summary = "마이페이지 내 프로젝트 목록 조회",
        description = "내 프로젝트 목록 조회(비공개 프로젝트 포함)"
    )
    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<ProjectListDTO>>> getProjectList(
            @AuthenticationPrincipal CustomOAuth2User oAuth2User) {

        List<ProjectListDTO> list = memberService.findAllProjectByMemberId(oAuth2User.getId());

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(list));
    }

    @Operation(
        summary = "다른 사람 프로젝트 목록 조회",
        description = "다른 사람의 공개된 프로젝트 목록 조회"
    )
    @GetMapping("/{id}/projects")
    public ResponseEntity<ApiResponse<List<ProjectListDTO>>> getPublicProjectByUser(
        @PathVariable("id") Long id,
        @AuthenticationPrincipal CustomOAuth2User user,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "9") int pageSize) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("로그인이 필요합니다."));
        }

        List<ProjectListDTO> list = projectService.getPublicProjectByUser(id, page, pageSize);

        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
