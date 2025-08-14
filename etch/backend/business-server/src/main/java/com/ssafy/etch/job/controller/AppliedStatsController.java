package com.ssafy.etch.job.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.etch.global.response.ApiResponse;
import com.ssafy.etch.job.dto.AppliedRatesResponseDTO;
import com.ssafy.etch.job.dto.MonthlyItemDTO;
import com.ssafy.etch.job.service.AppliedStatsService;
import com.ssafy.etch.oauth.dto.CustomOAuth2User;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/stats")
@RequiredArgsConstructor
public class AppliedStatsController {
	private final AppliedStatsService appliedStatsService;

	@GetMapping("/rates")
	public ResponseEntity<ApiResponse<AppliedRatesResponseDTO>> getRates(
		@AuthenticationPrincipal CustomOAuth2User oAuth2User,
		@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
		@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

		AppliedRatesResponseDTO rates = appliedStatsService.getRates(oAuth2User.getId(), from, to);
		return ResponseEntity.ok(ApiResponse.success(rates));
	}

	@GetMapping("/monthly")
	ResponseEntity<ApiResponse<List<MonthlyItemDTO>>> getMonthly(@AuthenticationPrincipal CustomOAuth2User oAuth2User,
		@RequestParam int year,
		@RequestParam int month,
		@RequestParam(defaultValue = "true") boolean excludeScheduled) {

		List<MonthlyItemDTO> monthlyItemDTOList = appliedStatsService.getMonthlyCounts(oAuth2User.getId(), year, month,
			excludeScheduled);
		return ResponseEntity.ok(ApiResponse.success(monthlyItemDTOList));
	}
}
