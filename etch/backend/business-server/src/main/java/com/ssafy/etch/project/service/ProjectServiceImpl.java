package com.ssafy.etch.project.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;

import com.ssafy.etch.file.entity.FileEntity;
import com.ssafy.etch.file.repository.FileRepository;
import com.ssafy.etch.global.service.S3Service;
import com.ssafy.etch.like.entity.LikeType;
import com.ssafy.etch.like.repository.LikeRepository;
import com.ssafy.etch.member.entity.MemberEntity;
import com.ssafy.etch.member.repository.MemberRepository;
import com.ssafy.etch.project.dto.ProjectCreateRequestDTO;
import com.ssafy.etch.project.dto.ProjectDTO;
import com.ssafy.etch.project.dto.ProjectDetailDTO;
import com.ssafy.etch.project.dto.ProjectListDTO;
import com.ssafy.etch.project.entity.ProjectEntity;
import com.ssafy.etch.project.entity.ProjectTechEntity;
import com.ssafy.etch.project.repository.ProjectRepository;
import com.ssafy.etch.project.repository.ProjectTechRepository;
import com.ssafy.etch.tech.entity.TechCodeEntity;
import com.ssafy.etch.tech.repository.TechCodeRepository;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProjectServiceImpl implements ProjectService {

	private final ProjectRepository projectRepository;
	private final LikeRepository likeRepository;
	private final MemberRepository memberRepository;
	private final TechCodeRepository techCodeRepository;
	private final ProjectTechRepository projectTechRepository;
	private final FileRepository fileRepository;
	private final S3Service s3Service;

	// 허용 파일 확장자 -> 임의로 적어놓음
	private static final Set<String> ALLOWED = Set.of("image/jpeg", "image/png", "image/webp", "image/gif",
		"video/mp4");
	private static final int MAX_FILES = 10;
	private static final long MAX_SIZE = 10L * 1024 * 1024;

	public ProjectServiceImpl(ProjectRepository projectRepository, LikeRepository likeRepository, MemberRepository memberRepository,
		TechCodeRepository techCodeRepository, ProjectTechRepository projectTechRepository, FileRepository fileRepository, S3Service s3Service) {
		this.projectRepository = projectRepository;
		this.likeRepository = likeRepository;
		this.techCodeRepository = techCodeRepository;
		this.projectTechRepository = projectTechRepository;
		this.memberRepository = memberRepository;
		this.fileRepository = fileRepository;
		this.s3Service = s3Service;
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

		ProjectDTO p = projectRepository.findDetailById(id)
			.map(ProjectEntity::toProjectDTO)
			.orElseThrow(() -> new NoSuchElementException("프로젝트를 찾을 수 없습니다."));

		long likeCount = likeRepository.countByTargetIdAndType(id, LikeType.PROJECT);
		boolean likedByMe = (memberId != null) &&
			likeRepository.existsByMember_IdAndTargetIdAndType(memberId, id, LikeType.PROJECT);

		// 기술 카테고리: 기술코드(tech_code)들의 기술분류(tech_category)
		List<String> techCategories = p.getProjectTechs()==null ? List.of() :
			p.getProjectTechs().stream()
				.map(pt -> pt.getTechCode().getTechCategory())
				.filter(v -> v!=null && !v.isBlank())
				.map(String::trim)
				.distinct()
				.toList();

		// 기술 코드: 연결된 기술코드(tech_code)들의 코드명(code_name)
		List<String> techCodes = p.getProjectTechs() == null ? List.of()
			: p.getProjectTechs().stream()
			.map(pt -> pt.getTechCode().getCodeName())
			.filter(v -> v != null && !v.isBlank())
			.map(String::trim)
			.toList();

		List<String> fileUrls = p.getFiles() == null ? List.of()
			: p.getFiles().stream().map(FileEntity::getUrl).toList();

		return ProjectDetailDTO.from(p, likeCount, likedByMe, techCategories, techCodes, fileUrls);
	}

	// 등록
	@Override
	@Transactional
	public Long createProject(Long memberId, ProjectCreateRequestDTO req, List<MultipartFile> files) {
		if (memberId == null) throw new IllegalStateException("로그인이 필요합니다.");

		// null 검증
		if (files == null) files = List.of();
		validateFiles(files); // 개수, 용량, 타입 검사

		MemberEntity member = memberRepository.getReferenceById(memberId);

		// 프로젝트 저장(엔티티 생성)
		ProjectEntity project = ProjectEntity.builder()
			.title(req.getTitle())
			.content(req.getContent())
			.category(req.getCategory())
			.githubUrl(req.getGithubUrl())
			.isPublic(req.getIsPublic())
			.member(member)
			.build();

		projectRepository.save(project);

		// 기술스택 매핑
		List<TechCodeEntity> techs = techCodeRepository.findAllById(req.getTechCodeIds());
		if (techs.size() != req.getTechCodeIds().size()) {
			throw new IllegalArgumentException("존재하지 않는 기술코드가 있습니다.");
		}

		List<ProjectTechEntity> links = techs.stream()
			.map(tc -> ProjectTechEntity.of(project, tc))
			.toList();
		projectTechRepository.saveAll(links);
		links.forEach(project::addProjectTech);

		// 파일 업로드 및 저장
		String thumbnailImage = null;
		List<FileEntity> fileEntities = new ArrayList<>();

		for (MultipartFile f : files) {
			if (f.isEmpty()) continue;

			String url = s3Service.uploadFile(f);
			FileEntity fe = FileEntity.of(project,
				Optional.ofNullable(f.getOriginalFilename()).orElse("file"),
				url);
			fileEntities.add(fe);
			project.addFile(fe);

			if (thumbnailImage == null && f.getContentType() != null && f.getContentType().startsWith("image/")) {
				thumbnailImage = url;
			}
		}

		if (!fileEntities.isEmpty()) {
			fileRepository.saveAll(fileEntities);
		}

		if (thumbnailImage != null) {
			project.changeThumbnail(thumbnailImage);
		}

		return project.getId();
	}

	private void validateFiles(List<MultipartFile> files) {
		// 개수
		if (files.size() > MAX_FILES) {
			throw new IllegalArgumentException("파일은 최대 " + MAX_FILES + "개까지 업로드 가능합니다.");
		}

		for (MultipartFile f : files) {
			if (f.isEmpty()) continue;

			// 용량
			if (f.getSize() > MAX_SIZE) {
				throw new IllegalArgumentException("파일 용량은 10MB 이하여야 합니다: " + f.getOriginalFilename());
			}

			// MIME 타입 (null 방어)
			String contentType = f.getContentType();
			if (contentType == null || !ALLOWED.contains(contentType)) {
				throw new IllegalArgumentException("허용되지 않는 파일 형식: " + f.getOriginalFilename());
			}
		}
	}

	// 삭제
	@Override
	@Transactional
	public void deleteProject(Long projectId, Long memberId) {
		if (memberId == null) {
			throw new IllegalStateException("로그인이 필요합니다.");
		}

		int changed = projectRepository.softDelete(projectId, memberId);

		// 쿼리 실행결과 == 0행 (삭제 못함)
		if (changed == 0) {
			// 다른 회원의 글이거나, 이미 삭제 했거나
			throw new NoSuchElementException("삭제할 수 없습니다.");
		}
	}
}
