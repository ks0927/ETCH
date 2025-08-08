package com.ssafy.etch.comment.service;

import com.ssafy.etch.comment.dto.CommentListResponseDTO;
import com.ssafy.etch.comment.dto.CommentRequestDTO;
import com.ssafy.etch.comment.dto.CommentResponseDTO;

public interface CommentService {
	CommentListResponseDTO getCommentsWithCountByProjectId(Long projectId);
	CommentResponseDTO registComment(Long projectId, CommentRequestDTO commentRequestDTO, Long memberId);
}
