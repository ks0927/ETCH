package com.ssafy.etch.project.dto;

import java.util.List;

import com.ssafy.etch.project.entity.ProjectCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ProjectCreateRequestDTO {

	@NotBlank
	private String title;

	@NotBlank @Size(max = 10000)
	private String content;

	@NotNull
	private ProjectCategory category; // 프로젝트 자체 분류

	@NotNull @Size(min = 1)
	private List<Long> techCodeIds; // 기술스택 ID 분류

	@Pattern(regexp = "^(https?://github\\.com/.+)?$")
	private String githubUrl;

	@NotNull
	private Boolean isPublic;
}
