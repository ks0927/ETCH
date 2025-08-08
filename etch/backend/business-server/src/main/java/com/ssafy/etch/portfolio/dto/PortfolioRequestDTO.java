package com.ssafy.etch.portfolio.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class PortfolioRequestDTO {
    private String name;
    private String introduce;
    private String githubUrl;
    private String linkedInUrl;
    private String blogUrl;
    private String techList;
    private String education;
    private String language;
    private Long memberId;
    private List<Long> projectIds;

    public PortfolioDTO toPortfolioDTO() {
        return PortfolioDTO.builder()
                .name(name)
                .introduce(introduce)
                .githubUrl(githubUrl)
                .linkedInUrl(linkedInUrl)
                .blogUrl(blogUrl)
                .techList(techList)
                .education(education)
                .language(language)
                .build();
    }
}
