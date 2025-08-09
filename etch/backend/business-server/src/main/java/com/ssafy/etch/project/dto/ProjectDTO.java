package com.ssafy.etch.project.dto;

import com.ssafy.etch.comment.entity.CommentEntity;
import com.ssafy.etch.file.entity.FileEntity;
import com.ssafy.etch.member.entity.MemberEntity;

import com.ssafy.etch.project.entity.ProjectTechEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

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
    private String githubUrl;
    private Boolean isPublic;
    private MemberEntity member;
    private List<ProjectTechEntity> projectTechs;
    private List<CommentEntity> comments;
    private List<FileEntity> files;
}
