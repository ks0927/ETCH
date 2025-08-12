package com.ssafy.etch.job.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class AppliedJobListResponseDTO {
    private Long id;
    private String title;
    private String companyName;
    private LocalDateTime openingDate;
    private LocalDateTime closingDate;
    private String status;
}
