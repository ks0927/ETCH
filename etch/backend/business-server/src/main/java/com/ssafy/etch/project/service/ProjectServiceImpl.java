package com.ssafy.etch.project.service;

import static org.springframework.data.domain.Sort.Direction.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.ssafy.etch.file.entity.FileEntity;
import com.ssafy.etch.file.repository.FileRepository;
import com.ssafy.etch.global.response.PageResponseDTO;
import com.ssafy.etch.global.service.S3Service;
import com.ssafy.etch.like.entity.LikeType;
import com.ssafy.etch.like.repository.LikeRepository;
import com.ssafy.etch.member.entity.MemberEntity;
import com.ssafy.etch.member.repository.MemberRepository;
import com.ssafy.etch.project.dto.ProjectCreateRequestDTO;
import com.ssafy.etch.project.dto.ProjectDTO;
import com.ssafy.etch.project.dto.ProjectDetailDTO;
import com.ssafy.etch.project.dto.ProjectListDTO;
import com.ssafy.etch.project.dto.ProjectUpdateRequestDTO;
import com.ssafy.etch.project.entity.ProjectEntity;
import com.ssafy.etch.project.entity.ProjectTechEntity;
import com.ssafy.etch.project.repository.ProjectRepository;
import com.ssafy.etch.project.repository.ProjectTechRepository;
import com.ssafy.etch.tech.entity.TechCodeEntity;
import com.ssafy.etch.tech.repository.TechCodeRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
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

	private static final Set<String> ALLOWED_IMAGE_CT = Set.of("image/jpeg", "image/png");
	private static final Set<String> ALLOWED_IMAGE_EXT = Set.of(".jpg", ".png", "jpeg", ".gif", "webp");
	private static final long MAX_SIZE = 5L * 1024 * 1024; // 5MB
	private static final int MAX_IMAGES = 9; // 썸네일 제외 본문 이미지 최대 4장

	private static final int MAX_PAGE_SIZE = 100;

	private static final Logger log = LoggerFactory.getLogger(ProjectServiceImpl.class);

	public ProjectServiceImpl(ProjectRepository projectRepository,
		LikeRepository likeRepository,
		MemberRepository memberRepository,
		TechCodeRepository techCodeRepository,
		ProjectTechRepository projectTechRepository,
		FileRepository fileRepository,
		S3Service s3Service) {
		this.projectRepository = projectRepository;
		this.likeRepository = likeRepository;
		this.techCodeRepository = techCodeRepository;
		this.projectTechRepository = projectTechRepository;
		this.memberRepository = memberRepository;
		this.fileRepository = fileRepository;
		this.s3Service = s3Service;
	}

	// 유효성 검증
	private static boolean isImageOk(MultipartFile f) {
		if (f == null || f.isEmpty()) return false;
		String ct = Optional.ofNullable(f.getContentType()).orElse("").toLowerCase();
		String name = Optional.ofNullable(f.getOriginalFilename()).orElse("").toLowerCase();
		boolean ctOk = ALLOWED_IMAGE_CT.contains(ct);
		boolean extOk = ALLOWED_IMAGE_EXT.stream().anyMatch(name::endsWith);
		return ctOk && extOk && f.getSize() <= MAX_SIZE;
	}

	private static String normalizeYoutube(String url) {
		if (url == null || url.isBlank()) return null;
		String u = url.trim();
		if (!(u.contains("youtube.com") || u.contains("youtu.be"))) return null;
		return u;
	}

	// 목록 조회
	@Override
	public PageResponseDTO<ProjectListDTO> getAllProjects(String sort, int page, int pageSize) {
		final String effectiveSort = (sort == null || sort.isBlank()) ? "popular" : sort.toLowerCase();
		final int pageIndex = Math.max(0, page - 1);
		final int size = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);

		// 인기, 조회수, 최신 정렬(기본은 인기순) - formula 필드
		Sort sortOption = switch (effectiveSort) {
			case "views"  -> Sort.by(DESC, "viewCount").and(Sort.by(DESC, "createdAt"));
			case "latest" -> Sort.by(DESC, "createdAt");
			default -> Sort.by(DESC, "popularityScore").and(Sort.by(DESC, "createdAt"));
		};

		Pageable pageable = PageRequest.of(pageIndex, size, sortOption);

		// DB에서 프로젝트 목록을 페이지 단위로 조회
		Page<ProjectEntity> projectPage = projectRepository.findByIsDeletedFalseAndIsPublicTrue(pageable);

		Page<ProjectListDTO> dtoPage = projectPage.map(projectEntity -> {
			ProjectDTO projectDTO = projectEntity.toProjectDTO();

			// 코드 수정 고려
			long likeCount = likeRepository.countByTargetIdAndType(projectDTO.getId(), LikeType.PROJECT);

			return ProjectListDTO.builder()
				.id(projectDTO.getId())
				.title(projectDTO.getTitle())
				.thumbnailUrl(projectDTO.getThumbnailUrl())
				.viewCount(projectDTO.getViewCount())
				.likeCount(likeCount)
				.nickname(projectDTO.getMember().toMemberDTO().getNickname())
				.isPublic(projectDTO.getIsPublic())
				.popularityScore(projectDTO.getPopularityScore())
				.build();
		});

		return new PageResponseDTO<>(dtoPage);
	}

	// 다른 사람의 공개 프로젝트 목록 조회
	@Override
	@Transactional(readOnly = true)
	public PageResponseDTO<ProjectListDTO> getPublicProjectByUser(Long memberId, int page, int pageSize) {
		int pageIndex = Math.max(0, page - 1);
		int size = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);

		Pageable pageable = PageRequest.of(pageIndex, size, Sort.by(DESC, "createdAt"));

		Page<ProjectEntity> pageData = projectRepository.findByMemberIdAndIsPublicTrueAndIsDeletedFalse(memberId, pageable);

		Page<ProjectListDTO> dtoPage = pageData.map(projectEntity -> {
			ProjectDTO projectDTO = projectEntity.toProjectDTO();

			// 코드 수정 고려.
			long likeCount = likeRepository.countByTargetIdAndType(projectDTO.getId(), LikeType.PROJECT);

			return ProjectListDTO.builder()
				.id(projectDTO.getId())
				.title(projectDTO.getTitle())
				.thumbnailUrl(projectDTO.getThumbnailUrl())
				.viewCount(projectDTO.getViewCount())
				.likeCount(likeCount)
				.nickname(projectDTO.getMember().toMemberDTO().getNickname())
				.isPublic(projectDTO.getIsPublic())
				.popularityScore(projectDTO.getPopularityScore())
				.build();
		});

		return new PageResponseDTO<>(dtoPage);
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

		List<String> techCategories = p.getProjectTechs()==null ? List.of() :
			p.getProjectTechs().stream()
				.map(pt -> pt.getTechCode().getTechCategory())
				.filter(v -> v!=null && !v.isBlank())
				.map(String::trim)
				.distinct()
				.toList();

		List<String> techCodes = p.getProjectTechs() == null ? List.of()
			: p.getProjectTechs().stream()
			.map(pt -> pt.getTechCode().getCodeName())
			.filter(v -> v != null && !v.isBlank())
			.map(String::trim)
			.toList();

		// 파일은 file 테이블에서 분리
		List<FileEntity> files = fileRepository.findAllByProjectId(id);

		List<String> imageUrls = files.stream()
			.map(FileEntity::getFileUrl)
			.toList();

		return ProjectDetailDTO.from(p, likedByMe, techCategories, techCodes, imageUrls);
	}

	// 등록
	@Override
	@Transactional
	public Long createProject(Long memberId, ProjectCreateRequestDTO req,
		MultipartFile thumbnail, List<MultipartFile> images) {
		if (memberId == null) {
			throw new IllegalStateException("로그인이 필요합니다.");
		}

		MemberEntity member = memberRepository.getReferenceById(memberId);

		// 기술스택 유효성 검증
		List<TechCodeEntity> techs = (req.getTechCodeIds() == null || req.getTechCodeIds().isEmpty())
			? List.of()
			: techCodeRepository.findAllById(req.getTechCodeIds());
		if (techs.size() != (req.getTechCodeIds() == null ? 0 : req.getTechCodeIds().size())) {
			throw new IllegalArgumentException("존재하지 않는 기술코드가 포함되어 있습니다.");
		}

		// 프로젝트 저장
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
		if (!techs.isEmpty()) {
			List<ProjectTechEntity> links = techs.stream().map(tc -> ProjectTechEntity.of(project, tc)).toList();
			projectTechRepository.saveAll(links);
			links.forEach(project::addProjectTech);
		}

		// 유튜브 링크
		project.changeYoutubeUrl(normalizeYoutube(req.getYoutubeUrl()));

		// 썸네일
		if (isImageOk(thumbnail)) {
			String url = s3Service.uploadFile(thumbnail);
			project.changeThumbnail(url);
		} else {
			project.changeThumbnail(null); // 프론트에 null 반환해서 기본이미지 사용
		}

		// 본문 이미지 (0~4장, jpg/png, <=5MB)
		List<MultipartFile> imgList = Optional.ofNullable(images).orElse(List.of());
		if (imgList.size() > MAX_IMAGES) {
			throw new IllegalArgumentException("이미지는 최대 " + MAX_IMAGES + "장입니다.");
		}
		List<FileEntity> fileEntities = new ArrayList<>();
		for (MultipartFile f : imgList) {
			if (!isImageOk(f)) {
				throw new IllegalArgumentException("이미지 형식/용량 오류: " + Optional.ofNullable(f.getOriginalFilename()).orElse(""));
			}
			String url = s3Service.uploadFile(f);
			FileEntity fe = FileEntity.image(project,
				Optional.ofNullable(f.getOriginalFilename()).orElse("image"),
				url);
			fileEntities.add(fe);
			project.addFile(fe);
		}
		if (!fileEntities.isEmpty()) {
			fileRepository.saveAll(fileEntities);
		}

		return project.getId();
	}

	// 삭제
	@Override
	@Transactional
	public void deleteProject(Long projectId, Long memberId) {
		// 1. 프로젝트 엔티티를 조회합니다.
		ProjectEntity project = projectRepository.findById(projectId)
			.orElseThrow(() -> new NoSuchElementException("프로젝트를 찾을 수 없습니다."));

		// 2. 삭제 권한을 확인합니다.
		if (!project.getMember().toMemberDTO().getId().equals(memberId)) {
			throw new AccessDeniedException("본인만 삭제할 수 있습니다.");
		}

		// 3. 프로젝트에 연결된 파일들의 URL을 가져옵니다.
		// 썸네일 URL을 가져와 삭제 리스트에 추가합니다.
		List<String> fileUrlsToDelete = new ArrayList<>();
		if (project.getThumbnailUrl() != null) {
			fileUrlsToDelete.add(project.getThumbnailUrl());
		}

		// 본문 이미지들의 URL을 가져와 삭제 리스트에 추가합니다.
		List<FileEntity> files = fileRepository.findAllByProjectId(projectId);
		for (FileEntity file : files) {
			fileUrlsToDelete.add(file.getFileUrl());
		}

		// 4. S3Service를 사용하여 MinIO에서 파일들을 삭제합니다.
		for (String fileUrl : fileUrlsToDelete) {
			try {
				s3Service.deleteFileByUrl(fileUrl);
			} catch (Exception e) {
				log.error("MinIO 파일 삭제 실패. URL: {}", fileUrl, e);
			}
		}

		// 5. 데이터베이스에서 프로젝트와 연결된 파일들을 삭제합니다.
		fileRepository.deleteAll(files);

		// 6. ProjectTechEntity 링크를 삭제합니다.
		projectTechRepository.deleteAllByProjectId(projectId);

		// 7. 프로젝트를 soft-delete합니다.
		// 만약 완전히 삭제하려면 projectRepository.delete(project); 를 사용합니다.
		int changed = projectRepository.softDelete(projectId, memberId);

		if (changed == 0) {
			throw new NoSuchElementException("삭제할 수 없습니다.");
		}
	}

	// 수정
	@Override
	@Transactional
	public void updateProject(Long projectId, Long memberId,
		ProjectUpdateRequestDTO req,
		MultipartFile thumbnail,
		List<MultipartFile> images) {
		if (memberId == null) {
			throw new IllegalStateException("로그인이 필요합니다.");
		}

		ProjectEntity p = projectRepository.findById(projectId)
			.orElseThrow(() -> new NoSuchElementException("프로젝트를 찾을 수 없습니다."));

		if (Boolean.TRUE.equals(p.getIsDeleted())) {
			throw new NoSuchElementException("삭제된 프로젝트 입니다.");
		}

		if (!p.getMember().toMemberDTO().getId().equals(memberId)) {
			throw new AccessDeniedException("본인만 수정할 수 있습니다.");
		}

		p.change(
			req.getTitle(),
			req.getContent(),
			req.getCategory(),
			req.getGithubUrl(),
			req.getIsPublic()
		);

		// 기술스택 diff
		if (req.getTechCodeIds() != null) {
			List<ProjectTechEntity> current = projectTechRepository.findAllByProjectId(projectId);
			Set<Long> currentIds = current.stream().map(pt -> pt.getTechCode().getId()).collect(Collectors.toSet());
			Set<Long> targetIds = new HashSet<>(req.getTechCodeIds());

			// 제거
			List<Long> toRemove = currentIds.stream()
				.filter(id -> !targetIds.contains(id))
				.toList();
			if (!toRemove.isEmpty()) {
				projectTechRepository.deleteLinks(projectId, toRemove);
			}

			// 추가
			List<Long> toAdd = targetIds.stream()
				.filter(id -> !currentIds.contains(id))
				.toList();
			if (!toAdd.isEmpty()) {
				List<TechCodeEntity> techs = techCodeRepository.findAllById(toAdd);
				if (techs.size() != toAdd.size()) {
					throw new IllegalArgumentException("존재하지 않는 기술코드가 포함되어 있습니다.");
				}
				List<ProjectTechEntity> links = techs.stream()
					.map(tc -> ProjectTechEntity.of(p, tc))
					.toList();
				projectTechRepository.saveAll(links);
				links.forEach(p::addProjectTech);
			}
		}

		// 유튜브 링크
		p.changeYoutubeUrl(normalizeYoutube(req.getYoutubeUrl()));

		// 썸네일
		if (Boolean.TRUE.equals(req.getRemoveThumbnail())) {
			if (p.getThumbnailUrl() != null) {
				try { s3Service.deleteFileByUrl(p.getThumbnailUrl()); } catch (Exception ignore) {}
			}
			p.changeThumbnail(null);
		} else if (thumbnail != null && !thumbnail.isEmpty()) {
			if (!isImageOk(thumbnail)) throw new IllegalArgumentException("썸네일 형식/용량 오류");
			String newUrl = s3Service.uploadFile(thumbnail);
			if (p.getThumbnailUrl() != null) {
				try { s3Service.deleteFileByUrl(p.getThumbnailUrl()); } catch (Exception ignore) {}
			}
			p.changeThumbnail(newUrl);
		}

		// 본문 이미지 삭제(DB -> S3)
		if (req.getRemoveFileIds() != null && !req.getRemoveFileIds().isEmpty()) {
			List<FileEntity> willRemove = fileRepository.findAllByIdInAndProjectId(req.getRemoveFileIds(), projectId);

			// S3 먼저 삭제 + 연관관계 해제
			for (FileEntity f : willRemove) {
				try { s3Service.deleteFileByUrl(f.getFileUrl()); } catch (Exception ignore) {}
				p.removeFile(f);
			}
			// 영속성 친화적 삭제
			fileRepository.deleteAll(willRemove);
		}

		// 본문 이미지 추가
		List<MultipartFile> addList = Optional.ofNullable(images).orElse(List.of());
		if (!addList.isEmpty()) {
			int existingImages = (int) fileRepository.findAllByProjectId(projectId)
				.size();
			if (existingImages + addList.size() > MAX_IMAGES) {
				throw new IllegalArgumentException("이미지는 최대 " + MAX_IMAGES + "장입니다.");
			}
			List<FileEntity> saved = new ArrayList<>();
			for (MultipartFile img : addList) {
				if (!isImageOk(img)) throw new IllegalArgumentException("이미지 형식/용량 오류");
				String url = s3Service.uploadFile(img);
				FileEntity fe = FileEntity.image(p, Optional.ofNullable(img.getOriginalFilename()).orElse("image"), url);
				saved.add(fe);
				p.addFile(fe);
			}
			if (!saved.isEmpty()) fileRepository.saveAll(saved);
		}
	}
}