package com.ssafy.etch.search.controller;

import org.springframework.data.domain.Page;
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
	public ResponseEntity<ApiResponse<Page<ProjectSearchResponseDTO>>> search(
		@RequestParam(required = false) @Nullable String keyword,
		@RequestParam(required = false) @Nullable String category,
		@RequestParam(required = false, name = "sort") @Nullable String sortParam,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "12") int size
	) {

		ProjectSort sort;
		if (sortParam == null || sortParam.isBlank()) {
			sort = ProjectSort.LATEST;
		} else {
			sort = ProjectSort.valueOf(sortParam);
		}

		Page<ProjectSearchResponseDTO> projectSearchResponseDTOList = projectSearchService.search(keyword, category,
			sort, page, size);
		return ResponseEntity.ok(ApiResponse.success(projectSearchResponseDTOList));
	}
}
