package com.ssafy.etch.portfolio.dto;

import lombok.Builder;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@RequiredArgsConstructor
@Builder
public class EduAndActDTO {
    private final String name;
    private final String description;
    private final LocalDate startDate;
    private final LocalDate endDate;
}
