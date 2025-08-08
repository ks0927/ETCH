package com.ssafy.etch.comment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CommentDeleteResponseDTO {
	private Long deletedId;
	private Boolean success;
}
