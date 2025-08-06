package com.ssafy.etch.search.document;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.Getter;

@Document(indexName = "news")
@Getter
public class NewsDocument {

	@Id
	private Long newsId;

	@Field(type = FieldType.Text, analyzer = "nori")
	private String title;

	@Field(type = FieldType.Text, analyzer = "nori")
	private String summary;

	@Field(type = FieldType.Text, analyzer = "nori")
	private String companyName;

	@Field(type = FieldType.Keyword)
	private String link;

	@Field(type = FieldType.Keyword)
	private String thumbnailUrl;

	@Field(type = FieldType.Date)
	private LocalDateTime publishedAt;
}
