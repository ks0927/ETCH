package com.ssafy.etch.portfolio.dto;

import com.ssafy.etch.project.dto.ProjectListDTO;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@Getter
public class PortfolioDetailResponseDTO {
    private Long id;
    private String name;
    private String introduce;
    private String githubUrl;
    private String linkedInUrl;
    private String blogUrl;
    private String techList;
    private String education;
    private String language;
    private List<ProjectListDTO> projectList;

    public static PortfolioDetailResponseDTO from(PortfolioDTO portfolioDTO) {
        return builder()
                .id(portfolioDTO.getId())
                .name(portfolioDTO.getName())
                .introduce(portfolioDTO.getIntroduce())
                .githubUrl(portfolioDTO.getGithubUrl())
                .linkedInUrl(portfolioDTO.getLinkedInUrl())
                .blogUrl(portfolioDTO.getBlogUrl())
                .techList(portfolioDTO.getTechList())
                .education(portfolioDTO.getEducation())
                .language(portfolioDTO.getLanguage())
                .projectList(portfolioDTO.getProject().stream()
                        .map(portfolioProjectEntity -> ProjectListDTO.from(portfolioProjectEntity.getProject().toProjectDTO()))
                        .collect(Collectors.toList()))
                .build();
    }
}
