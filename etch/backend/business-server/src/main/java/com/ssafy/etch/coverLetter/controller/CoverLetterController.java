package com.ssafy.etch.coverLetter.controller;

import com.ssafy.etch.coverLetter.dto.CoverLetterListResponseDTO;
import com.ssafy.etch.global.response.ApiResponse;
import com.ssafy.etch.oauth.dto.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/coverletters")
public class CoverLetterController {

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<CoverLetterListResponseDTO>>> list(
            @AuthenticationPrincipal CustomOAuth2User oAuth2User) {



        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(null,null));
    }
}
