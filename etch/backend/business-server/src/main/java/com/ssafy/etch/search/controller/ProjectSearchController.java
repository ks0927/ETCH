package com.ssafy.etch.search.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.etch.search.document.ProjectDocument;
import com.ssafy.etch.search.service.ProjectSearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/projects/search")
public class ProjectSearchController {

	private final ProjectSearchService projectSearchService;

	@GetMapping("")
	public ResponseEntity<List<ProjectDocument>> search(@RequestParam String keyword) {
		List<ProjectDocument> results = projectSearchService.search(keyword);
		return ResponseEntity.ok(results);
	}
}
