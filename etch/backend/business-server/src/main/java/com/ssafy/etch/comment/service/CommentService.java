package com.ssafy.etch.comment.service;

import com.ssafy.etch.comment.dto.CommentListResponseDTO;

public interface CommentService {
	CommentListResponseDTO getCommentsWithCountByProjectId(Long projectId);
}
