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
	private Boolean isPublic;

	public static ProjectListDTO from(ProjectDTO p) {
		return ProjectListDTO.builder()
			.id(p.getId())
			.title(p.getTitle())
			.thumbnailUrl(p.getThumbnailUrl())
			.viewCount(p.getViewCount())
			.likeCount(p.getLikeCount() != null ? p.getLikeCount().longValue() : 0L)
			.nickname(p.getMember().toMemberDTO().getNickname())
			.isPublic(p.getIsPublic())
			.build();
	}
}
