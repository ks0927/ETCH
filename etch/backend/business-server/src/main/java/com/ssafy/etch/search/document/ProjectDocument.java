package com.ssafy.etch.search.document;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.Getter;

@Document(indexName = "project")
@Getter
public class ProjectDocument {
	@Id
	private Long id;

	@Field(type = FieldType.Text, analyzer = "nori")
	private String title;

	@Field(type = FieldType.Text, analyzer = "nori")
	private String content;

	@Field(type = FieldType.Keyword)
	private String thumbnailUrl;

	@Field(type = FieldType.Date, format = DateFormat.date)
	private LocalDate createdAt;

	@Field(type = FieldType.Date, format = DateFormat.date)
	private LocalDate updatedAt;
}
