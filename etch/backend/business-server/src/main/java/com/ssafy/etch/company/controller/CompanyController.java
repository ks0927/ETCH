package com.ssafy.etch.company.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.etch.company.dto.CompanyInfoDTO;
import com.ssafy.etch.company.service.CompanyService;

@RestController
@RequestMapping("/companies")
public class CompanyController {

	private final CompanyService companyService;

	public CompanyController(CompanyService companyService) {
		this.companyService = companyService;
	}

	// 기업정보
	@GetMapping("/{id}")
	public ResponseEntity<CompanyInfoDTO> getCompanyInfo(@PathVariable long id) {
		CompanyInfoDTO companyInfo = companyService.getCompanyInfo(id);

		return ResponseEntity.ok(companyInfo);
	}

}
