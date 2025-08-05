package com.ssafy.etch.news.dto;

import java.time.LocalDate;

import com.ssafy.etch.news.entity.NewsEntity;

import lombok.Getter;

@Getter
public class LatestNewsDTO {
	private String title;
	private String description;
	private String thumbnailUrl;
	private LocalDate publishedAt;

	public LatestNewsDTO(NewsEntity newsEntity) {
		this.title = newsEntity.getTitle();
		this.description = newsEntity.getDescription();
		this.thumbnailUrl = newsEntity.getThumbnailUrl();
		this.publishedAt = newsEntity.getPublishedAt();
	}
}
