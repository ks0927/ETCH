package com.ssafy.etch.search.document;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Mapping;
import org.springframework.data.elasticsearch.annotations.Setting;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Document(indexName = "project")
@Getter
@AllArgsConstructor
@Builder
@Setting(settingPath = "/es/project-settings.json")
@Mapping(mappingPath = "/es/project-mappings.json")
public class ProjectDocument {
	@Id
	private Long id;

	@Field(type = FieldType.Text, analyzer = "my_nori_analyzer")
	private String title;

	@Field(type = FieldType.Text, analyzer = "my_nori_analyzer")
	private String content;

	@Field(type = FieldType.Keyword)
	private String thumbnailUrl;

	@Field(type = FieldType.Date, format = DateFormat.date)
	private LocalDate createdAt;

	@Field(type = FieldType.Date, format = DateFormat.date)
	private LocalDate updatedAt;
}
