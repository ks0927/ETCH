package com.ssafy.etch.project.service;

import java.util.List;
import java.util.NoSuchElementException;

import com.ssafy.etch.file.entity.FileEntity;
import com.ssafy.etch.like.entity.LikeType;
import com.ssafy.etch.like.repository.LikeRepository;
import com.ssafy.etch.project.dto.ProjectDTO;
import com.ssafy.etch.project.dto.ProjectDetailDTO;
import com.ssafy.etch.project.dto.ProjectListDTO;
import com.ssafy.etch.project.entity.ProjectEntity;
import com.ssafy.etch.project.repository.ProjectRepository;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectServiceImpl implements ProjectService {

	private final ProjectRepository projectRepository;
	private final LikeRepository likeRepository;

	public ProjectServiceImpl(ProjectRepository projectRepository, LikeRepository likeRepository) {
		this.projectRepository = projectRepository;
		this.likeRepository = likeRepository;
	}

	// 목록 조회
	@Override
	public List<ProjectListDTO> getAllProjects() {
		return projectRepository.findAll()
			.stream()
			.map(ProjectEntity::toProjectDTO)
			.map(dto -> {
				long likeCount = likeRepository.countByTargetIdAndType(dto.getId(), LikeType.PROJECT);
				return ProjectListDTO.from(dto, likeCount);
			})
			.toList();
	}

	// 상세 조회
	@Override
	@Transactional(readOnly = false)
	public ProjectDetailDTO getProjectById(long id, Long memberId) {

		projectRepository.increaseViewCount(id);

		ProjectDTO p = projectRepository.findById(id)
			.map(ProjectEntity::toProjectDTO)
			.orElseThrow(() -> new NoSuchElementException("프로젝트를 찾을 수 없습니다."));

		long likeCount = likeRepository.countByTargetIdAndType(id, LikeType.PROJECT);
		boolean likedByMe = (memberId != null) &&
			likeRepository.existsByMember_IdAndTargetIdAndType(memberId, id, LikeType.PROJECT);

		List<String> categories = p.getProjectTechs() == null ? List.of()
			: p.getProjectTechs().stream()
			.map(pt -> pt.getTechCode().getTechCategory())
			.distinct()
			.toList();

		List<String> techCodes = p.getProjectTechs() == null ? List.of()
			: p.getProjectTechs().stream()
			.map(pt -> pt.getTechCode().getCodeName())
			.toList();

		List<String> fileUrls = p.getFiles() == null ? List.of()
			: p.getFiles().stream().map(FileEntity::getUrl).toList();

		return ProjectDetailDTO.from(p, likeCount, likedByMe, categories, techCodes, fileUrls);
	}

}
