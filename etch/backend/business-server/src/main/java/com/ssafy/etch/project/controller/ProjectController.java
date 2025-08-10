package com.ssafy.etch.project.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.etch.global.response.ApiResponse;
import com.ssafy.etch.oauth.dto.CustomOAuth2User;
import com.ssafy.etch.project.dto.ProjectCreateRequestDTO;
import com.ssafy.etch.project.dto.ProjectDetailDTO;
import com.ssafy.etch.project.dto.ProjectListDTO;
import com.ssafy.etch.project.service.ProjectService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/projects")
public class ProjectController {

	private final ProjectService projectService;

	public ProjectController(ProjectService projectService) {
		this.projectService = projectService;
	}

	@GetMapping
	public ResponseEntity<ApiResponse<List<ProjectListDTO>>> getAllProjects() {
		List<ProjectListDTO> list = projectService.getAllProjects();

		return ResponseEntity.ok(ApiResponse.success(list));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<ProjectDetailDTO>> getProjectById(
		@PathVariable Long id,
		@AuthenticationPrincipal CustomOAuth2User user) {
		Long memberId = (user == null) ? null : user.getId();
		ProjectDetailDTO project = projectService.getProjectById(id, memberId);

		return ResponseEntity.ok(ApiResponse.success(project));
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE) // consumes로 들어오는 데이터 정의
	public ResponseEntity<ApiResponse<Long>> createProject(
		@AuthenticationPrincipal(expression = "id") Long memberId,
		@Valid @RequestPart("data")ProjectCreateRequestDTO data,
		@RequestPart(value = "files", required = false) List<MultipartFile> files
	) {
		Long id = projectService.createProject(memberId, data, files == null ? List.of() : files);
		return ResponseEntity.ok(ApiResponse.success(id));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteProject(
		@PathVariable Long id,
		@AuthenticationPrincipal CustomOAuth2User user
	) {
		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("로그인이 필요합니다."));
		}

		projectService.deleteProject(id, user.getId());

		return ResponseEntity.ok(ApiResponse.success(null));
	}
}
