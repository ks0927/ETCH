package com.ssafy.etch.portfolio.dto;

import lombok.Builder;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@RequiredArgsConstructor
@Builder
public class CertAndLangDTO {
    private final String name;
    private final LocalDate date;
    private final String certificateIssuer ;
}
