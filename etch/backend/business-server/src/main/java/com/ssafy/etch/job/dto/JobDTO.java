package com.ssafy.etch.job.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Builder
@Getter
public class JobDTO {
    private Long id;
    private String title;
    private LocalDate openingDate;
    private LocalDate expirationDate;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}
