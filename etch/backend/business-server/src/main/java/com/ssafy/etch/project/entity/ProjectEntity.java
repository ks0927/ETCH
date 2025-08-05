package com.ssafy.etch.project.entity;

import java.time.LocalDate;

import com.ssafy.etch.member.entity.MemberEntity;

import com.ssafy.etch.project.dto.ProjectDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "project")
public class ProjectEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String title;

	@Column(nullable = false)
	private String content;

	@Column(name = "thumbnail_url")
	private String thumbnailUrl;

	@Column(name = "view_count")
	private Long viewCount;

	@Column(name = "created_at")
	private LocalDate createdAt;

	@Column(name = "updated_at")
	private LocalDate updatedAt;

	@Column(name = "is_deleted")
	private Boolean isDeleted;

	@ManyToOne
	@JoinColumn(name = "member_id", nullable = false)
	private MemberEntity member;

	public ProjectDTO toProjectDTO() {
		return ProjectDTO.builder()
				.id(id)
				.title(title)
				.content(content)
				.thumbnailUrl(thumbnailUrl)
				.viewCount(viewCount)
				.createdAt(createdAt)
				.updatedAt(updatedAt)
				.isDeleted(isDeleted)
				.member(member)
				.build();
	}
}
