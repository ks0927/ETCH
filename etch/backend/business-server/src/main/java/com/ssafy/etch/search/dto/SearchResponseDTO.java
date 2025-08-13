package com.ssafy.etch.search.dto;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class SearchResponseDTO {

	private int jobCount;
	private int newsCount;
	private int projectCount;
	private List<JobSearchResponseDTO> jobs;
	private List<NewsSearchResponseDTO> news;
	private List<ProjectSearchResponseDTO> projects;

	public static SearchResponseDTO from(List<JobSearchResponseDTO> jobs, List<NewsSearchResponseDTO> news,
		List<ProjectSearchResponseDTO> projects) {
		return SearchResponseDTO.builder()
			.jobCount(jobs.size())
			.newsCount(news.size())
			.projectCount(projects.size())
			.jobs(jobs)
			.news(news)
			.projects(projects)
			.build();
	}
}
