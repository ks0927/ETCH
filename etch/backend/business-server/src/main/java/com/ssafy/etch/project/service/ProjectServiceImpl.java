package com.ssafy.etch.project.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.ssafy.etch.project.dto.ProjectDetailDTO;
import com.ssafy.etch.project.dto.ProjectListDTO;
import com.ssafy.etch.project.entity.ProjectEntity;
import com.ssafy.etch.project.repository.ProjectRepository;

@Service
public class ProjectServiceImpl implements ProjectService {

	private final ProjectRepository projectRepository;

	public ProjectServiceImpl(ProjectRepository projectRepository) {
		this.projectRepository = projectRepository;
	}

	@Override
	public List<ProjectListDTO> getAllProjects() {
		return projectRepository.findAll()
			.stream()
			.map(ProjectEntity::toProjectDTO)
			.map(ProjectListDTO::from)
			.toList();
	}

	@Override
	public ProjectDetailDTO getProjectById(long id) {
		return projectRepository.findById(id)
			.map(ProjectEntity::toProjectDTO)
			.map(ProjectDetailDTO::from)
			.orElseThrow(() -> new NoSuchElementException("프로젝트를 찾을 수 없습니다."));
	}

}
