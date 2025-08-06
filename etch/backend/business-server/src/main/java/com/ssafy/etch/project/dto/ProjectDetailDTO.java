package com.ssafy.etch.project.dto;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ProjectDetailDTO {
	private Long id;
	private String title;
	private String content;
	private LocalDate createdAt;
	private LocalDate updatedAt;
	private String nickname;

	public static ProjectDetailDTO from(ProjectDTO projectDTO) {
		return ProjectDetailDTO.builder()
			.id(projectDTO.getId())
			.title(projectDTO.getTitle())
			.content(projectDTO.getContent())
			.createdAt(projectDTO.getCreatedAt())
			.updatedAt(projectDTO.getUpdatedAt())
			.nickname(projectDTO.getMember().toMemberDTO().getNickname())
			.build();
	}
}
