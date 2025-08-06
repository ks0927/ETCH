package com.ssafy.etch.project.service;

import java.util.List;

import com.ssafy.etch.project.dto.ProjectDetailDTO;
import com.ssafy.etch.project.dto.ProjectListDTO;

public interface ProjectService {
	List<ProjectListDTO> getAllProjects();
	ProjectDetailDTO getProjectById(long id);
}
