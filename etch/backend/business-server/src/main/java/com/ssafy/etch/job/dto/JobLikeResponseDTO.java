package com.ssafy.etch.job.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class JobLikeResponseDTO {
	private Long id;
	private String title;
	private LocalDateTime openingDate;
	private LocalDateTime expirationDate;

	public static JobLikeResponseDTO from(JobDTO jobDTO) {
		return JobLikeResponseDTO.builder()
			.id(jobDTO.getId())
			.title(jobDTO.getTitle())
			.openingDate(jobDTO.getOpeningDate())
			.expirationDate(jobDTO.getExpirationDate())
			.build();
	}
}
