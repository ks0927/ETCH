package com.ssafy.etch.search.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.etch.global.response.ApiResponse;
import com.ssafy.etch.search.dto.ProjectSearchResponseDTO;
import com.ssafy.etch.search.enumeration.ProjectSort;
import com.ssafy.etch.search.service.ProjectSearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/projects/search")
public class ProjectSearchController {

	private final ProjectSearchService projectSearchService;

	@GetMapping("")
	public ResponseEntity<ApiResponse<List<ProjectSearchResponseDTO>>> search(
		@RequestParam(required = false) @Nullable String keyword,
		@RequestParam(required = false) @Nullable String category,
		@RequestParam(required = false, name = "sort") @Nullable String sortParam) {

		ProjectSort sort;
		if (sortParam == null || sortParam.isBlank()) {
			sort = ProjectSort.LATEST;
		} else {
			sort = ProjectSort.valueOf(sortParam);
		}

		List<ProjectSearchResponseDTO> projectSearchResponseDTOList = projectSearchService.search(keyword, category,
			sort);
		return ResponseEntity.ok(ApiResponse.success(projectSearchResponseDTOList));
	}
}
