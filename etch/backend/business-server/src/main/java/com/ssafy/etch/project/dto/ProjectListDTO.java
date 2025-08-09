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
	private Long likeCount;
	private String nickname;

	public static ProjectListDTO from(ProjectDTO p, Long likeCount) {
		return ProjectListDTO.builder()
			.id(p.getId())
			.title(p.getTitle())
			.thumbnailUrl(p.getThumbnailUrl())
			.viewCount(p.getViewCount())
			.likeCount(likeCount)
			.nickname(p.getMember().toMemberDTO().getNickname())
			.build();
	}

	public static ProjectListDTO from(ProjectDTO p) {
		return from(p, 0L);
	}
}
