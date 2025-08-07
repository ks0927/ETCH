package com.ssafy.etch.project.entity;

import java.time.LocalDate;
import java.util.List;

import com.ssafy.etch.file.entity.FileEntity;
import com.ssafy.etch.comment.entity.CommentEntity;
import com.ssafy.etch.member.entity.MemberEntity;

import com.ssafy.etch.project.dto.ProjectDTO;

import jakarta.persistence.*;

@Entity
@Table(name = "project_post")
public class ProjectEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String title;

	@Column(columnDefinition = "TEXT", nullable = false)
	private String content;

	@Column(name = "thumbnail_url")
	private String thumbnailUrl;

	@Column(name = "view_count")
	private Long viewCount;

	@Column(name = "category")
	@Enumerated(EnumType.STRING)
	private ProjectCategory category;

	@Column(name = "created_at")
	private LocalDate createdAt;

	@Column(name = "updated_at")
	private LocalDate updatedAt;

	@Column(name = "is_deleted")
	private Boolean isDeleted;

	@ManyToOne
	@JoinColumn(name = "member_id", nullable = false)
	private MemberEntity member;

	@OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	private List<CommentEntity> comments;

	@OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	private List<FileEntity> files;

	@OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ProjectTechEntity> projectTechs;

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
				.projectTechs(projectTechs)
				.comments(comments)
				.files(files)
				.build();
	}
}
