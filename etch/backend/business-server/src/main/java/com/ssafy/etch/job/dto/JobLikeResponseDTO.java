package com.ssafy.etch.job.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Builder
@Getter
public class JobLikeResponseDTO {
    private Long id;
    private String title;
    private LocalDate openingDate;
    private LocalDate expirationDate;

    public static JobLikeResponseDTO from(JobDTO jobDTO) {
        return JobLikeResponseDTO.builder()
                .id(jobDTO.getId())
                .title(jobDTO.getTitle())
                .openingDate(jobDTO.getOpeningDate())
                .expirationDate(jobDTO.getExpirationDate())
                .build();
    }
}
