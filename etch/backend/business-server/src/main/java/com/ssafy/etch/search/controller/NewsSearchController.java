package com.ssafy.etch.search.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.etch.search.document.NewsDocument;
import com.ssafy.etch.search.service.NewsSearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/news/search")
public class NewsSearchController {
	private final NewsSearchService newsSearchService;

	@GetMapping("")
	public ResponseEntity<List<NewsDocument>> searchNews(@RequestParam String keyword) {
		List<NewsDocument> result = newsSearchService.search(keyword);
		return ResponseEntity.ok(result);
	}
}
