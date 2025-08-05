package com.ssafy.etch.company.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.etch.company.dto.CompanyDTO;
import com.ssafy.etch.company.dto.CompanyInfoDTO;
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

	// 좋아요가 많은 순으로 정렬한 10개의 기업
	@GetMapping("/top10")
	public ResponseEntity<ApiResponse<List<CompanyRankingDTO>>> getTop10() {
		List<CompanyRankingDTO> top10 = companyService.getTop10();

		return ResponseEntity.ok(ApiResponse.success(top10));
	}

	// 기업정보
	@GetMapping("/{id}")
	public ResponseEntity<CompanyInfoDTO> getCompanyInfo(@PathVariable long id) {
		CompanyInfoDTO companyInfo = companyService.getCompanyInfo(id);

		return ResponseEntity.ok(companyInfo);
	}

}
