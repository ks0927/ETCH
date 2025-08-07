package com.ssafy.etch.comment.dto;

import java.time.LocalDate;

import com.ssafy.etch.member.entity.MemberEntity;
import com.ssafy.etch.project.entity.ProjectEntity;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class CommentDTO {
	private Long id;
	private String content;
	private LocalDate createdAt;
	private Boolean isDeleted;
	private MemberEntity member;
	private ProjectEntity project;
}
