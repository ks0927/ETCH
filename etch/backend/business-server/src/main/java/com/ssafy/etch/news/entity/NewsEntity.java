package com.ssafy.etch.news.entity;

import java.time.LocalDate;

import com.ssafy.etch.company.entity.CompanyEntity;

import com.ssafy.etch.news.dto.NewsDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="news")
public class NewsEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "thumbnail_url")
	private String thumbnailUrl;

	@Column(nullable = false)
	private String title;

	@Column(columnDefinition = "TEXT")
	private String description;

	@Column(unique = true, nullable = false)
	private String url;

	@Column(name = "published_at", nullable = false)
	private LocalDate publishedAt;

	@ManyToOne
	@JoinColumn(name = "company_id", nullable = false)
	private CompanyEntity company;

	public NewsDTO toNewsDTO() {
		return NewsDTO.builder()
				.id(id)
				.thumbnailUrl(thumbnailUrl)
				.title(title)
				.description(description)
				.url(url)
				.publishedAt(publishedAt)
				.company(company)
				.build();
	}
}