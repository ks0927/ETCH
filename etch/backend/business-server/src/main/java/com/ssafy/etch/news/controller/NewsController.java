package com.ssafy.etch.news.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.etch.global.response.ApiResponse;
import com.ssafy.etch.news.dto.LatestNewsDTO;
import com.ssafy.etch.news.service.NewsService;

@RestController
@RequestMapping("/news")
public class NewsController {

	private final NewsService newsService;

	public NewsController(NewsService newsService) {
		this.newsService = newsService;
	}

	// 최근 뉴스
	@GetMapping("/latest") 
	public ApiResponse<List<LatestNewsDTO>> getLatestNews() {
		List<LatestNewsDTO> list = newsService.getLatestNews();

		return ApiResponse.success(list);
	}
}
