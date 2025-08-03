package com.ssafy.etch.company.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.etch.company.dto.CompanyRankingDTO;
import com.ssafy.etch.company.service.CompanyService;
import com.ssafy.etch.global.response.ApiResponse;

@RestController
@RequestMapping("/companies")
public class CompanyController {

	private final CompanyService companyService;

	public CompanyController(CompanyService companyService) {
		this.companyService = companyService;
	}

	@GetMapping("/top10")
	public ResponseEntity<ApiResponse<List<CompanyRankingDTO>>> getTop10() {
		List<CompanyRankingDTO> top10 = companyService.getTop10();

		return ResponseEntity.ok(ApiResponse.success(top10));
	}
}
