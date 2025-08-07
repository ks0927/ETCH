package com.ssafy.etch.search.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.etch.search.document.JobDocument;
import com.ssafy.etch.search.service.JobSearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/jobs/search")
public class JobSearchController {
	private final JobSearchService jobSearchService;

	@GetMapping("")
	public ResponseEntity<List<JobDocument>> searchJobs(
		@RequestParam(required = false) String keyword,
		@RequestParam(required = false) List<String> regions,
		@RequestParam(required = false) List<String> jobCategories,
		@RequestParam(required = false) String workType,
		@RequestParam(required = false) String educationLevel
	) {
		List<JobDocument> jobDocuments = jobSearchService.searchWithFilters(keyword, regions, jobCategories, workType,
			educationLevel);
		System.out.println(jobDocuments.size());

		return ResponseEntity.ok(jobDocuments);
	}
}
