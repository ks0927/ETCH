package com.ssafy.etch.like.controller;

import com.ssafy.etch.global.response.ApiResponse;
import com.ssafy.etch.like.dto.LikeRequestDTO;
import com.ssafy.etch.like.entity.LikeType;
import com.ssafy.etch.like.service.LikeService;
import com.ssafy.etch.oauth.dto.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/likes")
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/news")
    public ResponseEntity<ApiResponse<Object>> createLikeNews(@AuthenticationPrincipal CustomOAuth2User oAuth2User,
                                                              @RequestBody LikeRequestDTO likeRequestDTO) {
        if (oAuth2User == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증되지 않은 사용자입니다."));
        }

        likeService.saveLike(oAuth2User.getId(), likeRequestDTO, LikeType.NEWS);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(null, "뉴스 좋아요가 등록되었습니다."));
    }
    @DeleteMapping("/news/{id}")
    public ResponseEntity<ApiResponse<?>> deleteLikeNews(@AuthenticationPrincipal CustomOAuth2User oAuth2User,
                                                         @PathVariable Long id) {
        if (oAuth2User == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증되지 않은 사용자입니다."));
        }
        likeService.deleteLike(oAuth2User.getId(), id, LikeType.NEWS);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(null, "뉴스 좋아요가 삭제되었습니다."));
    }

    @PostMapping("/companies")
    public ResponseEntity<ApiResponse<Object>> createLikeCompany(@AuthenticationPrincipal CustomOAuth2User oAuth2User,
                                                              @RequestBody LikeRequestDTO likeRequestDTO) {
        if (oAuth2User == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증되지 않은 사용자입니다."));
        }

        likeService.saveLike(oAuth2User.getId(), likeRequestDTO, LikeType.COMPANY);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(null, "기업 좋아요가 등록되었습니다."));
    }

    @PostMapping("/jobs")
    public ResponseEntity<ApiResponse<Object>> createLikeJob(@AuthenticationPrincipal CustomOAuth2User oAuth2User,
                                                                 @RequestBody LikeRequestDTO likeRequestDTO) {
        if (oAuth2User == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증되지 않은 사용자입니다."));
        }

        likeService.saveLike(oAuth2User.getId(), likeRequestDTO, LikeType.JOB);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(null, "공고 좋아요가 등록되었습니다."));
    }

    @PostMapping("/projects")
    public ResponseEntity<ApiResponse<Object>> createLikeProject(@AuthenticationPrincipal CustomOAuth2User oAuth2User,
                                                             @RequestBody LikeRequestDTO likeRequestDTO) {
        if (oAuth2User == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("인증되지 않은 사용자입니다."));
        }

        likeService.saveLike(oAuth2User.getId(), likeRequestDTO, LikeType.PROJECT);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(null, "프로젝트 좋아요가 등록되었습니다."));
    }
}
