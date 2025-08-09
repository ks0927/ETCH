package com.ssafy.etch.project.entity;

import static jakarta.persistence.FetchType.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.ssafy.etch.file.entity.FileEntity;
import com.ssafy.etch.comment.entity.CommentEntity;
import com.ssafy.etch.member.entity.MemberEntity;

import com.ssafy.etch.project.dto.ProjectDTO;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "project_post")
@Getter
@NoArgsConstructor
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
	private ProjectCategory category;

	@Column(name = "created_at")
	private LocalDate createdAt;

	@Column(name = "updated_at")
	private LocalDate updatedAt;

	@Column(name = "is_deleted")
	private Boolean isDeleted;

	@Column(name = "github_url")
	private String githubUrl;

	@Column(name = "is_public")
	private Boolean isPublic;

	@ManyToOne(fetch = LAZY)
	@JoinColumn(name = "member_id", nullable = false)
	private MemberEntity member;

	@OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = LAZY)
	private List<CommentEntity> comments;

	@OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = LAZY)
	private List<FileEntity> files = new ArrayList<>();

	@OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ProjectTechEntity> projectTechs = new ArrayList<>();

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
				.githubUrl(githubUrl)
				.isPublic(isPublic)
				.member(member)
				.category(category)
				.projectTechs(projectTechs)
				.comments(comments)
				.files(files)
				.build();
	}

	@Builder
	private ProjectEntity(String title, String content, ProjectCategory category,
		String githubUrl, Boolean isPublic, MemberEntity member) {
		this.title = title;
		this.content = content;
		this.category = category;
		this.githubUrl = githubUrl;
		this.isPublic = isPublic;
		this.member = member;
		this.viewCount = 0L;
		this.isDeleted = false;
		this.createdAt = LocalDate.now();
		this.updatedAt = LocalDate.now();
	}

	public void hit() { this.viewCount = this.viewCount + 1; }

	public void changeThumbnail(String url) { this.thumbnailUrl = url; }

	public void change(String title, String content, ProjectCategory category,
		String githubUrl, Boolean isPublic) {
		this.title = title;
		this.content = content;
		this.category = category;
		this.githubUrl = githubUrl;
		this.isPublic = isPublic;
		this.updatedAt = LocalDate.now();
	}

	public void addFile(FileEntity file) {
		this.files.add(file);
	}

	public void addProjectTech(ProjectTechEntity link) {
		this.projectTechs.add(link);
	}
}
