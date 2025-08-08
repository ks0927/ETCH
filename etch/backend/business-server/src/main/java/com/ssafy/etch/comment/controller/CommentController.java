package com.ssafy.etch.comment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.etch.comment.dto.CommentListResponseDTO;
import com.ssafy.etch.comment.dto.CommentRequestDTO;
import com.ssafy.etch.comment.dto.CommentResponseDTO;
import com.ssafy.etch.comment.service.CommentService;
import com.ssafy.etch.global.response.ApiResponse;
import com.ssafy.etch.oauth.dto.CustomOAuth2User;

import jakarta.validation.Valid;

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

	@PostMapping
	public ResponseEntity<ApiResponse<CommentResponseDTO>> registComment (
		@PathVariable Long projectId,
		@RequestBody @Valid CommentRequestDTO commentRequestDTO,
		@AuthenticationPrincipal CustomOAuth2User user) {

		CommentResponseDTO response = commentService.registComment(projectId, commentRequestDTO, user.getId());

		return ResponseEntity.ok(ApiResponse.success(response));
	}

}
