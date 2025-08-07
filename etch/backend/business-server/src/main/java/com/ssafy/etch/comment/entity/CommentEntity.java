package com.ssafy.etch.comment.entity;

import java.time.LocalDate;

import com.ssafy.etch.comment.dto.CommentDTO;
import com.ssafy.etch.member.entity.MemberEntity;
import com.ssafy.etch.project.entity.ProjectEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Table(name = "project_comment")
@Getter
public class CommentEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(columnDefinition = "TEXT")
	private String content;

	@Column(name = "created_at")
	private LocalDate createdAt;

	@Column(name = "is_deleted", nullable = false)
	private Boolean isDeleted;

	@ManyToOne
	@JoinColumn(name = "member_id")
	private MemberEntity member;

	@ManyToOne
	@JoinColumn(name = "project_post")
	private ProjectEntity project;

	public CommentDTO toCommentDTO() {
		return CommentDTO.builder()
			.id(id)
			.content(content)
			.createdAt(createdAt)
			.isDeleted(isDeleted)
			.member(member)
			.project(project)
			.build();
	}
}
