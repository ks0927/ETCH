package com.ssafy.etch.comment.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.etch.comment.dto.CommentListResponseDTO;
import com.ssafy.etch.comment.dto.CommentRequestDTO;
import com.ssafy.etch.comment.dto.CommentResponseDTO;
import com.ssafy.etch.comment.entity.CommentEntity;
import com.ssafy.etch.comment.repository.CommentRepository;
import com.ssafy.etch.member.entity.MemberEntity;
import com.ssafy.etch.member.repository.MemberRepository;
import com.ssafy.etch.project.entity.ProjectEntity;
import com.ssafy.etch.project.repository.ProjectRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CommentServiceImpl implements CommentService {

	private final CommentRepository commentRepository;
	private final ProjectRepository projectRepository;
	private final MemberRepository memberRepository;

	public CommentServiceImpl(CommentRepository commentRepository, ProjectRepository projectRepository, MemberRepository memberRepository) {
		this.commentRepository = commentRepository;
		this.projectRepository = projectRepository;
		this.memberRepository = memberRepository;
	}

	@Override
	public CommentListResponseDTO getCommentsWithCountByProjectId(Long projectId) {
		List<CommentResponseDTO> comments = commentRepository
			.findAllByProjectIdOrderByCreatedAtDesc(projectId)
			.stream()
			.map(CommentEntity::toCommentDTO)
			.map(CommentResponseDTO::from)
			.toList();

		Long count = (long) comments.size();

		return new CommentListResponseDTO(count, comments);
	}

	@Override
	public CommentResponseDTO registComment(Long projectId, CommentRequestDTO commentRequestDTO, Long memberId) {
		ProjectEntity project = projectRepository.findById(projectId).orElseThrow(() -> new EntityNotFoundException("프로젝트가 없습니다."));
		MemberEntity member = memberRepository.findById(memberId).orElseThrow(() -> new EntityNotFoundException("회원이 없습니다."));
		CommentEntity saved = commentRepository.save(
			CommentEntity.of(commentRequestDTO.getContent(), member, project)
		);

		return CommentResponseDTO.from(saved.toCommentDTO());
	}
}
