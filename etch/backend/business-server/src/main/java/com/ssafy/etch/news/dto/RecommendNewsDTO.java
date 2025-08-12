package com.ssafy.etch.news.dto;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class RecommendNewsDTO {
	private Long id;
	private String thumbnailUrl;
	private String title;
	private String description;
	private String url;
	private LocalDate publishedAt;

	public static RecommendNewsDTO from(NewsDTO newsDTO) {
		return RecommendNewsDTO.builder()
			.id(newsDTO.getId())
			.thumbnailUrl(newsDTO.getThumbnailUrl())
			.title(newsDTO.getTitle())
			.description(newsDTO.getDescription())
			.url(newsDTO.getUrl())
			.publishedAt(newsDTO.getPublishedAt())
			.build();
	}
}
