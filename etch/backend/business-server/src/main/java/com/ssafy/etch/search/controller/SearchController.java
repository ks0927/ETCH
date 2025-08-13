package com.ssafy.etch.search.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.etch.global.response.ApiResponse;
import com.ssafy.etch.search.dto.JobSearchResponseDTO;
import com.ssafy.etch.search.dto.NewsSearchResponseDTO;
import com.ssafy.etch.search.dto.ProjectSearchResponseDTO;
import com.ssafy.etch.search.dto.SearchResponseDTO;
import com.ssafy.etch.search.enumeration.ProjectSort;
import com.ssafy.etch.search.service.JobSearchService;
import com.ssafy.etch.search.service.NewsSearchService;
import com.ssafy.etch.search.service.ProjectSearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SearchController {
	private final JobSearchService jobSearchService;
	private final NewsSearchService newsSearchService;
	private final ProjectSearchService projectSearchService;

	@GetMapping
	public ResponseEntity<ApiResponse<SearchResponseDTO>> search(@RequestParam(required = false) String keyword) {
		List<JobSearchResponseDTO> jobDocuments = jobSearchService.searchWithFilters(keyword, null, null, null,
			null);
		List<NewsSearchResponseDTO> newsDocuments = newsSearchService.search(keyword);
		List<ProjectSearchResponseDTO> projectDocuments = projectSearchService.search(keyword, null,
			ProjectSort.LATEST);
		SearchResponseDTO searchResponseDTO = SearchResponseDTO.from(jobDocuments, newsDocuments, projectDocuments);
		return ResponseEntity.ok(ApiResponse.success(searchResponseDTO));
	}
}
