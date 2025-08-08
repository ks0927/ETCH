package com.ssafy.etch.portfolio.controller;

import com.ssafy.etch.global.response.ApiResponse;
import com.ssafy.etch.oauth.dto.CustomOAuth2User;
import com.ssafy.etch.portfolio.dto.PortfolioListResponseDTO;
import com.ssafy.etch.portfolio.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/portfolios")
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<PortfolioListResponseDTO>>> getPortfolioList(
            @AuthenticationPrincipal CustomOAuth2User oAuth2User) {
        List<PortfolioListResponseDTO> list = portfolioService.getPortfolioList(oAuth2User.getId());
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(list));
    }

}
