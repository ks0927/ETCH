package com.ssafy.etch.portfolio.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@RequiredArgsConstructor
@Builder
public class CertAndLangDTO {
    private final String name;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private final LocalDate date;
    private final String certificateIssuer ;
}
