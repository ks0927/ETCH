package com.ssafy.etch.news.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.etch.global.response.ApiResponse;
import com.ssafy.etch.news.dto.CompanyNewsDTO;
import com.ssafy.etch.news.dto.LatestNewsDTO;
import com.ssafy.etch.news.service.NewsServiceImpl;

@RestController
@RequestMapping("/news")
public class NewsController {

	private final NewsServiceImpl newsService;

	public NewsController(NewsServiceImpl newsService) {
		this.newsService = newsService;
	}

	// 특정 기업에 대한 기사 목록
	@GetMapping("/companies/{companyId}")
	public ResponseEntity<ApiResponse<List<CompanyNewsDTO>>> getNewsListByCompany(@PathVariable Long companyId) {
		List<CompanyNewsDTO> list = newsService.getNewsByCompanyId(companyId);

		return ResponseEntity.ok(ApiResponse.success(list));
	}

	// 최근 뉴스
	@GetMapping("/latest") 
	public ResponseEntity<ApiResponse<List<LatestNewsDTO>>> getLatestNews() {
		List<LatestNewsDTO> list = newsService.getLatestNews();

		return ResponseEntity.ok(ApiResponse.success(list));
	}
}
