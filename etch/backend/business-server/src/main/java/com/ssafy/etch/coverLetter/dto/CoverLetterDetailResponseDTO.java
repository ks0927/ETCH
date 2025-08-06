package com.ssafy.etch.coverLetter.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class CoverLetterDetailResponseDTO {
    private Long id;
    private String name;
    private String answer1;
    private String answer2;
    private String answer3;
    private String answer4;
    private String answer5;
}
