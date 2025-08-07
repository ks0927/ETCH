package com.ssafy.etch.comment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.etch.comment.dto.CommentListResponseDTO;
import com.ssafy.etch.comment.service.CommentService;
import com.ssafy.etch.global.response.ApiResponse;

@RestController
@RequestMapping("/projects/{projectId}/comments")
public class CommentController {

	private final CommentService commentService;

	public CommentController(CommentService commentService) {
		this.commentService = commentService;
	}

	@GetMapping
	public ResponseEntity<ApiResponse<CommentListResponseDTO>> getAllCommentsByProjectId(@PathVariable Long projectId) {
		CommentListResponseDTO result = commentService.getCommentsWithCountByProjectId(projectId);

		return ResponseEntity.ok(ApiResponse.success(result));
	}

}
