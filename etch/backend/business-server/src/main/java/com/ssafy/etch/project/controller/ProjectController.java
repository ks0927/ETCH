package com.ssafy.etch.project.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.etch.global.response.ApiResponse;
import com.ssafy.etch.project.dto.ProjectDetailDTO;
import com.ssafy.etch.project.dto.ProjectListDTO;
import com.ssafy.etch.project.service.ProjectService;

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
	public ResponseEntity<ApiResponse<ProjectDetailDTO>> getProjectById(@PathVariable Long id) {
		ProjectDetailDTO project = projectService.getProjectById(id);

		return  ResponseEntity.ok(ApiResponse.success(project));
	}
}
