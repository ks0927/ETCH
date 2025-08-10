package com.ssafy.etch.project.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.ssafy.etch.project.dto.ProjectCreateRequestDTO;
import com.ssafy.etch.project.dto.ProjectDetailDTO;
import com.ssafy.etch.project.dto.ProjectListDTO;

public interface ProjectService {
	List<ProjectListDTO> getAllProjects();
	ProjectDetailDTO getProjectById(long id, Long memberId);
	Long createProject(Long memberId, ProjectCreateRequestDTO req, List<MultipartFile> files);
	void deleteProject(Long projectId, Long memberId);
}
