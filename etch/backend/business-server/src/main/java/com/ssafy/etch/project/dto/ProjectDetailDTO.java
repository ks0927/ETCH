package com.ssafy.etch.project.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ProjectDetailDTO {
	private Long id;
	private String thumbnailUrl;
	private Long viewCount;
	private Long likeCount; 
	private Boolean likedByMe; // 내가 좋아요 눌렀는지 여부
	private String nickname;
	private String profileUrl;
	private String title;
	private String content;
	private LocalDate createdAt;
	private LocalDate updatedAt;
	private List<String> categories;
	private List<String> techCodes;
	private List<String> fileUrls;
	private String githubUrl;
	private Boolean isPublic;

	public static ProjectDetailDTO from(
		ProjectDTO p,
		Long likeCount,
		Boolean likedByMe,
		List<String> categories,
		List<String> techCodes,
		List<String> fileUrls
	) {
		return ProjectDetailDTO.builder()
			.id(p.getId())
			.thumbnailUrl(p.getThumbnailUrl())
			.viewCount(p.getViewCount())
			.likeCount(likeCount)
			.likedByMe(likedByMe)
			.nickname(p.getMember().toMemberDTO().getNickname())
			.profileUrl(p.getMember().toMemberDTO().getProfile())
			.title(p.getTitle())
			.content(p.getContent())
			.createdAt(p.getCreatedAt())
			.updatedAt(p.getUpdatedAt())
			.categories(categories)
			.techCodes(techCodes)
			.fileUrls(fileUrls)
			.githubUrl(p.getGithubUrl())
			.isPublic(p.getIsPublic())
			.build();
	}
}
