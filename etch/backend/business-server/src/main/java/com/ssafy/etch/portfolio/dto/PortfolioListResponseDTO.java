package com.ssafy.etch.portfolio.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class PortfolioListResponseDTO {
    private Long id;
    private String name;
    private String introduce;

    public static PortfolioListResponseDTO from(PortfolioDTO portfolioDTO) {
        return PortfolioListResponseDTO.builder()
                .id(portfolioDTO.getId())
                .name(portfolioDTO.getName())
                .introduce(portfolioDTO.getIntroduce())
                .build();
    }
}
