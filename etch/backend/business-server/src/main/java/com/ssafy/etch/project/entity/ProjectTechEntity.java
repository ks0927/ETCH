package com.ssafy.etch.project.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "project_tech")
@Getter
public class ProjectTechEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_post_id")
    private ProjectEntity project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tech_code_id")
    private TechCodeEntity techCode;
}
