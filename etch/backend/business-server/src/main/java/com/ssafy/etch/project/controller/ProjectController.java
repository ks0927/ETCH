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
import com.ssafy.etch.project.dto.ProjectUpdateRequestDTO;
import com.ssafy.etch.project.service.ProjectService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(
	name = "Project",
	description = "Project Controller 입니다."
)
@RestController
@RequestMapping("/projects")
public class ProjectController {

	private final ProjectService projectService;

	public ProjectController(ProjectService projectService) {
		this.projectService = projectService;
	}

	@Operation(
		summary = "프로젝트 목록 조회 API",
		description = "모든 프로젝트를 조회할 수 있는 목록을 제공합니다."
	)
	@GetMapping
	public ResponseEntity<ApiResponse<List<ProjectListDTO>>> getAllProjects() {
		List<ProjectListDTO> list = projectService.getAllProjects();
		return ResponseEntity.ok(ApiResponse.success(list));
	}

	@Operation(
		summary = "프로젝트 상세 조회 API",
		description = "특정 프로젝트에 대한 상세 정보를 제공합니다."
	)
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<ProjectDetailDTO>> getProjectById(
		@PathVariable Long id,
		@AuthenticationPrincipal CustomOAuth2User user
	) {
		Long memberId = (user == null) ? null : user.getId();
		ProjectDetailDTO project = projectService.getProjectById(id, memberId);
		return ResponseEntity.ok(ApiResponse.success(project));
	}

	@Operation(
		summary = "프로젝트 등록 API",
		description = "USER로부터 데이터를 입력받아 프로젝트를 등록합니다."
	)
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ApiResponse<Long>> createProject(
		@AuthenticationPrincipal(expression = "id") Long memberId,
		@Valid @RequestPart("data") ProjectCreateRequestDTO data,
		@RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
		@RequestPart(value = "images", required = false) List<MultipartFile> images,
		@RequestPart(value = "pdf", required = false) MultipartFile pdf
	) {
		Long id = projectService.createProject(memberId, data, thumbnail, images, pdf);
		return ResponseEntity.ok(ApiResponse.success(id));
	}

	@Operation(
		summary = "프로젝트 수정 API",
		description = "본인이 등록한 프로젝트에 한정하여, 모든 정보를 수정할 수 있습니다."
	)
	@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ApiResponse<Void>> updateProject(
		@PathVariable("id") Long projectId,
		@AuthenticationPrincipal(expression = "id") Long memberId,
		@Valid @RequestPart("data") ProjectUpdateRequestDTO data,
		@RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
		@RequestPart(value = "images",    required = false) List<MultipartFile> images,
		@RequestPart(value = "pdf",       required = false) MultipartFile pdf
	) {
		projectService.updateProject(projectId, memberId, data, thumbnail, images, pdf);
		return ResponseEntity.ok(ApiResponse.success(null));
	}

	@Operation(
		summary = "프로젝트 삭제 API",
		description = "본인이 등록한 프로젝트에 한정하여 해당 프로젝트를 삭제할 수 있습니다."
	)
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
