package com.ssafy.etch.project.dto;

import com.ssafy.etch.member.entity.MemberEntity;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Builder
@Getter
public class ProjectDTO {
    private Long id;
    private String title;
    private String content;
    private String thumbnailUrl;
    private Long viewCount;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private Boolean isDeleted;
    private MemberEntity member;
}
