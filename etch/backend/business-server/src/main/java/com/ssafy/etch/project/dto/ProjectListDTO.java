package com.ssafy.etch.project.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ProjectListDTO {
	private Long id;
	private String title;
	private String thumbnailUrl;
	private Long viewCount;
	private String nickname;

	public static ProjectListDTO from(ProjectDTO projectDTO) {
		return ProjectListDTO.builder()
			.id(projectDTO.getId())
			.title(projectDTO.getTitle())
			.thumbnailUrl(projectDTO.getThumbnailUrl())
			.viewCount(projectDTO.getViewCount())
			.nickname(projectDTO.getMember().toMemberDTO().getNickname())
			.build();
	}
}
