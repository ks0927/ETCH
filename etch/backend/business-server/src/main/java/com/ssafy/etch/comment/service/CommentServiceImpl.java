package com.ssafy.etch.comment.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.etch.comment.dto.CommentListResponseDTO;
import com.ssafy.etch.comment.dto.CommentResponseDTO;
import com.ssafy.etch.comment.entity.CommentEntity;
import com.ssafy.etch.comment.repository.CommentRepository;

@Service
public class CommentServiceImpl implements CommentService {

	private final CommentRepository commentRepository;

	public CommentServiceImpl(CommentRepository commentRepository) {
		this.commentRepository = commentRepository;
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
}
